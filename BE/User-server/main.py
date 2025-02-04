"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
version : 0.4.2
"""

# Libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Routers import accounts, families, members, authentication, status

app = FastAPI()

# ========== CORS 설정 ==========
origins_url = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    "https://dev-main.itdice.net",
    "https://dev-sub.itdice.net",
    "https://main.itdice.net",
    "https://sub.itdice.net",
    "https://dev-ai.itdice.net",
    "https://ai.itdice.net"
]

app.add_middleware(  # type: ignore
    CORSMiddleware,
    allow_origins=origins_url,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 기능 불러오기 ==========
app.include_router(accounts.router)
app.include_router(families.router)
app.include_router(members.router)
app.include_router(authentication.router)
app.include_router(status.router)
