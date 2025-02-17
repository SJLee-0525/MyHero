"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
version : 1.0.2
"""

# Libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from Routers import accounts, families, members, authentication, status, chats, notifications, messages, tools

from Database import cleanup_login_sessions
from asyncio import create_task

from Utilities.logging_tools import get_logger

logger = get_logger("System")

# ========== 백그라운드 기능 ==========
@asynccontextmanager
async def startup(app: FastAPI):
    # 시작된 경우
    logger.info("🚀 Start Care-bot User API Server!!!")
    task = create_task(cleanup_login_sessions())

    yield

    # 종료 된 경우
    task.cancel()
    logger.info("🛑 Server shutdown!!!")

# ========== FastAPI 설정 ==========
app = FastAPI(lifespan=startup)

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
    "https://ai.itdice.net",
    "https://image.itdice.net"
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
app.include_router(chats.router)
app.include_router(notifications.router)
app.include_router(messages.router)
app.include_router(tools.router)
