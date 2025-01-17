import re
import sys
import queue
import threading
import pyaudio
from google.cloud import speech
from google.oauth2 import service_account
import os
import json
import argparse
from pathlib import Path
import logging
from datetime import datetime
import logging.handlers

# 오디오 관련 상수
RATE = 16000
CHUNK = int(RATE / 10)

# 환경 설정 관련 상수
DEFAULT_CREDENTIALS_PATH = r"C:\Users\SSAFY\Documents\credential\sunlit-inquiry-448102-c1-c2fadc20f6c9.json"
DEFAULT_OUTPUT_PATH = r"C:\Users\SSAFY\Desktop\workspace\STTv3\recorded_text.txt"
DEFAULT_CONFIG_PATH = "config.json"
DEFAULT_LANGUAGE_CODE = "ko-KR"
DEFAULT_KEYWORDS = ["도윤아", "엄도윤", "도윤"]
DEFAULT_LOG_PATH = "logs"

def setup_logging(log_path=DEFAULT_LOG_PATH):
    """로깅 설정"""
    # 로그 디렉토리 생성
    log_dir = Path(log_path)
    log_dir.mkdir(parents=True, exist_ok=True)

    # 현재 시간을 파일명에 포함
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_file = log_dir / f'speech_recognition_{timestamp}.log'

    # 로거 설정
    logger = logging.getLogger('SpeechRecognition')
    logger.setLevel(logging.DEBUG)

    # 파일 핸들러 설정 (일별 로그 로테이션)
    file_handler = logging.handlers.TimedRotatingFileHandler(
        log_file, when='midnight', interval=1, backupCount=7, encoding='utf-8'
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(file_formatter)

    # 콘솔 핸들러 설정
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)

    # 핸들러 추가
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger

class ConfigManager:
    """설정을 관리하는 클래스"""
    
    def __init__(self, config_path=None, logger=None):
        self.logger = logger or logging.getLogger('SpeechRecognition')
        self.config_path = config_path or DEFAULT_CONFIG_PATH
        self.config = self.load_config()

    def load_config(self):
        """설정 파일을 로드하거나 기본값을 반환"""
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                self.logger.info(f"설정 파일을 성공적으로 로드했습니다: {self.config_path}")
                return config
            except json.JSONDecodeError as e:
                self.logger.error(f"설정 파일 파싱 실패: {e}")
                self.logger.info("기본 설정값을 사용합니다.")
        else:
            self.logger.warning(f"설정 파일이 없습니다: {self.config_path}")
            self.logger.info("기본 설정값을 사용합니다.")
        
        return {
            "credentials_path": DEFAULT_CREDENTIALS_PATH,
            "output_path": DEFAULT_OUTPUT_PATH,
            "language_code": DEFAULT_LANGUAGE_CODE,
            "keywords": DEFAULT_KEYWORDS
        }

    def save_config(self):
        """현재 설정을 파일로 저장"""
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, ensure_ascii=False, indent=2)
            self.logger.info(f"설정을 파일에 저장했습니다: {self.config_path}")
        except Exception as e:
            self.logger.error(f"설정 저장 실패: {e}")

class MicrophoneStream:
    """마이크 입력을 실시간으로 스트리밍하는 클래스."""

    def __init__(self, rate, chunk, logger=None):
        self.logger = logger or logging.getLogger('SpeechRecognition')
        self._rate = rate
        self._chunk = chunk
        self._buff = queue.Queue()
        self.closed = True
        self.logger.debug("MicrophoneStream 초기화됨")

    def __enter__(self):
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
        self.logger.info("마이크 스트림이 시작되었습니다")
        return self

    def __exit__(self, type, value, traceback):
        self._audio_stream.stop_stream()
        self._audio_stream.close()
        self.closed = True
        self._buff.put(None)
        self._audio_interface.terminate()
        self.logger.info("마이크 스트림이 종료되었습니다")

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self):
        while not self.closed:
            chunk = self._buff.get()
            if chunk is None:
                return
            data = [chunk]

            while True:
                try:
                    chunk = self._buff.get(block=False)
                    if chunk is None:
                        return
                    data.append(chunk)
                except queue.Empty:
                    break

            yield b''.join(data)

class KeywordHandler:
    """키워드 감지 및 스트림 종료를 처리하는 클래스."""

    def __init__(self, keywords=None, logger=None):
        self.logger = logger or logging.getLogger('SpeechRecognition')
        self.keywords = keywords or ["영웅아", "영웅"]
        self.keyword_detected = False
        self.should_terminate = False
        self.recorded_text = []
        self.last_transcript = ""
        self.lock = threading.Lock()
        self.logger.debug(f"KeywordHandler 초기화됨. 키워드: {self.keywords}")

    def process_transcript(self, transcript):
        """전달된 텍스트에서 키워드를 감지하고, 상태를 업데이트."""
        if not self.keyword_detected:
            for keyword in self.keywords:
                if re.search(rf'\b{keyword}\b', transcript, re.I):
                    self.logger.info(f"키워드 '{keyword}' 감지됨")
                    with self.lock:
                        self.keyword_detected = True
                    break
        else:
            if "종료" in transcript:
                with self.lock:
                    self.should_terminate = True
                self.logger.info("종료 명령이 감지되었습니다")
            else:
                if len(transcript) > len(self.last_transcript):
                    new_text = transcript
                    if self.recorded_text:
                        last_recorded = self.recorded_text[-1]
                        if transcript.startswith(last_recorded):
                            new_text = transcript[len(last_recorded):].strip()
                    
                    if new_text:
                        self.recorded_text.append(new_text)
                        self.logger.debug(f"텍스트 기록: {new_text}")
                
                self.last_transcript = transcript

class SpeechRecognizer:
    """Google Cloud Speech-to-Text API를 사용하여 실시간 음성 인식을 처리하는 클래스."""

    def __init__(self, credentials_path, language_code='ko-KR', logger=None):
        self.logger = logger or logging.getLogger('SpeechRecognition')
        self.credentials_path = credentials_path
        self.language_code = language_code
        self.client = self._initialize_client()
        self.logger.debug("SpeechRecognizer 초기화됨")

    def _initialize_client(self):
        try:
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path
            )
            self.logger.info("Google Cloud 클라이언트 인증 성공")
            return speech.SpeechClient(credentials=credentials)
        except Exception as e:
            self.logger.error(f"Google Cloud 클라이언트 인증 실패: {e}")
            raise

    def get_streaming_config(self):
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=RATE,
            language_code=self.language_code,
            max_alternatives=1,
        )

        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True,
        )

        self.logger.debug("스트리밍 설정이 생성되었습니다")
        return streaming_config

    def stream_recognize(self, streaming_config, audio_generator):
        requests = (speech.StreamingRecognizeRequest(audio_content=content)
                    for content in audio_generator)

        try:
            responses = self.client.streaming_recognize(streaming_config, requests)
            self.logger.info("음성 인식 스트림이 시작되었습니다")
            return responses
        except Exception as e:
            self.logger.error(f"음성 인식 스트림 생성 실패: {e}")
            raise

def listen_print_loop(responses, keyword_handler, stop_event):
    """응답을 받아 텍스트를 출력하고 키워드를 처리하는 함수."""
    logger = logging.getLogger('SpeechRecognition')
    num_chars_printed = 0
    
    try:
        for response in responses:
            if not response.results:
                continue

            result = response.results[0]
            if not result.alternatives:
                continue

            transcript = result.alternatives[0].transcript.strip()
            overwrite_chars = ' ' * (num_chars_printed - len(transcript))

            if not result.is_final:
                sys.stdout.write(transcript + overwrite_chars + '\r')
                sys.stdout.flush()
                num_chars_printed = len(transcript)
                keyword_handler.process_transcript(transcript)
                if keyword_handler.keyword_detected and keyword_handler.should_terminate:
                    logger.info("임시 결과에서 종료 조건이 감지되었습니다")
                    stop_event.set()
                    break
            else:
                print(transcript + overwrite_chars)
                keyword_handler.process_transcript(transcript)

                if keyword_handler.keyword_detected and keyword_handler.should_terminate:
                    logger.info("최종 결과에서 종료 조건이 감지되었습니다")
                    stop_event.set()
                    break

                num_chars_printed = 0
    except Exception as e:
        logger.error(f"음성 인식 처리 중 오류 발생: {e}")
        stop_event.set()

def main():
    """메인 함수."""
    # 로깅 설정
    logger = setup_logging()
    logger.info("프로그램이 시작되었습니다")

    try:
        # 설정 초기화
        config_manager = ConfigManager(logger=logger)
        config = config_manager.config

        # 음성 인식기 초기화
        speech_recognizer = SpeechRecognizer(
            credentials_path=config['credentials_path'],
            language_code=config['language_code'],
            logger=logger
        )
        streaming_config = speech_recognizer.get_streaming_config()

        # KeywordHandler 초기화
        keyword_handler = KeywordHandler(keywords=config['keywords'], logger=logger)
        stop_event = threading.Event()

        with MicrophoneStream(RATE, CHUNK, logger=logger) as stream:
            audio_generator = stream.generator()
            responses = speech_recognizer.stream_recognize(streaming_config, audio_generator)

            listener_thread = threading.Thread(
                target=listen_print_loop,
                args=(responses, keyword_handler, stop_event)
            )
            listener_thread.start()
            stop_event.wait()
            stream.closed = True
            listener_thread.join()

        # 결과 저장
        if keyword_handler.recorded_text:
            recorded_text = ' '.join(keyword_handler.recorded_text)
            output_path = config['output_path']
            with open(output_path, "w", encoding='utf-8') as f:
                f.write(recorded_text)
            logger.info(f"기록된 텍스트를 저장했습니다: {output_path}")
        else:
            logger.info("기록된 텍스트가 없습니다")

    except Exception as e:
        logger.error(f"프로그램 실행 중 오류 발생: {e}")
    finally:
        logger.info("프로그램이 종료되었습니다")

if __name__ == '__main__':
    main()