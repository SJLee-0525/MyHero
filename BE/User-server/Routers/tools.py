"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Tools
"""

# Libraries
from fastapi import HTTPException, APIRouter, status, Query, Depends
from fastapi.encoders import jsonable_encoder

import httpx
import Database
from Database.models import *
from External.ai import korean_weather, check_connection

from datetime import date
from typing import Optional

from Utilities.logging_tools import *

router = APIRouter(prefix="/tools", tags=["Tools"])
logger = get_logger("Router_Tools")

# ========== Tool 부분 ==========
# 광역자치단체를 불러오는 기능
@router.get("/master-region", status_code=status.HTTP_200_OK)
async def get_all_master_regions():
    master_region_list: list[dict] = Database.tools.get_all_master_region()

    if master_region_list:
        return {
            "message": "All master region data retrieved successfully",
            "result": jsonable_encoder(master_region_list)
        }
    else:
        logger.warning("Failed to retrieve master region data")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Failed to retrieve sub region data"
            }
        )

# 모든 기초자치단체를 불러오는 기능
@router.get("/sub-region", status_code=status.HTTP_200_OK)
async def get_all_sub_regions():
    sub_region_list: list[dict] = Database.tools.get_all_sub_region()

    if sub_region_list:
        return {
            "message": "All sub region data retrieved successfully",
            "result": jsonable_encoder(sub_region_list)
        }
    else:
        logger.warning("Failed to retrieve sub region data")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Failed to retrieve sub region data"
            }
        )

# 특정 광역 자치단체 안에 있는 기초자치단체를 불러오는 기능
@router.get("/sub-region/{master_region}", status_code=status.HTTP_200_OK)
async def get_all_sub_regions_by_master_region(master_region: str):
    sub_region_list: list[dict] = Database.tools.get_all_sub_region(master_region)

    if sub_region_list:
        return {
            "message": "All sub region data retrieved successfully",
            "result": jsonable_encoder(sub_region_list)
        }
    else:
        logger.warning("Failed to retrieve sub region data")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Failed to retrieve sub region data"
            }
        )

# AI Process Server가 접근 가능한지 확인하는 기능
@router.get("/ai-server", status_code=status.HTTP_200_OK)
async def get_ai_server_status():
    response: httpx.Response = await check_connection()

    if response is not None and response.status_code == status.HTTP_200_OK:
        return {
            "message": "AI Process Server is running."
        }
    else:
        logger.critical("AI Process Server is not running.")
        raise HTTPException(
            status_code=status.HTTP_418_IM_A_TEAPOT,
            detail={
                "type": "coffe",
                "message": "AI Process Server serves coffee."
            }
        )

@router.get("/news", status_code=status.HTTP_200_OK)
async def get_news(
        when: Optional[date] = Query(None, description="News query date"),
        request_id: str = Depends(Database.check_current_user)):
    # 사용자 계정을 통해 접근하는지 점검
    request_data: dict = Database.get_one_account(request_id)

    if not request_data:
        logger.warning(f"You do not have permission: {request_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 필수 입력 정보 점검
    missing_location: list = ["query"]

    if when is None:
        missing_location.append("when")

    if len(missing_location) > 1:
        logger.error(f"No data provided: {missing_location}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Password data is required"
            }
        )

    # 뉴스 정보 받아오기
    result: dict = Database.get_news(when)

    if result:
        return {
            "message": "News retrieved successfully",
            "result": result
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to retrieve news"
            }
        )

@router.get("/weather/{user_id}", status_code=status.HTTP_200_OK)
async def get_weather(user_id: str, request_id: str = Depends(Database.check_current_user)):
    # 사용자 계정을 통해 접근하는지 확인
    request_data: dict = Database.get_one_account(request_id)

    if not request_data:
        logger.warning(f"Can not access image: {request_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 접근 권한 범위 설정
    accessible_id: list[str] = [request_id]

    if request_data["role"] == Role.MAIN:  # 주 사용자가 접근한 경우 소속된 가족의 정보까지 접근 가능
        family_id: str = Database.main_id_to_family_id(request_id)
        member_data: list[dict] = Database.get_all_members(family_id=family_id)
        for member in member_data:
            accessible_id.append(member["user_id"])
    elif request_data["role"] == Role.SUB:  # 보조 사용자가 접근한 경우 소속된 주 사용자들의 정보까지 접근 가능
        member_data: list[dict] = Database.get_all_members(user_id=request_id)
        family_id_list: list[str] = [member["family_id"] for member in member_data]
        for family_id in family_id_list:
            family_data: dict = Database.get_one_family(family_id)
            accessible_id.append(family_data["main_user"])

    # 요청한 사용자가 해당 계정 정보에 접근 가능한지 점검
    if request_data["role"] != Role.SYSTEM and user_id not in accessible_id:
        logger.warning(f"Can not access account: {request_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 날씨 정보 받아오기
    response: httpx.Response = await korean_weather(user_id)

    if response is not None and response.status_code == status.HTTP_200_OK:
        return {
            "message": "Weather retrieved successfully",
            "result": jsonable_encoder(response.json())
        }
    elif response is not None and response.status_code == status.HTTP_404_NOT_FOUND:
        logger.warning("Weather not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Weather not found"
            }
        )
    else:
        logger.critical("Failed to retrieve weather")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to retrieve weather"
            }
        )
