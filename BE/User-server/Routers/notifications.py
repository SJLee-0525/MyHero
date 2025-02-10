"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Notifications
"""

# Libraries
from fastapi import HTTPException, APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Utilities.check_tools import *
from Utilities.logging_tools import *

router = APIRouter(prefix="/notifications", tags=["Notifications"])
logger = get_logger("Router_Notifications")

# ========== Notifications 부분 ==========

