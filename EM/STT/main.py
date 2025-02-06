import os
import warnings
warnings.filterwarnings("ignore")

# ALSA 및 JACK 에러 메시지 숨기기
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
# PyAudio가 ALSA/JACK을 초기화하기 전에 환경 변수 설정
os.environ['JACK_NO_START_SERVER'] = '1'

# ALSA 에러 핸들러
import ctypes
ERROR_HANDLER_FUNC = ctypes.CFUNCTYPE(None, ctypes.c_char_p, ctypes.c_int,
                                     ctypes.c_char_p, ctypes.c_int,
                                     ctypes.c_char_p)

def py_error_handler(filename, line, function, err, fmt):
    pass

c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)

try:
    asound = ctypes.CDLL('libasound.so.2')
    asound.snd_lib_error_set_handler(c_error_handler)
except:
    pass



import asyncio
import logging
import pyaudio
import queue
import numpy as np
from google.cloud import speech
from google.oauth2 import service_account
from dotenv import load_dotenv
import time
import threading
from enum import Enum
import aiohttp
from gtts import gTTS
import pygame


# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('stt_test.log')
    ]
)
logging.getLogger('pyaudio').setLevel(logging.ERROR)
logger = logging.getLogger(__name__)

# 상수 정의
RATE = 44100
CHUNK = int(RATE / 10)  # 100ms 청크
MAX_CHUNK_SIZE = 15360  # 960ms 이내의 오디오 데이터 크기
DEFAULT_KEYWORDS = ["영웅", "영웅아", "영웅이", "영웅.", "영웅아.", "영웅이.", 
                   "영웅!", "영웅아!", "영웅이!", "영웅?", "영웅아?", "영웅이?", "영웅~", "영웅아~", "영웅이~",
                   "영웅왕.", "영웅왕!", "영웅왕?", "영화", "영화.", "영화!", "영웅왕"]
TERMINATION_KEYWORDS = ["종료", "그만", "멈춰", "끝", "종료해줘"]

class STTMode(Enum):
    KEYWORD_DETECTION = "keyword_detection"
    SPEECH_RECOGNITION = "speech_recognition"

# AudioStream 
class AudioStream:
    def __init__(self, rate=RATE, chunk=CHUNK):
        self._rate = rate
        self._chunk = chunk 
        self._buff = queue.Queue()  
        self.closed = True  
        self._audio_interface = None    
        self._audio_stream = None   
        self._resource_lock = threading.Lock()  
        logger.info("AudioStream 초기화 완료")  

    def __enter__(self):
        with self._resource_lock:   
            try:
                self._audio_interface = pyaudio.PyAudio()   
                
                # 사용 가능한 입력 장치 찾기
                device_index = None
                for i in range(self._audio_interface.get_device_count()):
                    device_info = self._audio_interface.get_device_info_by_index(i)
                    print(f"Device {i}: {device_info['name']}")
                    if device_info['maxInputChannels'] > 0:  # 입력 장치인 경우
                        device_index = i
                        break

                self._audio_stream = self._audio_interface.open(
                    format=pyaudio.paInt16,
                    channels=1,
                    rate=self._rate,    
                    input=True,
                    input_device_index=device_index,  # 찾은 장치 인덱스 사용
                    frames_per_buffer=self._chunk,
                    stream_callback=self._fill_buffer,
                )
                self.closed = False 
                logger.info(f"오디오 스트림 시작 (device_index: {device_index})")   
                return self
              
            except Exception as e:
                logger.error(f"오디오 스트림 초기화 실패: {e}")
                self.cleanup()
                raise

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()
        logger.info("오디오 스트림 종료")

    def cleanup(self):
        with self._resource_lock:
            self.closed = True
            if hasattr(self, '_audio_stream') and self._audio_stream:   
                try:
                    self._audio_stream.stop_stream()
                    self._audio_stream.close()
                except Exception as e:
                    logger.error(f"오디오 스트림 종료 오류: {e}")
            if hasattr(self, '_audio_interface') and self._audio_interface:
                try:
                    self._audio_interface.terminate()
                except Exception as e:
                    logger.error(f"PyAudio 종료 오류: {e}")
            self._buff.put(None)

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        try:
            if self.closed:
                return None, pyaudio.paComplete
            
            self._buff.put(in_data)
            return None, pyaudio.paContinue

        except Exception as e:
            logger.error(f"버퍼 채우기 오류: {e}")
            return None, pyaudio.paAbort

    def generator(self):
        accumulated_chunk = b""
        
        while not self.closed:
            chunk = self._buff.get()
            if chunk is None:
                return
            
            accumulated_chunk += chunk
            
            while len(accumulated_chunk) >= MAX_CHUNK_SIZE:
                yield accumulated_chunk[:MAX_CHUNK_SIZE]
                accumulated_chunk = accumulated_chunk[MAX_CHUNK_SIZE:]
            
        if accumulated_chunk:
            yield accumulated_chunk

class STTManager:
   def __init__(self):
        try:
            credentials_path = os.getenv("GOOGLE_CREDENTIALS_PATH")
            if not credentials_path or not os.path.exists(credentials_path):
                raise ValueError(f"Google Cloud 인증 파일을 찾을 수 없습니다: {credentials_path}")

            credentials = service_account.Credentials.from_service_account_file(credentials_path)
            self.client = speech.SpeechClient(credentials=credentials)
            self.session_id = None
            self.user_id = None
            
            try:
                with open('user_id.txt', 'r') as f:
                    self.user_id = f.read().strip()
                    logger.info(f"User ID loaded: {self.user_id}")

            except FileExistsError:
                logger.error('user_id.txt 파일을 찾을 수 없습니다.')
                raise

            # TTS 출력 디렉토리 설정
            self.tts_output_dir = "tts_output"
            os.makedirs(self.tts_output_dir, exist_ok=True)
            
            # pygame 초기화 
            pygame.mixer.init()
            
            # 시작음 알림
            self.start_sound = pygame.mixer.Sound('start_audio.mp3')
            
            logger.info("STT 매니저 초기화 완료")
        except Exception as e:
            logger.error(f"STT 매니저 초기화 실패: {e}")
            raise

   def get_config(self, mode: STTMode): 
       config = speech.RecognitionConfig(
           encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
           sample_rate_hertz=RATE,
           language_code="ko-KR",
           enable_automatic_punctuation=True
       )
       
       if mode == STTMode.KEYWORD_DETECTION:
           return speech.StreamingRecognitionConfig(
               config=config,
               interim_results=True,
               single_utterance=True
           )
       else:
           return speech.StreamingRecognitionConfig(
               config=config,
               interim_results=True,
               single_utterance=True
           )

   def generate_speech(self, text):
       try:
           print(f"\n입력 텍스트: {text}")
           start_time = time.time()

           # 음성 파일 경로 생성
           output_path = os.path.join(self.tts_output_dir, "tts_output.mp3")
           
           # 기존 파일이 있다면 삭제
           if os.path.exists(output_path):
               os.remove(output_path)
           
           # gTTS로 음성 생성  
           tts = gTTS(text=text, lang='ko')
           tts.save(output_path)

           end_time = time.time()
           print(f"처리 시간: {end_time - start_time:.2f}초")
           print(f"음성 파일 경로: {output_path}")
           print(f"파일 존재 여부: {os.path.exists(output_path)}")

           return output_path

       except Exception as e:
           print(f"음성 생성 중 에러 발생: {str(e)}")
           raise

   def play_audio(self, audio_path):
       try:
           pygame.mixer.music.load(audio_path)
           pygame.mixer.music.play()
           while pygame.mixer.music.get_busy():
               time.sleep(0.1)
           # 재생 후 파일 삭제
           os.remove(audio_path)
       except Exception as e:
           logger.error(f"음성 재생 중 오류: {e}")

   async def detect_keyword(self):
       try:
           logger.info("키워드 감지 모드 시작")
           config = self.get_config(STTMode.KEYWORD_DETECTION)
           
           with AudioStream() as stream:
               requests = (
                   speech.StreamingRecognizeRequest(audio_content=content)
                   for content in stream.generator()
               )
               responses = self.client.streaming_recognize(config, requests)
               
               for response in responses:
                   if not response.results:
                       continue

                   result = response.results[0]
                   if not result.alternatives:
                       continue

                   transcript = result.alternatives[0].transcript.lower().strip()
                   
                   if result.is_final:
                       logger.info(f"키워드 감지 모드 - 텍스트: {transcript}")
                       words = transcript.split()
                       for word in words:
                           if word in DEFAULT_KEYWORDS:
                               logger.info(f"시작 키워드 감지됨: {word}")
                               self.start_sound.play()
                               return True
                       logger.info("시작 키워드 없음")
                       return False

           return False

       except Exception as e:
           logger.error(f"키워드 감지 중 오류: {e}")
           return False

   async def process_speech(self):
       try:
           logger.info("음성 인식 모드 시작")
           config = self.get_config(STTMode.SPEECH_RECOGNITION)
           
           with AudioStream() as stream:
               requests = (
                   speech.StreamingRecognizeRequest(audio_content=content)
                   for content in stream.generator()
               )
               responses = self.client.streaming_recognize(config, requests)
               
               final_text = None
               
               for response in responses:
                   if not response.results:
                       continue

                   result = response.results[0]
                   if not result.alternatives:
                       continue

                   transcript = result.alternatives[0].transcript.strip()
                   
                   if result.is_final:
                       logger.info(f"최종 텍스트 감지: {transcript}")
                       final_text = transcript
                       
                       try:
                           timeout = aiohttp.ClientTimeout(total=30)
                           async with aiohttp.ClientSession(timeout=timeout) as session:
                               url = "http://70.12.246.26:8000/chat"
                               payload = {
                                   "user_id": self.user_id,
                                   "user_message": final_text,
                                   "session_id": self.session_id  # 저장된 세션 ID 사용
                               }
                               async with session.post(url, json=payload) as response:
                                   if response.status == 200:
                                       result = await response.json()
                                       self.session_id = result.get('session_id')
                                       logger.info(f"API 응답: {result}")
                                       
                                       # 봇 응답을 TTS로 변환하고 재생
                                       bot_message = result.get('bot_message')
                                       if bot_message:
                                           tts_path = self.generate_speech(bot_message)
                                           self.play_audio(tts_path)
                                   else:
                                       logger.error(f"API 오류: {response.status}")
                       except Exception as e:
                           logger.error(f"API 요청 중 오류: {e}")
                       
                       break

               return final_text

       except Exception as e:
           logger.error(f"음성 인식 중 오류: {e}")
           return None

async def main():
    try:
        stt_manager = STTManager()
        while True:
            # 1단계: 키워드 감지
            keyword_detected = await stt_manager.detect_keyword()
            
            if keyword_detected:
                logger.info("키워드 감지됨, 음성 인식 시작")
                # 2단계: 실제 음성 인식
                text = await stt_manager.process_speech()
                if text:
                    logger.info(f"인식된 텍스트: {text}")
                    # TODO: OpenAI API 호출 및 TTS 처리
            
    except KeyboardInterrupt:
        logger.info("프로그램 종료")
    except Exception as e:
        logger.error(f"실행 중 오류 발생: {e}")

if __name__ == "__main__":
    asyncio.run(main())