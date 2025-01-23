# user_api/main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI  
import mariadb
import os
import sys
import traceback
from datetime import datetime, timedelta
import uuid
from fastapi.staticfiles import StaticFiles
import requests
import urllib3
import asyncio
import numpy as np
from typing import Dict, Tuple, Optional

from dotenv import load_dotenv

from gtts import gTTS
import time
from datetime import datetime, timedelta

import logging
import aiohttp
from aiohttp import ClientSession, ClientTimeout

from google.cloud import speech
from google.oauth2 import service_account
from google.api_core.exceptions import OutOfRange 
import pyaudio
import queue
import threading
from pathlib import Path

from concurrent.futures import ThreadPoolExecutor
from functools import partial

import json
from fastapi import Body

# 환경 변수 로드
load_dotenv()

# 글로벌 설정
WEATHER_CACHE_DURATION = 3600  # 1시간
DISASTER_CACHE_DURATION = 300  # 5분
THREAD_POOL_MAX_WORKERS = 4
WEATHER_SEMAPHORE_LIMIT = 10
RETRY_COUNT = 3
API_TIMEOUT = 10

# 전역 ThreadPoolExecutor 및 세마포어 설정
thread_pool = ThreadPoolExecutor(max_workers=THREAD_POOL_MAX_WORKERS)
weather_semaphore = asyncio.Semaphore(WEATHER_SEMAPHORE_LIMIT)

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 로깅 설정
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

tts_output_dir = os.path.join(os.getcwd(), 'tts_output')
os.makedirs(tts_output_dir, exist_ok=True)


class SimpleTTSTest:
    def __init__(self, save_path=tts_output_dir):
        print("TTS 테스트 초기화...")
        self.save_path = save_path
        os.makedirs(self.save_path, exist_ok=True)

    def generate_speech(self, text):
        try:
            print(f"\n입력 텍스트: {text}")
            start_time = time.time()

            # 음성 파일 경로 생성
            output_path = os.path.join(self.save_path, f"tts_{int(time.time())}.mp3")

            # gTTS로 음성 생성
            tts = gTTS(text=text, lang='ko')
            tts.save(output_path)

            end_time = time.time()
            print(f"처리 시간: {end_time - start_time:.2f}초")

            return output_path

        except Exception as e:
            print(f"음성 생성 중 에러 발생: {str(e)}")
            raise


# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI 앱 초기화
app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

def get_db_connection():
    try:
        conn = mariadb.connect(
            host="stg-yswa-kr-practice-db-master.mariadb.database.azure.com",
            user="S12P11A102@stg-yswa-kr-practice-db-master.mariadb.database.azure.com",
            password=os.getenv("DB_PASSWORD"),
            database="S12P11A102"
        )
        return conn
    except mariadb.Error as e:
        print(f"데이터베이스 연결 오류: {e}")
        raise

def create_or_get_session(user_id=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    current_time = datetime.now()

    try:
        if not user_id:
            # 새 세션 생성
            session_id = str(uuid.uuid4())
            cursor.execute(
                "INSERT INTO chat_sessions (session_id, user_id, created_at, last_active) VALUES (?, ?, ?, ?)",
                (session_id, str(uuid.uuid4()), current_time, current_time)
            )
            conn.commit()
            return session_id
        else:
            # 기존 세션 업데이트
            cursor.execute(
                "UPDATE chat_sessions SET last_active = ? WHERE session_id = ?",
                (current_time, user_id)
            )
            conn.commit()
            return user_id

    except Exception as e:
        print(f"세션 관리 오류: {e}")
        raise
    finally:
        conn.close()

def get_conversation_history(session_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 최근 5개의 메시지 조회 (오래된 순서)
        cursor.execute(
            """SELECT role, content 
               FROM conversation_history 
               WHERE session_id = ? 
               ORDER BY created_at ASC 
               LIMIT 5""", 
            (session_id,)
        )
        return cursor.fetchall()
    except Exception as e:
        print(f"대화 히스토리 조회 오류: {e}")
        return []
    finally:
        conn.close()

def save_message_to_history(session_id, role, content):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """INSERT INTO conversation_history 
            (session_id, role, content, created_at) 
            VALUES (?, ?, ?, ?)""",
            (session_id, role, content, datetime.now())
        )
        conn.commit()
    except Exception as e:
        print(f"메시지 저장 오류: {e}")
    finally:
        conn.close()

class ChatRequest(BaseModel):
    session_id: str | None = None # 세션 ID가 없으면 새로운 세션 생성
    user_message: str

class ChatResponse(BaseModel):
    session_id: str
    bot_message: str
    tts_path: str | None = None  

async def get_daily_conversations(user_id: str, date: str = None):
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    
    print(f"Attempting to fetch conversations for date: {date}")  # 로그 추가
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT user_message, bot_message, created_at 
            FROM silvercare_chat_logs 
            WHERE DATE(created_at) = %s
            ORDER BY created_at
        """
        print(f"Executing query: {query} with date: {date}")  # 로그 추가
        
        cursor.execute(query, (date,))
        conversations = cursor.fetchall()
        
        print(f"Retrieved {len(conversations)} conversations")  # 로그 추가
        print(f"Sample data: {conversations[:2]}")  # 첫 두 개의 대화 내용 출력
        
        return conversations
    
    except Exception as e:
        print(f"Database error: {str(e)}")  # 에러 로그 추가
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

app.mount("/tts_output", StaticFiles(directory=tts_output_dir), name="tts")

@app.get("/conversations")
async def get_conversations(user_id: str, date: str = None):
    try:
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT user_message, bot_message, created_at 
            FROM silvercare_chat_logs 
            WHERE DATE(created_at) = %s
            ORDER BY created_at
        """
        cursor.execute(query, (date,))
        conversations = cursor.fetchall()
        
        conn.close()
        return conversations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    try:
        logger.info(f"챗봇 요청 수신: {request.user_message}")
        
        # 세션 관리
        session_id = create_or_get_session(request.session_id)
        logger.info(f"세션 ID: {session_id}")
        
        # 대화 히스토리 조회
        history = get_conversation_history(session_id)
        
        messages = [
            {
                "role": "system", 
                "content": """
                당신은 독거노인을 위한 따뜻하고 친절한 AI 돌봄 도우미 영웅이 입니다. 
                노인분들의 외로움을 달래주고 편안한 대화를 나누며, 
                존댓말을 사용하고 너무 어렵지 않은 쉬운 말로 대화하세요. 
                노인분들의 감정을 이해하고 공감하는 대화를 하세요.
                이모티콘은 넣지 마세요.
                """
            }
        ]
        
        messages.extend([
            {"role": msg['role'], "content": msg['content']} 
            for msg in history
        ])
        
        messages.append({
            "role": "user", 
            "content": request.user_message
        })
        
        try:
            logger.info("OpenAI API 호출")
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=120,
                temperature=0.7,
                timeout=10.0
            )
            bot_message = response.choices[0].message.content.strip()
            logger.info(f"OpenAI API 응답 수신: {bot_message[:100]}...")
            
            # silvercare_chat_logs 테이블에 대화 저장 추가
            conn = get_db_connection()
            cursor = conn.cursor()
            try:
                cursor.execute("""
                    INSERT INTO silvercare_chat_logs 
                    (session_id, user_message, bot_message, created_at)
                    VALUES (?, ?, ?, ?)
                """, (session_id, request.user_message, bot_message, datetime.now()))
                conn.commit()
            finally:
                cursor.close()
                conn.close()
            
        except Exception as e:
            logger.error(f"OpenAI API 오류: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="챗봇 응답 생성 중 오류가 발생했습니다."
            )

        # 기존 대화 히스토리 저장
        save_message_to_history(session_id, "user", request.user_message)
        save_message_to_history(session_id, "assistant", bot_message)
        
        tts = SimpleTTSTest()
        tts_path = tts.generate_speech(bot_message)
        relative_tts_path = os.path.relpath(tts_path, start='.')
        
        return ChatResponse(
            session_id=session_id, 
            bot_message=bot_message,
            tts_path=relative_tts_path
        )
        
    except Exception as e:
        logger.error(f"처리 중 오류: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    
# 감정 리포트 DB 저장
@app.post("/emotion-report")
async def save_emotion_report(user_id: str, emotion: dict = Body(...)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO emotion_reports (user_id, report_content) VALUES (%s, %s)",
            (user_id, json.dumps(emotion, indent=4, ensure_ascii=False))
        )
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# 재난문자 캐시 저장소
disaster_cache = {}

async def check_disaster_messages(address: str):
    try:
        url = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
        serviceKey = os.getenv("DISASTER_API_KEY")
        
        
        today = datetime.now().strftime("%Y%m%d")
        
        payloads = {
            "serviceKey": serviceKey,
            "returnType": "json",
            "pageNo": "1",
            "numOfRows": "5",
            "rgnNm": address,
            "crtDt": today  
        }
        
        response = requests.get(url, params=payloads, verify=False)
        data = response.json()
        
        if data.get("response", {}).get("body", {}).get("items"):
            return data["response"]["body"]["items"]
        return []
        
    except Exception as e:
        print(f"재난문자 조회 오류: {str(e)}")
        return []

@app.get("/check-disaster/{user_id}")
async def get_disaster_messages(user_id: str):
    try:
        # DB에서 사용자 주소 조회
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT address FROM account WHERE id = ?", (user_id,))
        result = cursor.fetchone()
        conn.close()
        
        if not result or not result[0]:
            return {"messages": []}
            
        address = result[0]
        messages = await check_disaster_messages(address)
        print(disaster_cache)
        return {"messages": messages}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def background_disaster_check():
    while True:
        try:
            # DB에서 모든 사용자 조회
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, address FROM account WHERE address IS NOT NULL")
            users = cursor.fetchall()
            conn.close()
            
            for user_id, address in users:
                messages = await check_disaster_messages(address)
                disaster_cache[user_id] = messages
                
        except Exception as e:
            print(f"Background task error: {str(e)}")
            
        await asyncio.sleep(300)  # 5분 대기


# 전역 캐시 저장소
weather_cache: dict = {}

async def get_grid_coordinates(address: str) -> tuple[int | None, int | None]:
    """주소로부터 기상청 격자 좌표를 조회합니다."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute(
            """SELECT x, y 
               FROM korea_address_map 
               WHERE address = %s""",
            (address,)
        )
        result = cursor.fetchone()
        return (result['x'], result['y']) if result else (None, None)
    finally:
        cursor.close()
        conn.close()

async def fetch_weather_data(x: int, y: int) -> dict | None:
    try:
        weather_api_key = os.getenv('WEATHER_API_KEY')
        if not weather_api_key:
            raise ValueError("Weather API key is not configured")
        
        base_date, base_time = await get_base_time()  # 기존 현재시간 대신 계산된 base_time 사용
        
        url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"
        params = {
            'serviceKey': weather_api_key,
            'pageNo': '1',
            'numOfRows': '60',
            'dataType': 'JSON',
            'base_date': base_date,
            'base_time': base_time,
            'nx': str(x),
            'ny': str(y)
        }
        
        timeout = aiohttp.ClientTimeout(total=10)
        
        async with weather_semaphore:  # 동시 요청 제한
            async with aiohttp.ClientSession(timeout=timeout) as session:
                for attempt in range(3):  # 최대 3번 재시도
                    try:
                        async with session.get(url, params=params) as response:
                            if response.status == 200:
                                return await response.json()
                            logger.error(f"Weather API HTTP error: {response.status}")
                    except asyncio.TimeoutError:
                        if attempt == 2:  # 마지막 시도
                            logger.error("Weather API timeout after all retries")
                            return None
                        await asyncio.sleep(1 * (attempt + 1))  # 지수 백오프
                return None
                
    except Exception as e:
        logger.error(f"날씨 데이터 조회 오류: {str(e)}")
        return None

def format_weather_data(data: dict, address: str) -> dict:
    try:
        logger.info(f"Raw API response: {data}")
        items = data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
        logger.info(f"Items from response: {items}")
        
        # 기본값 설정
        result = {
            'address': address,
            'temperature': 'N/A',
            'sky': '알 수 없음',
            'precipitation': '없음',
            'humidity': 'N/A'
        }
        
        # 값을 임시 저장할 딕셔너리
        temp_values = {}
        
        # 각 관측 항목을 임시 저장
        for item in items:
            category = item.get('category')
            value = item.get('fcstValue')  
            temp_values[category] = value
        
        # 저장된 값을 기반으로 결과 생성
        if 'T1H' in temp_values:  # 기온 (초단기실황에서는 T1H)
            result['temperature'] = f"{temp_values['T1H']}°C"
            
        if 'SKY' in temp_values:  # 하늘상태
            sky_codes = {
                '1': '맑음',
                '2': '구름조금',
                '3': '구름많음',
                '4': '흐림'
            }
            result['sky'] = sky_codes.get(temp_values['SKY'], '알 수 없음')
            
        if 'PTY' in temp_values:  # 강수형태
            rain_codes = {
                '0': '없음',
                '1': '비',
                '2': '비/눈',
                '3': '눈',
                '4': '소나기'
            }
            result['precipitation'] = rain_codes.get(temp_values['PTY'], '없음')
            
        if 'REH' in temp_values:  # 습도
            result['humidity'] = f"{temp_values['REH']}%"
        
        logger.info(f"Parsed weather data: {result}")
        return result
        
    except Exception as e:
        logger.error(f"날씨 데이터 가공 중 오류: {str(e)}")
        return {
            'address': address,
            'temperature': 'N/A',
            'sky': '알 수 없음',
            'precipitation': '없음',
            'humidity': 'N/A'
        }

async def get_base_time() -> tuple[str, str]:
    now = datetime.now()
    base_date = now.strftime("%Y%m%d")
    
    # 발표 시각 (매 3시간 간격)
    forecast_hours = [2, 5, 8, 11, 14, 17, 20, 23]
    
    # 현재 시각 이전의 가장 최근 발표 시각 찾기
    current_hour = now.hour
    base_hour = None
    
    for hour in reversed(forecast_hours):
        if current_hour >= hour:
            base_hour = hour
            break
    
    # 당일 첫 발표 시각(02시) 이전인 경우 전날 마지막 발표 시각(23시) 사용
    if base_hour is None:
        yesterday = now - timedelta(days=1)
        base_date = yesterday.strftime("%Y%m%d")
        base_hour = 23
    
    base_time = f"{base_hour:02d}00"
    logger.info(f"Selected base_date: {base_date}, base_time: {base_time}")
    
    return base_date, base_time


@app.get("/weather/{user_id}")
async def get_weather(user_id: str) -> dict:
    """특정 사용자의 날씨 정보를 조회합니다."""
    try:
        # 캐시 확인
        cached = weather_cache.get(user_id)
        current_time = datetime.now()
        
        # 캐시가 있고 1시간 이내인 경우
        if cached and (current_time - cached['timestamp']).seconds <= 3600:
            logger.info(f"Returning cached weather data for user {user_id}")
            return cached['data']
        
        # DB에서 사용자 주소 조회
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT address FROM account WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not result or not result[0]:
            logger.error(f"No address found for user {user_id}")
            raise HTTPException(status_code=404, detail="주소 정보가 없습니다.")
            
        address = result[0]
        logger.info(f"Found address for user {user_id}: {address}")
        
        x, y = await get_grid_coordinates(address)
        if not x or not y:
            logger.error(f"No grid coordinates found for address: {address}")
            raise HTTPException(status_code=404, detail="위치 정보를 찾을 수 없습니다.")
            
        logger.info(f"Found grid coordinates: x={x}, y={y}")
        
        weather_data = await fetch_weather_data(x, y)
        if not weather_data:
            logger.error(f"Failed to fetch weather data for coordinates: x={x}, y={y}")
            raise HTTPException(status_code=500, detail="날씨 정보 조회에 실패했습니다.")
        
        # 날씨 데이터 형식화
        items = weather_data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
        formatted_data = {
            'address': address,
            'weather': {
                'temperature': 'N/A',
                'sky': '1',
                'precipitation': '0',
                'humidity': 'N/A'
            }
        }
        
        # 필요한 데이터만 추출
        for item in items:
            category = item.get('category')
            value = item.get('fcstValue')
            
            if category == 'TMP':  # 기온
                formatted_data['weather']['temperature'] = value
            elif category == 'SKY':  # 하늘상태
                formatted_data['weather']['sky'] = value
            elif category == 'PTY':  # 강수형태
                formatted_data['weather']['precipitation'] = value
            elif category == 'REH':  # 습도
                formatted_data['weather']['humidity'] = value
        
        logger.info(f"Formatted weather data: {formatted_data}")
        
        # 캐시 업데이트
        weather_cache[user_id] = {
            'data': formatted_data,
            'timestamp': current_time
        }
        
        return formatted_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_weather: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    
async def update_weather_cache():
    while True:
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id, address FROM account WHERE address IS NOT NULL")
            users = cursor.fetchall()
            cursor.close()
            conn.close()
            
            for user_id, address in users:
                x, y = await get_grid_coordinates(address)
                if x and y:
                    weather_data = await fetch_weather_data(x, y)
                    if weather_data:
                        formatted_data = format_weather_data(weather_data, address)
                        weather_cache[user_id] = {
                            'data': formatted_data,
                            'timestamp': datetime.now()
                        }
                        
        except Exception as e:
            logger.error(f"날씨 데이터 업데이트 오류: {str(e)}")
            
        await asyncio.sleep(3600)  # 1시간 대기

# startup 이벤트
@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(background_disaster_check())
    asyncio.create_task(update_weather_cache())
