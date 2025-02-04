"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Members
"""

# Libarary
from fastapi import HTTPException, APIRouter, status, Query
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Endpoint.models import *

from Utilities.auth_tools import *

router = APIRouter(prefix="/members", tags=["Members"])

# ========== Member 부분 ==========

# 새로운 가족 관계를 생성하는 기능
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_member(member_data: Member):
    # 필수 입력 정보 점검 (Family ID and User ID)
    if member_data.family_id is None or member_data.family_id == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "family_id"],
                "message": "Family ID is required",
                "input": jsonable_encoder(member_data)
            }
        )
    elif member_data.user_id is None or member_data.user_id == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "user_id"],
                "message": "User ID is required",
            }
        )

    # 존재하는 가족 데이터인지 점검
    exist_family: dict = Database.get_one_family(member_data.family_id)

    if not exist_family:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Family not found",
                "input": jsonable_encoder(member_data)
            }
        )

    # 존재하는 사용자인지 점검
    exist_user: dict = Database.get_one_account(member_data.user_id)

    if not exist_user or exist_user["role"] is not Role.SUB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "User not found or is not a sub user",
                "input": jsonable_encoder(member_data)
            }
        )

    # 이미 생성된 가족 관계가 있는지 점검
    exist_member: list = Database.get_all_members(family_id=member_data.family_id, user_id=member_data.user_id)

    if exist_member:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "type": "already exists",
                "message": "Member already exists in family",
                "input": jsonable_encoder(member_data)
            }
        )

    # ID 생성 및 중복 점검
    new_id: str = ""
    id_verified: bool = False

    while not id_verified:
        new_id = random_id(16, Identify.MEMBER)
        members: list = Database.get_all_members()
        id_list = [data["id"] for data in members]
        if new_id not in id_list:
            id_verified = True

    # 새로운 가족 관계 정보 생성
    new_member: MemberRelationsTable = MemberRelationsTable(
        id=new_id,
        family_id=member_data.family_id,
        user_id=member_data.user_id,
        nickname=member_data.nickname
    )

    result: bool = Database.create_member(new_member)

    if result:
        return {
            "message": "New member created successfully",
            "result": {
                "id": new_id
            }
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create new member",
                "input": jsonable_encoder(member_data)
            }
        )

# 조건에 따른 모든 가족 관계 정보 불러오는 기능
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_members(
        familyId: str = Query(None, min_length=16, max_length=16, regex=r"^[a-zA-Z0-9]+$"),
        userId: str = Query(None, min_length=16, max_length=16, regex=r"^[a-zA-Z0-9]+$")):
    member_list: list = Database.get_all_members(family_id=familyId, user_id=userId)

    print(familyId, userId)

    if member_list:
        return {
            "message": "All members retrieved successfully",
            "result": jsonable_encoder(member_list)
        }
    else:
        return {
            "message": "No members found",
            "result": jsonable_encoder(member_list)
        }

# 가족 관계 정보를 불러오는 기능
@router.get("/{member_id}", status_code=status.HTTP_200_OK)
async def get_member(member_id: str):
    member_data: dict = Database.get_one_member(member_id)

    if member_data:
        return {
            "message": "Member retrieved successfully",
            "result": jsonable_encoder(member_data)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Member not found",
                "input": {"member_id": member_id}
            }
        )

# 가족 관계 정보를 수정하는 기능 (nickname만 수정 가능)
@router.patch("/{member_id}", status_code=status.HTTP_200_OK)
async def update_member(member_id: str, updated_member: Member):
    previous_member: dict = Database.get_one_member(member_id)

    # 없는 가족 관계 정보를 변경하려는지 확인
    if not previous_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Member not found",
                "input": jsonable_encoder(updated_member)
            }
        )

    # 최종적으로 변경할 데이터 생성
    total_updated_member: MemberRelationsTable = MemberRelationsTable(
        id=member_id,
        family_id=previous_member["family_id"],
        user_id=previous_member["user_id"],
        nickname=updated_member.nickname if updated_member.nickname is not None else previous_member["nickname"]
    )

    # 가족 관계 정보 변경
    result: bool = Database.update_one_member(member_id, total_updated_member)

    if result:
        final_updated_member: dict = Database.get_one_member(member_id)
        return {
            "message": "Member updated successfully",
            "result": jsonable_encoder(final_updated_member)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to update member",
                "input": jsonable_encoder(updated_member)
            }
        )

# 가족 관계 정보를 삭제하는 기능
@router.delete("/{member_id}", status_code=status.HTTP_200_OK)
async def delete_member(member_id: str, checker: PasswordCheck):
    previous_member: dict = Database.get_one_member(member_id)

    # 없는 가족 관계를 삭제하려는지 확인
    if not previous_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Member not found",
                "input": {"member_id": member_id}
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
                "input": {"member_id": member_id, "password": "<PASSWORD>"}
            }
        )

    # 비밀번호 검증
    input_password: str = checker.password
    hashed_password: str = Database.get_hashed_password(previous_member["user_id"])
    is_verified: bool = verify_password(input_password, hashed_password)

    if not is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "type": "unauthorized",
                "message": "Invalid password",
                "input": {"member_id": member_id, "password": "<PASSWORD>"}
            }
        )

    # 가족 관계 삭제 진행
    final_result: bool = Database.delete_one_member(member_id)

    if final_result:
        return {
            "message": "Member deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete member",
                "input": {"member_id": member_id, "password": "<PASSWORD>"}
            }
        )