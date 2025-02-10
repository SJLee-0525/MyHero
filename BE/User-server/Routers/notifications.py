"""Q
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Notifications
"""
from idlelib.query import Query

# Libraries
from fastapi import HTTPException, APIRouter, status, Query, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Utilities.check_tools import *
from Utilities.logging_tools import *

router = APIRouter(prefix="/notify", tags=["Notifications"])
logger = get_logger("Router_Notifications")

# ========== Notifications 부분 ==========

@router.post("", status_code=status.HTTP_201_CREATED)
async def crate_notification(notificate_data: Notification, request_id = Depends(Database.check_current_user)):
    pass

@router.get("/new/{family_id}", status_code=status.HTTP_200_OK)
async def get_new_notification(
        order: Optional[Order] = Query(Order.ASC),
        request_id = Depends(Database.check_current_user)):
    pass

@router.get("/all/{family_id}", status_code=status.HTTP_200_OK)
async def get_all_notification(
        order: Optional[Order] = Query(Order.ASC),
        request_id = Depends(Database.check_current_user)):
    pass

@router.delete("/{notification_id}", status_code=status.HTTP_200_OK)
async def delete_notification(notification_id: str, request_id = Depends(Database.check_current_user)):
    pass
