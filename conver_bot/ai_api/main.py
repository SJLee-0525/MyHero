# ai-api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from datetime import datetime
import httpx 
import asyncio
import json
import logging
from typing import List, Union, Dict


# 로깅 설정
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('ai_api.log')
    ]
)

# 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI 앱 초기화
app = FastAPI()

TIMEOUT_SECONDS = 30.0
RETRY_COUNT = 3
WEATHER_CACHE_DURATION = 3600


# User API의 기본 URL
USER_API_BASE_URL = "http://localhost:8000"

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmotionalReport(BaseModel):
    user_id: str
    date: str
    overall_emotional_state: str
    emotional_insights: str
    time_based_emotions: Dict[str, List[Union[str, int, str]]]
    recommendations: List[str]

# User API로부터 대화 기록을 가져오는 함수
async def fetch_daily_conversations(user_id: str, date: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{USER_API_BASE_URL}/conversations",
                params={"user_id": user_id, "date": date}
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"User API 통신 오류: {str(e)}")

@app.get("/generate-emotional-report", response_model=EmotionalReport)
async def generate_emotional_report(user_id: str, date: str = None):
    try:
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
            
        logger.info(f"Fetching conversations for user {user_id} on {date}")
        conversations = await fetch_daily_conversations(user_id, date)
        logger.info(f"Fetched conversations: {conversations}")
        
        if not conversations:
            logger.warning("No conversations found")
            raise HTTPException(status_code=404, detail="대화 내용이 없습니다")
            
        prompt = """독거노인의 감정 상태를 분석하여 정확히 다음 JSON 형식으로만 응답하세요:
        {
            "overall_emotional_state": "전반적인 감정 상태를 한 문장으로",
            "emotional_insights": "감정 통찰 내용을 2-3문장으로",
            "time_based_emotions": {
                "09:00": ["긍정적", 80, "상세 설명"],
                "12:00": ["부정적", 30, "상세 설명"]
            },
            "recommendations": ["권장사항1", "권장사항2"]
        }"""
        
        try:
            logger.info("Calling GPT API")
            gpt_response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": f"대화 기록: {conversations}"}
                ]
            )
            
            response_content = gpt_response.choices[0].message.content
            logger.info(f"GPT Response: {response_content}")
            
            try:
                response_data = json.loads(response_content)
                logger.info(f"Parsed response data: {response_data}")
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {e}")
                raise HTTPException(status_code=500, detail=f"GPT 응답 파싱 오류: {str(e)}")
            
            report = EmotionalReport(
                user_id=user_id,
                date=date,
                **response_data
            )

            #report 저장
            try:
                logger.info(f"Saving report to DB for user {user_id}")
                logger.info(f"Report data: {response_data}")
                
                async with httpx.AsyncClient() as http_client:
                    response = await http_client.post(
                        f"{USER_API_BASE_URL}/emotion-report",
                        params={"user_id": user_id},
                        json=response_data
                    )
                    logger.info(f"Save response: {response.status_code}")
                    if response.status_code != 200:
                        logger.error(f"Save failed with status {response.status_code}: {response.text}")
            except Exception as e:
                logger.error(f"Failed to save report: {str(e)}", exc_info=True)

            return report
            
        except Exception as e:
            logger.error(f"Error in GPT processing: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"GPT 처리 오류: {str(e)}")
            
    except Exception as e:
        logger.error(f"General error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    
class BestKeywords(BaseModel):
    keywords: list[str]

@app.get("/generate-keyword", response_model=BestKeywords)
async def generate_keyword(user_id: str, date: str = None):
    try:
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        # User API에서 대화 기록 가져오기
        conversations = await fetch_daily_conversations(user_id, date)

        messages = [
            {
                "role": "system",
                "content": """
                대화 기록을 기반으로 user가 관심을 가지고 있는 것 같은
                키워드 5개를 추출해서 쉼표(,)로 구분된 형태로 응답해주세요.
                예시: 건강,취미,가족,운동,음식
                """
            },
            {
                "role": "user",
                "content": f"다음은 {date}의 대화 기록입니다: {conversations}"
            }
        ]

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )

        keywords = response.choices[0].message.content.strip().split(',')
        keywords = [keyword.strip() for keyword in keywords]
        
        return BestKeywords(keywords=keywords)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AI 감정 분석 서버 작동 중"}

async def make_api_request(url: str, method: str = "GET", **kwargs):
    timeout = httpx.Timeout(timeout=TIMEOUT_SECONDS)
    
    for attempt in range(RETRY_COUNT):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.request(method, url, **kwargs)
                response.raise_for_status()
                return response.json()
        except (httpx.TimeoutException, httpx.NetworkError) as e:
            if attempt == RETRY_COUNT - 1:
                logger.error(f"API 요청 실패 (최대 재시도 횟수 초과): {str(e)}")
                raise
            logger.warning(f"API 요청 실패 (재시도 {attempt + 1}/{RETRY_COUNT}): {str(e)}")
            await asyncio.sleep(1 * (attempt + 1))

# 재난 문자 캐시 저장소 
disaster_cache = {}

# 재난 문자 캐시 업데이트 함수
async def update_disaster_cache():
    while True:
        try:
            # 이미 캐시된 user_id들에 대해 재난문자 정보 업데이트
            for user_id in list(disaster_cache.keys()):
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"{USER_API_BASE_URL}/check-disaster/{user_id}"
                    )
                    if response.status_code == 200:
                        disaster_data = response.json()
                        disaster_cache[user_id] = {
                            'data': disaster_data,
                            'timestamp': datetime.now()
                        }
                        logger.info(f"Updated disaster cache for user {user_id}")
        except Exception as e:
            logger.error(f"재난문자 데이터 업데이트 오류: {str(e)}")
        await asyncio.sleep(300)  # 5분 대기


@app.get("/disaster-messages/{user_id}")
async def get_disaster_status(user_id: str):
    try:
        cached = disaster_cache.get(user_id)
        current_time = datetime.now()
        
        if not cached or (current_time - cached['timestamp']).total_seconds() > 300:
            try:
                disaster_data = await make_api_request(
                    f"{USER_API_BASE_URL}/check-disaster/{user_id}"
                )
                
                disaster_cache[user_id] = {
                    'data': disaster_data,
                    'timestamp': current_time
                }
                return disaster_data
                
            except Exception as e:
                logger.error(f"재난문자 정보 조회 실패: {str(e)}")
                if cached:  # 캐시된 데이터가 있으면 그것을 반환
                    return cached['data']
                raise
                
        return cached['data']
        
    except Exception as e:
        logger.error(f"재난문자 정보 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

weather_cache = {}

async def update_weather_cache():
    while True:
        try:
            # 이미 캐시된 user_id들에 대해 날씨 정보 업데이트
            for user_id in list(weather_cache.keys()):
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"{USER_API_BASE_URL}/weather/{user_id}"
                    )
                    if response.status_code == 200:
                        weather_data = response.json()
                        weather_cache[user_id] = {
                            'data': weather_data,
                            'timestamp': datetime.now()
                        }
                        
        except Exception as e:
            logger.error(f"날씨 데이터 업데이트 오류: {str(e)}")
            
        await asyncio.sleep(3600)

    
@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(update_weather_cache()) # 날씨 캐시 업데이트
    asyncio.create_task(update_disaster_cache()) # 재난 문자 캐시 업데이트

@app.get("/weather-info/{user_id}")
async def get_weather_info(user_id: str):
    try:
        logger.info(f"날씨 정보 요청 시작: user_id = {user_id}")
        
        cached = weather_cache.get(user_id)
        current_time = datetime.now()
        
        if cached and (current_time - cached['timestamp']).total_seconds() <= WEATHER_CACHE_DURATION:
            logger.info("캐시된 날씨 데이터 반환")
            return format_weather_data(cached['data'])

        logger.info("새로운 날씨 데이터 요청")
        try:
            weather_data = await make_api_request(
                f"{USER_API_BASE_URL}/weather/{user_id}"
            )
            
            weather_cache[user_id] = {
                'data': weather_data,
                'timestamp': current_time
            }
            
            logger.info(f"새로운 날씨 데이터 수신: {weather_data}")
            return format_weather_data(weather_data)
            
        except Exception as e:
            logger.error(f"날씨 정보 조회 실패: {str(e)}")
            if cached:
                logger.info("캐시된 데이터로 폴백")
                return format_weather_data(cached['data'])
            raise
            
    except Exception as e:
        logger.error(f"날씨 정보 조회 중 예상치 못한 오류: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="날씨 정보를 가져오는 중 오류가 발생했습니다."
        )

def get_sky_status(code):
    """하늘 상태 코드를 텍스트로 변환"""
    sky_codes = {
        '1': '맑음',
        '2': '구름조금',
        '3': '구름많음',
        '4': '흐림'
    }
    return sky_codes.get(str(code), '알 수 없음')

def get_precipitation_status(code):
    """강수 형태 코드를 텍스트로 변환"""
    rain_codes = {
        '0': '없음',
        '1': '비',
        '2': '비/눈',
        '3': '눈',
        '4': '소나기'
    }
    return rain_codes.get(str(code), '없음')

def format_weather_data(weather_data):
    try:
        logger.info(f"날씨 데이터 포맷팅 시도: {weather_data}")
        
        # weather가 중첩 객체가 아닐 경우
        if 'weather' not in weather_data:
            # 이미 텍스트로 된 데이터가 오는 경우
            if isinstance(weather_data.get('sky'), str) and not weather_data['sky'].isdigit():
                formatted = {
                    'address': weather_data.get('address', '위치 정보 없음'),
                    'temperature': weather_data.get('temperature', 'N/A'),
                    'sky': weather_data.get('sky', '알 수 없음'),
                    'precipitation': weather_data.get('precipitation', '없음'),
                    'humidity': weather_data.get('humidity', 'N/A')
                }
            else:
                # 코드로 온 경우
                formatted = {
                    'address': weather_data.get('address', '위치 정보 없음'),
                    'temperature': f"{weather_data.get('temperature', 'N/A')}°C",
                    'sky': get_sky_status(weather_data.get('sky', '1')),
                    'precipitation': get_precipitation_status(weather_data.get('precipitation', '0')),
                    'humidity': f"{weather_data.get('humidity', 'N/A')}%"
                }
        else:
            # weather 객체가 있는 경우 (이전 코드 유지)
            weather = weather_data.get('weather', {})
            formatted = {
                'address': weather_data.get('address', '위치 정보 없음'),
                'temperature': f"{weather.get('temperature', 'N/A')}°C",
                'sky': get_sky_status(weather.get('sky', '1')),
                'precipitation': get_precipitation_status(weather.get('precipitation', '0')),
                'humidity': f"{weather.get('humidity', 'N/A')}%"
            }
        
        logger.info(f"포맷팅된 날씨 데이터: {formatted}")
        return formatted
        
    except Exception as e:
        logger.error(f"날씨 데이터 가공 중 오류: {str(e)}", exc_info=True)
        return {
            'address': '알 수 없음',
            'temperature': 'N/A',
            'sky': '알 수 없음',
            'precipitation': '없음',
            'humidity': 'N/A'
        }