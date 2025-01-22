# test.py
import requests
import os
from dotenv import load_dotenv

# dotenv 로드
load_dotenv()

# FastAPI 서버 URL (로컬 개발 환경)
url = "http://localhost:8000/chat"

# 테스트할 메시지
message = "안녕하세요"

# API 호출
response = requests.post(
    url, 
    json={"user_message": message}
)

# 응답 출력
print(response.json())