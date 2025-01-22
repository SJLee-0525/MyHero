# voice_chat_api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
import logging
from pydantic import BaseModel
from typing import Optional

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
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

# API 엔드포인트 설정
STT_API_URL = "http://localhost:8002/speech-to-text"
USER_API_URL = "http://localhost:8000/chat"

class ChatResponse(BaseModel):
    success: bool
    transcribed_text: Optional[str] = None
    chat_response: Optional[dict] = None
    error: Optional[str] = None

@app.post("/voice-chat")
async def voice_chat(session_id: Optional[str] = None):
    try:
        logger.info("Calling STT API")
        async with httpx.AsyncClient(timeout=120.0) as client:  # 2분으로 증가
            stt_response = await client.post(
                STT_API_URL,
                timeout=120.0
            )
            
            if stt_response.status_code != 200:
                error_detail = stt_response.json().get('error', '음성 인식 처리 중 오류가 발생했습니다')
                logger.error(f"STT API error: {error_detail}")
                return ChatResponse(
                    success=False,
                    error=error_detail
                )
            
            stt_result = stt_response.json()
            if not stt_result.get('text'):
                return ChatResponse(
                    success=False,
                    error=stt_result.get('error', '음성 인식 결과가 없습니다')
                )
                
            transcribed_text = stt_result['text']
            logger.info(f"Transcribed text: {transcribed_text}")

        # 2. 변환된 텍스트로 채팅 API 호출
        logger.info("Calling Chat API")
        chat_request = {
            "user_message": transcribed_text
        }
        if session_id:
            chat_request["session_id"] = session_id

        async with httpx.AsyncClient() as client:
            chat_response = await client.post(
                USER_API_URL,
                json=chat_request,
                timeout=30.0
            )
            
            if chat_response.status_code != 200:
                return ChatResponse(
                    success=False,
                    transcribed_text=transcribed_text,
                    error="채팅 응답 생성 중 오류가 발생했습니다"
                )
                
            chat_result = chat_response.json()
            logger.info("Chat response received")

        # 3. 성공 응답 반환
        return ChatResponse(
            success=True,
            transcribed_text=transcribed_text,
            chat_response=chat_result
        )

    except httpx.TimeoutException:
        logger.error("API request timeout")
        return ChatResponse(
            success=False,
            error="요청 시간이 초과되었습니다"
        )
        
    except httpx.TimeoutError:
        logger.error("STT API request timeout")
        return ChatResponse(
            success=False,
            error="음성 인식 시간이 초과되었습니다. 다시 시도해주세요."
        )
    except Exception as e:
        logger.error(f"Error in voice chat: {str(e)}")
        return ChatResponse(
            success=False,
            error=f"처리 중 오류가 발생했습니다: {str(e)}"
        )
if __name__ == "__main__":
    import uvicorn
    logger.info("Voice Chat Integration API server starting")
    uvicorn.run(app, host="0.0.0.0", port=8003)