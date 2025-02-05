"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Status
"""

# Library
from fastapi import HTTPException, APIRouter, status, Response, Request, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Endpoint.models import *

from Utilities.auth_tools import *

router = APIRouter(prefix="/status", tags=["Status"])

# ========== Status 부분 ==========

# ========== Status/home 부분 ==========

# 새로운 집 환경 정보 생성하는 기능
@router.post("/home")
async def create_home_status():
    pass

# 조건에 따른 모든 집 환경 정보를 불러오는 기능
@router.get("/home")
async def get_home_status():
    pass

# 가장 최신의 집 환경 정보를 불러오는 기능
@router.get("/home/latest")
async def get_latest_home_status():
    pass

# 가장 최신의 집 환경 정보를 삭제하는 기능
@router.delete("/home/latest")
async def delete_latest_home_status():
    pass

# ========== Status/Health 부분 ==========

# 새로운 건강 정보 생성하는 기능
@router.post("/health")
async def create_health_status():
    pass

# 조건에 따른 모든 건강 정보를 불러오는 기능
@router.get("/health")
async def get_health_status():
    pass

# 가장 최신의 건강 정보를 불러오는 기능
@router.get("/health/latest")
async def get_latest_health_status():
    pass

# 가장 최신의 건강 정보를 삭제하는 기능
@router.delete("/health/latest")
async def delete_latest_health_status():
    pass

# ========== Status/Active 부분 ==========

# 새로운 활동 정보 생성하는 기능
@router.post("/active")
async def create_active_status():
    pass

# 조건에 따른 모든 활동 정보를 불러오는 기능
@router.get("/active")
async def get_active_status():
    pass

# 가장 최신의 활동 정보를 불러오는 기능
@router.get("/active/latest")
async def get_latest_active_status():
    pass

# 가장 최신의 활동 정보를 삭제하는 기능
@router.delete("/active/latest")
async def delete_latest_active_status():
    pass

# ========== Status/Mental 부분 ==========

# 새로운 정신건강 정보 요청하는 기능
@router.get("/mental/new")
async def create_mental_status():
    pass

# 조건에 따른 모든 정신건강 정보를 불러오는 기능
@router.get("/mental")
async def get_mental_status():
    pass

# 가장 최신의 정신건강 정보를 불러오는 기능
@router.get("/mental/latest")
async def get_latest_mental_status():
    pass

# 가장 최신의 정신건강 정보를 삭제하는 기능
@router.delete("/mental/latest")
async def delete_latest_mental_status():
    pass

# 새로운 정신건강 리포트 요청하는 기능
@router.post("/mental/reports/new")
async def create_mental_reports():
    pass

# 조건에 따른 모든 정신건강 리포트를 불러오는 기능
@router.get("/mental/reports")
async def get_mental_reports():
    pass

# 가장 최신의 정신건강 리포트를 불러오는 기능
@router.get("/mental/reports/latest")
async def get_latest_mental_reports():
    pass

# 가장 최신의 정신건강 리포트를 삭제하는 기능
@router.delete("/mental/reports/latest")
async def delete_latest_mental_reports():
    pass
