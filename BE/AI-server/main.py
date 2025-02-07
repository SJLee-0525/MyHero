from fastapi import FastAPI, HTTPException, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import logging
import asyncio
from datetime import datetime, date
from dotenv import load_dotenv
from typing import Optional
from openai import OpenAI
from pydantic import BaseModel

from services.weather import WeatherService
from services.chat import ChatService
from services.emotion import EmotionService
from services.disaster import DisasterService
from services.news import NewsService
from services.mental_health import MentalHealthService
from utils.cache import CacheManager
from models import Base, get_db, Account, ChatSession, ChatHistory, MentalStatus, FallDetection, Family, ChatKeywords, MentalReport

from utils.timezone_utils import get_kst_today, to_utc_start_of_day, to_utc, get_kst_now

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
weather_service = WeatherService(api_key=os.getenv("WEATHER_API_KEY"))
disaster_service = DisasterService(api_key=os.getenv("DISASTER_API_KEY"))
news_service = NewsService(api_key=os.getenv("NEWS_API_KEY"))
cache_manager = CacheManager()

class ChatRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    user_message: str

class ChatResponse(BaseModel):
    session_id: str
    bot_message: str

class PeriodRequest(BaseModel):
    start_date: datetime
    end_date: datetime


async def update_cache_periodically():
    while True:
        try:
            db = next(get_db())
            users = db.query(Account).all()
            for user in users:
                if user.address:
                    weather_data = await weather_service.get_weather_for_user(user.id, db)
                    if weather_data:
                        cache_manager.set_weather(user.id, weather_data)

            await asyncio.sleep(3600)  # 1시간 대기 
        except Exception as e:
            logger.error(f"Cache update error: {str(e)}")
        finally:
            db.close()


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        chat_service = ChatService(openai_client, db)
        response = await chat_service.process_chat(request.user_id, request.user_message, request.session_id)
        return response
    except Exception as e:
        logger.error(f"Chat processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close() 

@app.get("/weather/{user_id}")
async def get_weather(user_id: str, db: Session = Depends(get_db)):
    try:
        # 캐시 확인
        cached_data = cache_manager.get_weather(user_id)
        if cached_data:
            return cached_data

        # 새로운 날씨 데이터 조회
        weather_data = await weather_service.get_weather_for_user(user_id, db)
        if not weather_data:
            raise HTTPException(status_code=404, detail="날씨 정보를 찾을 수 없습니다")

        # 캐시 업데이트
        cache_manager.set_weather(user_id, weather_data)
        print(weather_data)
        return weather_data

    except Exception as e:
        logger.error(f"Weather error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/news")
async def get_news():
    try:
        news_data = await news_service.get_news()
        if not news_data:
            raise HTTPException(status_code=404, detail="뉴스 정보를 찾을 수 없습니다")
        return news_data
    except Exception as e:
        logger.error(f"News error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# 재난문자 noti save
async def update_notifications_periodically():
    while True:
        try:
            db = next(get_db())
            await disaster_service.update_disaster_notifications(db)
            await asyncio.sleep(300)  # 5분 대기
        except Exception as e:
            logger.error(f"Notification update error: {str(e)}")
        finally:
            db.close()

@app.post("/generate-emotional-report/{family_id}")
async def generate_emotional_report(family_id: str, db: Session = Depends(get_db)):
    try:
        emotion_service = EmotionService(openai_client, db)
        report = await emotion_service.generate_report(family_id)
        
        if not report:
            raise HTTPException(status_code=404, detail="감정 분석을 위한 대화 내용이 충분하지 않습니다")
            
        return report

    except Exception as e:
        logger.error(f"Emotion report error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close() 
    
@app.post("/generate-emotional-report/period/{family_id}")
async def gnerate_periodic_report(
    family_id: str,
    period: PeriodRequest,
    db: Session = Depends(get_db)
):
    try:
        emotion_service = EmotionService(openai_client, db)
        report = await emotion_service.generate_periodic_report(family_id, period.start_date, period.end_date)
        return report
    
    except Exception as e:
        logger.error(f"Periodic report error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close() 

@app.get("/generate-keyword/{family_id}")
async def generate_keywords(family_id: str, db: Session = Depends(get_db)):
    try:
        today = get_kst_today()
        today_utc = to_utc_start_of_day(today)

        chat_history = db.query(ChatHistory)\
            .join(Family, Family.main_user == ChatHistory.user_id)\
            .filter(Family.id == family_id)\
            .filter(ChatHistory.created_at >= today_utc)\
            .all()
            
        if not chat_history:
            return {"keywords": ["대화를 시작해보세요"]}

        messages = []
        for chat in chat_history:
            messages.append({"role": "user", "content": chat.user_message})
            messages.append({"role": "assistant", "content": chat.bot_message})

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """대화 기록을 기반으로 user가 관심을 가지고 있는 것 같은
                    키워드 5개를 추출해서 쉼표(,)로 구분된 형태로 응답해주세요.
                    예시: 건강,취미,가족,운동,음식"""
                },
                {"role": "user", "content": str(messages)}
            ]
        )

        keywords = response.choices[0].message.content.strip()
        keyword_list = keywords.split(',')
        keyword_list = [keyword.strip() for keyword in keyword_list]

        existing_keywords = db.query(ChatKeywords)\
            .filter(ChatKeywords.family_id == family_id)\
            .filter(ChatKeywords.created_at >= datetime.now().date())\
            .first()
        
        if existing_keywords:
            existing_keywords.keywords = keywords
        
        else:
            new_keywords = ChatKeywords(
                family_id=family_id,
                keywords=keywords
            )
            db.add(new_keywords)

        db.commit()

        
        return {"keywords": keyword_list}
    
    except Exception as e:
        logger.error(f"키워드 생성 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/analyze-mental-health/{family_id}')
async def analyze_mental_health(
    family_id: str,
    period: Optional[PeriodRequest] = None,
    db: Session = Depends(get_db)
):
    """
    - 오늘 하루 분석시에는 POST /analyze-mental-health/{family_id}로 요청
    - 특정 기간 분석시에는 body에 start_date, end_date 담아서 보내면 됨
    """
    try:
        mental_health_service = MentalHealthService(openai_client, db)
        result = await mental_health_service.analyze_mental_health(
            family_id,
            period.start_date if period else None,
            period.end_date if period else None
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        logger.error(f'Mental health analysis error: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close() 

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_notifications_periodically())
    asyncio.create_task(update_cache_periodically())
    logger.info("Application startup completed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)