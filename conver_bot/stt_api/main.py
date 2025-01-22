# stt_api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import logging
import pyaudio
import queue
import numpy as np
from google.cloud import speech
from google.oauth2 import service_account
import os
from dotenv import load_dotenv
import time
import threading
from pydantic import BaseModel
import sys
from enum import Enum

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('stt_test.log')
    ]
)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 상수 정의
RATE = 16000
CHUNK = int(RATE / 10)  # 100ms 청크
MAX_CHUNK_SIZE = 15360  # 960ms 이내의 오디오 데이터 크기
DEFAULT_KEYWORDS = ["영웅", "영웅아", "영웅이", "영웅.", "영웅아.", "영웅이.", 
                    "영웅!", "영웅아!", "영웅이!", "영웅?", "영웅아?", "영웅이?", "영웅~", "영웅아~", "영웅이~"]
TERMINATION_KEYWORDS = ["종료", "그만", "멈춰", "끝", "종료해줘"]

class STTMode(Enum):    # 음성 인식 모드
    KEYWORD_DETECTION = "keyword_detection"
    SPEECH_RECOGNITION = "speech_recognition"

class AudioStream:  # 오디오 스트림 클래스
    def __init__(self, rate=RATE, chunk=CHUNK):
        self._rate = rate
        self._chunk = chunk 
        self._buff = queue.Queue()  
        self.closed = True  
        self._audio_interface = None    
        self._audio_stream = None   
        self._resource_lock = threading.Lock()  
        logger.info("AudioStream 초기화 완료")  

    def __enter__(self):    # 오디오 스트림 시작
        with self._resource_lock:   
            try:
                self._audio_interface = pyaudio.PyAudio()   
                self._audio_stream = self._audio_interface.open(
                    format=pyaudio.paInt16,
                    channels=1,
                    rate=self._rate,    
                    input=True,
                    frames_per_buffer=self._chunk,
                    stream_callback=self._fill_buffer,
                )
                self.closed = False 
                logger.info("오디오 스트림 시작")   
                return self
            except Exception as e:
                logger.error(f"오디오 스트림 초기화 실패: {e}")
                self.cleanup()
                raise

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()
        logger.info("오디오 스트림 종료")

    def cleanup(self):  # 오디오 스트림 종료
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

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):  # 오디오 버퍼 채우기
        try:
            if self.closed:
                return None, pyaudio.paComplete
            
            self._buff.put(in_data)
            return None, pyaudio.paContinue

        except Exception as e:
            logger.error(f"버퍼 채우기 오류: {e}")
            return None, pyaudio.paAbort

    def generator(self):    # 오디오 데이터 생성기
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

class STTManager:   # 음성 인식 매니저
    def __init__(self):
        try:
            credentials_path = os.getenv("GOOGLE_CREDENTIALS_PATH")
            if not credentials_path or not os.path.exists(credentials_path):
                raise ValueError(f"Google Cloud 인증 파일을 찾을 수 없습니다: {credentials_path}")

            credentials = service_account.Credentials.from_service_account_file(credentials_path)
            self.client = speech.SpeechClient(credentials=credentials)
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
            # 키워드 감지 모드: 짧은 발화만 감지
            return speech.StreamingRecognitionConfig(
                config=config,
                interim_results=True,
                single_utterance=True
            )
        else:
            # 음성 인식 모드: 긴 발화 처리
            return speech.StreamingRecognitionConfig(
                config=config,
                interim_results=True,
                single_utterance=True
            )

    async def detect_keyword(self):
        """시작 키워드 감지"""
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
                                return True
                        logger.info("시작 키워드 없음")
                        return False

            return False

        except Exception as e:
            logger.error(f"키워드 감지 중 오류: {e}")
            return False

    async def process_speech(self):
        """실제 음성 인식 처리"""
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
                        words = transcript.split()
                        # 종료 키워드 체크
                        if words and words[-1].rstrip('.!?') in TERMINATION_KEYWORDS:
                            logger.info(f"종료 키워드 감지됨: {words[-1]}")
                        final_text = transcript
                        break

                return final_text

        except Exception as e:
            logger.error(f"음성 인식 중 오류: {e}")
            return None

class STTResponse(BaseModel):   # 음성 인식 결과 응답
    text: str | None = None
    error: str | None = None

@app.post("/speech-to-text", response_model=STTResponse)    # 음성 인식 API
async def speech_to_text(): # 음성 인식 처리
    try:
        logger.info("음성 인식 요청 시작")
        stt_manager = STTManager()
        
        # 1단계: 키워드 감지
        keyword_detected = await asyncio.wait_for(
            stt_manager.detect_keyword(),
            timeout=10.0  # 10초 안에 키워드가 없으면 종료
        )
        
        if not keyword_detected:
            logger.info("시작 키워드가 감지되지 않음")
            return STTResponse(error="시작 키워드가 감지되지 않았습니다")

        # 2단계: 실제 음성 인식
        text = await asyncio.wait_for(
            stt_manager.process_speech(),
            timeout=90.0
        )
        
        if not text:
            logger.info("음성 인식 결과 없음")
            return STTResponse(error="음성이 감지되지 않았습니다")
            
        logger.info(f"음성 인식 성공: {text}")
        return STTResponse(text=text)
        
    except asyncio.TimeoutError:    # 시간 초과 예외 처리
        logger.error("음성 인식 시간 초과")
        raise HTTPException(
            status_code=504,
            detail="음성 인식 시간이 초과되었습니다"
        )
    except Exception as e:
        logger.error(f"음성 인식 처리 중 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

if __name__ == "__main__":  # 서버 실행
    import uvicorn
    logger.info("STT API 서버 시작")
    uvicorn.run(app, host="0.0.0.0", port=8002)