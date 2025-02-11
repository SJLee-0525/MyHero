"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Message
"""

# Libraries
from fastapi import HTTPException, APIRouter, status, Query, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Utilities.check_tools import *
from Utilities.logging_tools import *

router = APIRouter(prefix="/messages", tags=["Messages"])
logger = get_logger("Router_Messages")

# ========== Message 부분 ==========
@router.get("/receivable", status_code=status.HTTP_200_OK)
async def get_receivable_messages(request_id: str = Depends(Database.check_current_user)):
    pass

@router.post("/send", status_code=status.HTTP_201_CREATED)
async def send_message(request_id: str = Depends(Database.check_current_user)):
    pass

@router.get("/new", status_code=status.HTTP_200_OK)
async def get_new_received_messages(request_id: str = Depends(Database.check_current_user)):
    pass

@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_received_messages(request_id: str = Depends(Database.check_current_user)):
    pass

@router.get("/sent", status_code=status.HTTP_200_OK)
async def get_all_sent_messages(request_id: str = Depends(Database.check_current_user)):
    pass

@router.patch("/read/{message_id}", status_code=status.HTTP_200_OK)
async def read_message(message_id: str, request_id: str = Depends(Database.check_current_user)):
    pass

@router.delete("/delete/{message_id}", status_code=status.HTTP_200_OK)
async def delete_message(message_id: str, request_id: str = Depends(Database.check_current_user)):
    pass