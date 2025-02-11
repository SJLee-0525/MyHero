"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Tools
"""

# Libraries
from fastapi import HTTPException, APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder

import httpx
import Database
from External.ai import check_connection

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
        logger.warning(f"Failed to retrieve master region data")
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
        logger.warning(f"Failed to retrieve sub region data")
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
        logger.warning(f"Failed to retrieve sub region data")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Failed to retrieve sub region data"
            }
        )

@router.get("/ai-server", status_code=status.HTTP_200_OK)
async def get_ai_server_status():
    response: httpx.Response = await check_connection()

    if response is not None and response.status_code == status.HTTP_200_OK:
        return {
            "message": "AI Process Server is running."
        }
    else:
        logger.critical(f"AI Process Server is not running.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "AI Process Server is not running."
            }
        )
