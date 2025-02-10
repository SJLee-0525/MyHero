"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Accounts
"""

# Libraries
from fastapi import HTTPException, APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Utilities.auth_tools import *
from Utilities.check_tools import *
from Utilities.logging_tools import *

from datetime import date

router = APIRouter(prefix="/chats", tags=["Chats"])
logger = get_logger("Router_Chats")

# ========== Chats 부분 ==========

# AI와 채팅을 진행하는 기능
@router.post("", status_code=status.HTTP_200_OK)
async def chat_with_ai():
    pass