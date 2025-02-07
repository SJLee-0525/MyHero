"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
External Server Connection
"""
# Library
import httpx

import os
from dotenv import load_dotenv

# 외부 AI Process 서버 확인
load_dotenv()
AI_HOST: str = os.getenv("AI_HOST")
AI_PORT: int = int(os.getenv("AI_PORT"))
AI_PATH: str = f"{AI_HOST}:{AI_PORT}"
external_timeout: float = float(os.getenv("EXTERNAL_TIMEOUT", 60.0))
set_timeout = httpx.Timeout(timeout=external_timeout)

# 단일 정신건강 정보를 요청하는 기능
async def request_mental_status(family_id: str) -> httpx.Response | None:
    """
    AI Server에게 정신 건강 정보를 요청하는 기능
    :param family_id: 해당하는 가족의 ID
    :return: AI Server로부터 반환된 결과 값 (httpx.Response)
    """
    external_url = f"{AI_PATH}/generate-emotional-report/{family_id}"

    try:
        async with httpx.AsyncClient(timeout=set_timeout) as client:
            response = await client.post(external_url)
            return response
    except httpx.RequestError as error:
        print("[External] Error: Unable to request mental status from AI server.")
        return None

# TODO - API 변경 반영 필요!
# 날짜 범위로 정신 건강 리포트를 요청하는 기능
async def request_mental_reports(family_id: str) -> httpx.Response | None:
    """
    AI Server에게 날짜 범위에 해당하는 정신 건강 리포트를 요청하는 기능
    :param family_id: 해당하는 가족의 ID
    :return: AI Server로부터 반환된 결과 값 (httpx.Response)
    """
    external_url = f"{AI_PATH}/generate-mental-period-report/{family_id}"

    try:
        async with httpx.AsyncClient(timeout=set_timeout) as client:
            response = await client.post(external_url)
            return response
    except httpx.RequestError as error:
        print("[External] Error: Unable to request mental reports from AI server.")
        return None
