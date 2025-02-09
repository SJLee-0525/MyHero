"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Status
"""
# Library
from fastapi import HTTPException, APIRouter, status, Query, Response, Request, Depends
from fastapi.encoders import jsonable_encoder

from datetime import timezone

import httpx

import Database
from Database.models import *

from Endpoint.models import *

from External.ai import *

router = APIRouter(prefix="/status", tags=["Status"])

# ========== Status/home 부분 ==========

# 새로운 집 환경 정보 생성하는 기능
@router.post("/home", status_code=status.HTTP_201_CREATED)
async def create_home_status(home_data: HomeStatus, request_id: str = Depends(Database.check_current_user)):
    # 필수 입력 정보를 전달했는지 점검
    missing_location: list = ["body"]

    if home_data.family_id is None or home_data.family_id == "":
        missing_location.append("family_id")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Family ID is required",
                "input": jsonable_encoder(home_data)
            }
        )

    # 존재하는 가족 ID인지 확인
    family_data = Database.get_one_family(home_data.family_id)

    if not family_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": jsonable_encoder(home_data)
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자만 보고할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id != family_data["main_user"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": jsonable_encoder(home_data)
            }
        )

    # 새로운 집 환경 정보 생성
    new_home_status: HomeStatusTable = HomeStatusTable(
        family_id=home_data.family_id,
        temperature=home_data.temperature,
        humidity=home_data.humidity,
        dust_level=home_data.dust_level,
        ethanol=home_data.ethanol,
        others=home_data.others
    )

    # 업로드
    result: bool = Database.create_home_status(new_home_status)

    if result:
        return {
            "message": "Home status created successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create home status",
                "input": jsonable_encoder(home_data)
            }
        )

# 조건에 따른 모든 집 환경 정보를 불러오는 기능
@router.get("/home/{family_id}", status_code=status.HTTP_200_OK)
async def get_home_status(
        family_id: str,
        start: Optional[datetime] = Query(None, description="Query start time"),
        end: Optional[datetime] = Query(datetime.now(tz=timezone.utc), description="Query end time"),
        order: Optional[Order] = Query(Order.ASC, description="Query order"),
        request_id: str = Depends(Database.check_current_user)
):
    # 필수 입력 정보 점검
    missing_location: list = ["query"]

    if start is None:
        missing_location.append("start")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Query data is required",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 정보 불러오기
    home_status_list: list = Database.get_home_status(
        family_id=family_id,
        start_time=start,
        end_time=end,
        time_order=order
    )

    if home_status_list:
        return {
            "message": "Home status retrieved successfully",
            "data": jsonable_encoder(home_status_list)
        }
    else:
        return {
            "message": "No home status found",
            "data": jsonable_encoder(home_status_list)
        }

# 가장 최신의 집 환경 정보를 불러오는 기능
@router.get("/home/latest/{family_id}", status_code=status.HTTP_200_OK)
async def get_latest_home_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 정보 불러오기
    home_status: dict = Database.get_latest_home_status(family_id=family_id)

    if home_status:
        return {
            "message": "Home status retrieved successfully",
            "data": jsonable_encoder(home_status)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No home status found"
            }
        )

# 가장 최신의 집 환경 정보를 삭제하는 기능
@router.delete("/home/latest/{family_id}", status_code=status.HTTP_200_OK)
async def delete_latest_home_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 관리자만 삭제할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or request_data["role"] != Role.SYSTEM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 삭제할 데이터가 있는지 확인
    home_status: dict = Database.get_latest_home_status(family_id=family_id)

    if not home_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No home status found"
            }
        )

    # 삭제하기
    result: bool = Database.delete_latest_home_status(family_id=family_id)

    if result:
        return {
            "message": "Home status deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete home status"
            }
        )

# ========== Status/Health 부분 ==========

# 새로운 건강 정보 생성하는 기능
@router.post("/health", status_code=status.HTTP_201_CREATED)
async def create_health_status(health_data: HealthStatus, request_id: str = Depends(Database.check_current_user)):
    # 필수 입력 정보를 전달했는지 점검
    missing_location: list = ["body"]

    if health_data.family_id is None or health_data.family_id == "":
        missing_location.append("family_id")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Family ID is required",
                "input": jsonable_encoder(health_data)
            }
        )

    # 존재하는 가족 ID인지 확인
    family_data = Database.get_one_family(health_data.family_id)

    if not family_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": jsonable_encoder(health_data)
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자만 보고할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id != family_data["main_user"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": jsonable_encoder(health_data)
            }
        )

    # 새로운 건강 정보 생성
    new_health_status: HealthStatusTable = HealthStatusTable(
        family_id=health_data.family_id,
        heart_rate=health_data.heart_rate
    )

    # 업로드
    result: bool = Database.create_health_status(new_health_status)

    if result:
        return {
            "message": "Health status created successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create health status",
                "input": jsonable_encoder(health_data)
            }
        )

# 조건에 따른 모든 건강 정보를 불러오는 기능
@router.get("/health/{family_id}", status_code=status.HTTP_200_OK)
async def get_health_status(
        family_id: str,
        start: Optional[datetime] = Query(None, description="Query start time"),
        end: Optional[datetime] = Query(datetime.now(tz=timezone.utc), description="Query end time"),
        order: Optional[Order] = Query(Order.ASC, description="Query order"),
        request_id: str = Depends(Database.check_current_user)
):
    # 필수 입력 정보 점검
    missing_location: list = ["query"]

    if start is None:
        missing_location.append("start")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Query data is required",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 정보 불러오기
    health_status_list: list = Database.get_health_status(
        family_id=family_id,
        start_time=start,
        end_time=end,
        time_order=order
    )

    if health_status_list:
        return {
            "message": "Health status retrieved successfully",
            "data": jsonable_encoder(health_status_list)
        }
    else:
        return {
            "message": "No health status found",
            "data": jsonable_encoder(health_status_list)
        }

# 가장 최신의 건강 정보를 불러오는 기능
@router.get("/health/latest/{family_id}", status_code=status.HTTP_200_OK)
async def get_latest_health_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 정보 불러오기
    health_status: dict = Database.get_latest_health_status(family_id=family_id)

    if health_status:
        return {
            "message": "Health status retrieved successfully",
            "data": jsonable_encoder(health_status)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No health status found"
            }
        )

# 가장 최신의 건강 정보를 삭제하는 기능
@router.delete("/health/latest/{family_id}", status_code=status.HTTP_200_OK)
async def delete_latest_health_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 관리자만 삭제할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or request_data["role"] != Role.SYSTEM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 삭제할 데이터가 있는지 확인
    health_status: dict = Database.get_latest_health_status(family_id=family_id)

    if not health_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No health status found"
            }
        )

    # 삭제하기
    result: bool = Database.delete_latest_health_status(family_id=family_id)

    if result:
        return {
            "message": "Health status deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete health status"
            }
        )

# ========== Status/Active 부분 ==========

# 새로운 활동 정보 생성하는 기능
@router.post("/active", status_code=status.HTTP_201_CREATED)
async def create_active_status(active_data: ActiveStatus, request_id: str = Depends(Database.check_current_user)):
    # 필수 입력 정보를 전달했는지 점검
    missing_location: list = ["body"]

    if active_data.family_id is None or active_data.family_id == "":
        missing_location.append("family_id")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Family ID is required",
                "input": jsonable_encoder(active_data)
            }
        )

    # 존재하는 가족 ID인지 확인
    family_data = Database.get_one_family(active_data.family_id)

    if not family_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": jsonable_encoder(active_data)
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자만 보고할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id != family_data["main_user"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": jsonable_encoder(active_data)
            }
        )

    # 새로운 활동 정보 생성
    new_active_status: ActiveStatusTable = ActiveStatusTable(
        family_id=active_data.family_id,
        score=active_data.score,
        action=active_data.action,
        is_critical=active_data.is_critical,
        description=active_data.description
    )

    # 업로드
    result: bool = Database.create_active_status(new_active_status)

    if result:
        return {
            "message": "Active status created successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create active status",
                "input": jsonable_encoder(active_data)
            }
        )

# 조건에 따른 모든 활동 정보를 불러오는 기능
@router.get("/active/{family_id}", status_code=status.HTTP_200_OK)
async def get_active_status(
        family_id: str,
        start: Optional[datetime] = Query(None, description="Query start time"),
        end: Optional[datetime] = Query(datetime.now(tz=timezone.utc), description="Query end time"),
        order: Optional[Order] = Query(Order.ASC, description="Query order"),
        request_id: str = Depends(Database.check_current_user)
):
    # 필수 입력 정보 점검
    missing_location: list = ["query"]

    if start is None:
        missing_location.append("start")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Query data is required",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 정보 불러오기
    active_status_list: list = Database.get_active_status(
        family_id=family_id,
        start_time=start,
        end_time=end,
        time_order=order
    )

    if active_status_list:
        return {
            "message": "Active status retrieved successfully",
            "data": jsonable_encoder(active_status_list)
        }
    else:
        return {
            "message": "No active status found",
            "data": jsonable_encoder(active_status_list)
        }

# 가장 최신의 활동 정보를 불러오는 기능
@router.get("/active/latest/{family_id}", status_code=status.HTTP_200_OK)
async def get_latest_active_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 정보 불러오기
    active_status: dict = Database.get_latest_active_status(family_id=family_id)

    if active_status:
        return {
            "message": "Active status retrieved successfully",
            "data": jsonable_encoder(active_status)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No active status found"
            }
        )

# 가장 최신의 활동 정보를 삭제하는 기능
@router.delete("/active/latest/{family_id}", status_code=status.HTTP_200_OK)
async def delete_latest_active_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 관리자만 삭제할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or request_data["role"] != Role.SYSTEM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 삭제할 데이터가 있는지 확인
    active_status: dict = Database.get_latest_active_status(family_id=family_id)

    if not active_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No active status found"
            }
        )

    # 삭제하기
    result: bool = Database.delete_latest_active_status(family_id=family_id)

    if result:
        return {
            "message": "Active status deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete active status"
            }
        )

# ========== Status/Mental 부분 ==========

# 새로운 정신건강 정보 요청하는 기능
@router.get("/mental/new/{family_id}", status_code=status.HTTP_201_CREATED)
async def create_mental_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 존재하는 가족 ID인지 확인
    family_data = Database.get_one_family(family_id)

    if not family_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found"
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 요청하기
    response: httpx.Response = await request_mental_status(family_id=family_id)

    if response is not None and response.status_code == status.HTTP_200_OK:
        return {
            "message": "Mental status created successfully",
            "data": response.json()
        }
    elif response is not None and response.status_code == status.HTTP_404_NOT_FOUND:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No mental status found",
                "data": {}
            }
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create mental status"
            }
        )

# 조건에 따른 모든 정신건강 정보를 불러오는 기능
@router.get("/mental/{family_id}", status_code=status.HTTP_200_OK)
async def get_mental_status(
        family_id: str,
        start: Optional[datetime] = Query(None, description="Query start time"),
        end: Optional[datetime] = Query(datetime.now(tz=timezone.utc), description="Query end time"),
        order: Optional[Order] = Query(Order.ASC, description="Query order"),
        request_id: str = Depends(Database.check_current_user)
):
    # 필수 입력 정보 점검
    missing_location: list = ["query"]

    if start is None:
        missing_location.append("start")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Query data is required",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 정보 불러오기
    mental_status_list: list = Database.get_mental_status(
        family_id=family_id,
        start_time=start,
        end_time=end,
        time_order=order
    )

    if mental_status_list:
        return {
            "message": "Mental status retrieved successfully",
            "data": jsonable_encoder(mental_status_list)
        }
    else:
        return {
            "message": "No mental status found",
            "data": jsonable_encoder(mental_status_list)
        }

# 가장 최신의 정신건강 정보를 불러오는 기능
@router.get("/mental/latest/{family_id}", status_code=status.HTTP_200_OK)
async def get_latest_mental_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 정보 불러오기
    mental_status: dict = Database.get_latest_mental_status(family_id=family_id)

    if mental_status:
        return {
            "message": "Mental status retrieved successfully",
            "data": jsonable_encoder(mental_status)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No mental status found"
            }
        )

# 가장 최신의 정신건강 정보를 삭제하는 기능
@router.delete("/mental/latest/{family_id}", status_code=status.HTTP_200_OK)
async def delete_latest_mental_status(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 관리자만 삭제할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or request_data["role"] != Role.SYSTEM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 삭제할 데이터가 있는지 확인
    mental_status: dict = Database.get_latest_mental_status(family_id=family_id)

    if not mental_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No mental status found"
            }
        )

    # 삭제하기
    result: bool = Database.delete_latest_mental_status(family_id=family_id)

    if result:
        return {
            "message": "Mental status deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete mental status"
            }
        )

# TODO - API 변경 반영 필요!
# 새로운 정신건강 리포트 요청하는 기능
@router.get("/mental-reports/new/{family_id}", status_code=status.HTTP_201_CREATED)
async def create_mental_reports(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 존재하는 가족 ID인지 확인
    family_data: dict = Database.get_one_family(family_id)

    if not family_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found"
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 요청하기
    # response: httpx.Response = await request_mental_reports(family_id=family_id)
    #
    # if response is not None and response.status_code == status.HTTP_200_OK:
    #     return {
    #         "message": "Mental reports created successfully",
    #         "data": response.json()
    #     }
    # elif response is not None and response.status_code == status.HTTP_404_NOT_FOUND:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail={
    #             "type": "not found",
    #             "message": "No mental reports found",
    #             "data": {}
    #         }
    #     )
    # else:
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail={
    #             "type": "server error",
    #             "message": "Failed to create mental reports"
    #         }
    #     )

    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail={
            "type": "server error",
            "message": "This feature is not implemented yet"
        }
    )

# 조건에 따른 모든 정신건강 리포트를 불러오는 기능
@router.get("/mental-reports/{family_id}", status_code=status.HTTP_200_OK)
async def get_mental_reports(
        family_id: str,
        start: Optional[datetime] = Query(None, description="Query start time"),
        end: Optional[datetime] = Query(datetime.now(tz=timezone.utc), description="Query end time"),
        order: Optional[Order] = Query(Order.ASC, description="Query order"),
        request_id: str = Depends(Database.check_current_user)
):
    # 필수 입력 정보 점검
    missing_location: list = ["query"]

    if start is None:
        missing_location.append("start")

    if len(missing_location) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": missing_location,
                "message": "Query data is required",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": {
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "order": str(order)
                }
            }
        )

    # 정보 불러오기
    mental_reports_list: list = Database.get_mental_reports(
        family_id=family_id,
        start_time=start,
        end_time=end,
        time_order=order
    )

    if mental_reports_list:
        return {
            "message": "Mental reports retrieved successfully",
            "data": jsonable_encoder(mental_reports_list)
        }
    else:
        return {
            "message": "No mental reports found",
            "data": jsonable_encoder(mental_reports_list)
        }

# 가장 최신의 정신건강 리포트를 불러오는 기능
@router.get("/mental-reports/latest/{family_id}", status_code=status.HTTP_200_OK)
async def get_latest_mental_reports(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 계정을 제외한 가족의 주 사용자, 보조 사용자만 조회할 수 있음
    request_data: dict = Database.get_one_account(request_id)
    family_data: dict = Database.get_one_family(family_id)
    member_data: list[dict] = Database.get_all_members(family_id=family_id)
    permission_id: list[str] = (([family_data["main_user"]] if family_data else []) +
                                [user_data["user_id"] for user_data in member_data])

    if not request_data or (request_data["role"] != Role.SYSTEM and request_id not in permission_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 정보 불러오기
    mental_reports: dict = Database.get_latest_mental_reports(family_id=family_id)

    if mental_reports:
        return {
            "message": "Mental reports retrieved successfully",
            "data": jsonable_encoder(mental_reports)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No mental reports found"
            }
        )

# 가장 최신의 정신건강 리포트를 삭제하는 기능
@router.delete("/mental-reports/latest/{family_id}", status_code=status.HTTP_200_OK)
async def delete_latest_mental_reports(family_id: str, request_id: str = Depends(Database.check_current_user)):
    # 시스템 관리자만 삭제할 수 있음
    request_data: dict = Database.get_one_account(request_id)

    if not request_data or request_data["role"] != Role.SYSTEM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission"
            }
        )

    # 삭제할 데이터가 있는지 확인
    mental_reports: dict = Database.get_latest_mental_reports(family_id=family_id)

    if not mental_reports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "No mental reports found"
            }
        )

    # 삭제하기
    result: bool = Database.delete_latest_mental_reports(family_id=family_id)

    if result:
        return {
            "message": "Mental reports deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete mental reports"
            }
        )