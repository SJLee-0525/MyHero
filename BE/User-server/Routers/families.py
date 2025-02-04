"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Families
"""

# Library
from fastapi import HTTPException, APIRouter, status
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Endpoint.models import *

from Utilities.auth_tools import *

router = APIRouter(prefix="/families", tags=["Families"])

# ========== Family 부분 ==========

# 주 사용자의 ID를 이용해 가족이 이미 생성되었는지 확인하는 기능
@router.post("/check-exist", status_code=status.HTTP_200_OK)
async def check_family_from_main_id(family_check: IDCheck):
    # 필수 입력 조건 점검
    if family_check.id is None or family_check.id == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "id"],
                "message": "Main ID is required",
                "input": jsonable_encoder(family_check)
            }
        )

    # 가족 정보가 존재하는지 확인
    exist_family: str = Database.main_id_to_family_id(family_check.id)

    if exist_family == "":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Main ID does not have a family",
                "input": jsonable_encoder(family_check)
            }
        )
    else:
        return {
            "message": "Family exists",
            "result": {"family_id": exist_family}
        }

# 주 사용자를 기반으로 새로운 가족을 생성하는 기능
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_family(family_data: Family):
    # 필수 입력 정보 점검 (Main User)
    if family_data.main_user is None or family_data.main_user == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "main_user"],
                "message": "Main user is required",
                "input": jsonable_encoder(family_data)
            }
        )

    # 가족이 이미 생성되었는지 점검
    exist_family: str = Database.main_id_to_family_id(family_data.main_user)

    if exist_family:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "type": "already exists",
                "message": "Main user already has a family",
                "input": jsonable_encoder(family_data)
            }
        )

    # 주 사용자 존재 확인 및 역할 점검
    exist_user: dict= Database.get_one_account(family_data.main_user)

    if not exist_user or exist_user["role"] is not Role.MAIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Does not exist or is not a main user",
                "input": jsonable_encoder(family_data)
            }
        )

    # ID 생성 및 중복 점검
    new_id: str = ""
    id_verified: bool = False

    while not id_verified:
        new_id = random_id(16, Identify.FAMILY)
        families: list = Database.get_all_families()
        id_list = [data["id"] for data in families]
        if new_id not in id_list:
            id_verified = True

    # 새로운 가족 정보 생성
    new_family: FamiliesTable = FamiliesTable(
        id=new_id,
        main_user=family_data.main_user,
        family_name=family_data.family_name
    )

    result: bool = Database.create_family(new_family)

    if result:
        return {
            "message": "New family created successfully",
            "result": {
                "id": new_id
            }
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create new family",
                "input": jsonable_encoder(family_data)
            }
        )

# 모든 가족의 정보를 불러오는 기능
@router.get("", status_code=status.HTTP_200_OK)
async def get_all_families():
    family_list: list = Database.get_all_families()

    if family_list:
        return {
            "message": "All families retrieved successfully",
            "result": jsonable_encoder(family_list)
        }
    else:
        return {
            "message": "No families found",
            "result": jsonable_encoder(family_list)
        }

# 가족 정보를 불러오는 기능
@router.get("/{family_id}", status_code=status.HTTP_200_OK)
async def get_family(family_id: str):
    family_data: dict = Database.get_one_family(family_id)

    if family_data:
        return {
            "message": "Family retrieved successfully",
            "result": jsonable_encoder(family_data)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": {"family_id": family_id}
            }
        )

# 가족 정보를 수정하는 기능 (family_name만 수정 가능)
@router.patch("/{family_id}", status_code=status.HTTP_200_OK)
async def update_family(family_id: str, updated_family: Family):
    previous_family: dict = Database.get_one_family(family_id)

    # 없는 가족 정보를 변경하려는지 확인
    if not previous_family:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": jsonable_encoder(updated_family)
            }
        )

    # 최종적으로 변경할 데이터 생성
    total_updated_family: FamiliesTable = FamiliesTable(
        id=family_id,
        main_user=previous_family["main_user"],
        family_name=updated_family.family_name if updated_family.family_name is not None else previous_family["family_name"]
    )

    # 가족 정보 변경
    result: bool = Database.update_one_family(family_id, total_updated_family)

    if result:
        final_updated_family: dict = Database.get_one_family(family_id)
        return {
            "message": "Family updated successfully",
            "result": jsonable_encoder(final_updated_family)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to update family",
                "input": jsonable_encoder(updated_family)
            }
        )

# 가족 정보를 삭제하는 기능 (주 사용자의 비밀번호 필요)
@router.delete("/{family_id}", status_code=status.HTTP_200_OK)
async def delete_family(family_id: str, checker: PasswordCheck):
    previous_family: dict = Database.get_one_family(family_id)

    # 없는 가족을 삭제하려는지 확인
    if not previous_family:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": {"family_id": family_id}
            }
        )

    # 비밀번호 없이 요청한 경우
    if checker.password is None or checker.password == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "password"],
                "message": "Password is required",
                "input": {"family_id": family_id, "password": "<PASSWORD>"}
            }
        )

    # 비밀번호 검증
    input_password: str = checker.password
    hashed_password: str = Database.get_hashed_password(previous_family["main_user"])
    is_verified: bool = verify_password(input_password, hashed_password)

    if not is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "type": "unauthorized",
                "message": "Invalid password",
                "input": {"family_id": family_id, "password": "<PASSWORD>"}
            }
        )

    # 가족 삭제 진행
    final_result: bool = Database.delete_one_family(family_id)

    if final_result:
        return {
            "message": "Family deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete family",
                "input": {"family_id": family_id, "password": "<PASSWORD>"}
            }
        )