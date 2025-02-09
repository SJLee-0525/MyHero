"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Tools
"""

# Libraries
from fastapi import HTTPException, APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Endpoint.models import *

from Utilities.auth_tools import *
from datetime import date

router = APIRouter(prefix="/tools", tags=["Tools"])

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Failed to retrieve sub region data"
            }
        )
