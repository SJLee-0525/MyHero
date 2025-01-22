# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
import mariadb
import os
import openai
import sys
import traceback
from datetime import datetime
from dotenv import load_dotenv

# dotenv 로드
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# FastAPI 앱 초기화
app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Anthropic 클라이언트 초기화
try:
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
except Exception as e:
    print(f"Anthropic 클라이언트 초기화 오류: {e}")
    client = None

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

class ChatRequest(BaseModel):
    user_message: str

class ChatResponse(BaseModel):
    bot_message: str

@app.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    try:
        if not os.getenv("ANTHROPIC_API_KEY"):
            raise ValueError("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
        
        if client is None:
            raise ValueError("Anthropic 클라이언트를 초기화할 수 없습니다.")

        system_prompt = """
        당신은 독거노인을 위한 따뜻하고 친절한 AI 돌봄 도우미입니다. 
        노인분들의 외로움을 달래주고 편안한 대화를 나누며, 
        존댓말을 사용하고 너무 어렵지 않은 쉬운 말로 대화하세요. 
        노인분들의 감정을 이해하고 공감하는 대화를 하세요.
        """

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,
            system=system_prompt,
            messages=[
                {"role": "user", "content": request.user_message}
            ]
        )
        
        bot_message = response.content[0].text
        
        # 대화 로그 저장
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO silvercare_chat_logs (user_message, bot_message, created_at) VALUES (?, ?, ?)",
            (request.user_message, bot_message, datetime.now())
        )
        conn.commit()
        conn.close()
        
        return ChatResponse(bot_message=bot_message)
    
    except Exception as e:
        # 상세한 예외 정보 출력
        print(f"오류 발생: {e}")
        print(f"예외 유형: {type(e)}")
        traceback.print_exc()  
        
        raise HTTPException(status_code=500, detail=str(e))

# 환경 변수 확인용 라우트 (디버깅)
@app.get("/env")
async def check_env():
    return {
        "ANTHROPIC_API_KEY": "설정됨" if os.getenv("ANTHROPIC_API_KEY") else "미설정",
        "DB_PASSWORD": "설정됨" if os.getenv("DB_PASSWORD") else "미설정"
    }