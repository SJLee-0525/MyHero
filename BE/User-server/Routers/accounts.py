"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Parts of Accounts
"""

# Libarary
from fastapi import HTTPException, APIRouter, status, Depends
from fastapi.encoders import jsonable_encoder

import Database
from Database.models import *

from Endpoint.models import *

from Utilities.auth_tools import *
from datetime import date

router = APIRouter(prefix="/accounts", tags=["Accounts"])

# ========== Account 부분 ==========

# 가입 가능한 이메일인지 확인하는 기능
@router.post("/check-email", status_code=status.HTTP_200_OK)
async def check_email(email_check: EmailCheck):
    target_email: str = email_check.email
    email_list: list = [data["email"] for data in Database.get_all_email()]

    if target_email is None or target_email == "":  # 필요한 정보 없이 요청하려는지 점검
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "message": "Email is required",
                "input": jsonable_encoder(email_check)
            }
        )
    elif target_email in email_list:  # 모든 사용자 이메일 주소와 비교하여 겹치는지 점검
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "type": "already exists",
                "message": "Email is already in use",
                "input": jsonable_encoder(email_check)
            }
        )
    else:
        return {
            "message": "Email is available"
        }

# 새로운 계정을 생성하는 기능
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_account(account_data: Account):
    # 필수 입력 정보 점검 (비밀번호, 역할, 이메일)
    if account_data.password is None or account_data.password == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "password"],
                "message": "Password is required",
                "input": jsonable_encoder(account_data)
            }
        )
    elif account_data.role is None or account_data.role == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "role"],
                "message": "Role is required",
                "input": jsonable_encoder(account_data, exclude={"password"})
            }
        )
    elif account_data.email is None or account_data.email == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "email"],
                "message": "Email is required",
                "input": jsonable_encoder(account_data, exclude={"password"})
            }
        )

    # 잘못된 옵션을 선택했는지 점검
    if account_data.role is not None and account_data.role.lower() not in Role._value2member_map_:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Invalid value provided for account details (role)",
                "input": jsonable_encoder(account_data, exclude={"password"})
            }
        )
    elif account_data.gender is not None and account_data.gender.lower() not in Gender._value2member_map_:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Invalid value provided for account details (gender)",
            }
        )

    # 중복 이메일 점검
    email_list: list = [data["email"] for data in Database.get_all_email()]

    if account_data.email in email_list:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "type": "already exists",
                "message": "Email is already in use",
                "input": jsonable_encoder(account_data, exclude={"password"})
            }
        )

    # ID 생성 및 중복 점검
    new_id: str = ""
    id_verified: bool = False

    while not id_verified:
        new_id = random_id(16, Identify.USER)
        accounts: list = Database.get_all_accounts()
        id_list = [data["id"] for data in accounts]
        if new_id not in id_list:
            id_verified = True

    # 새로운 Account 정보 생성
    hashed_password = hash_password(account_data.password)  # 암호화된 비밀번호

    if account_data.birth_date is None:  # 입력받은 생년월일을 date 타입으로 변환
        converted_birth_date = None
    else:
        if account_data.birth_date.year < 1900 or account_data.birth_date.year > 2022 or \
            account_data.birth_date.day < 1 or account_data.birth_date.day > 31 or \
            account_data.birth_date.month < 1 or account_data.birth_date.month > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "type": "invalid value",
                    "message": "Invalid value provided for account details (birth date)",
                    "input": jsonable_encoder(account_data, exclude={"password"})
                }
            )
        converted_birth_date = date(
            year=account_data.birth_date.year,
            month=account_data.birth_date.month,
            day=account_data.birth_date.day
        )

    new_account: AccountsTable = AccountsTable(
        id=new_id,
        email=account_data.email,
        password=hashed_password,
        role=account_data.role.upper() if account_data.role is not None else "TEST",
        user_name=account_data.user_name,
        birth_date=converted_birth_date,
        gender=account_data.gender.upper() if account_data.gender is not None else "OTHER",
        address=account_data.address
    )

    # 계정 업로드
    result: bool = Database.create_account(new_account)

    if result:
        return {
            "message": "New account created successfully",
            "result": {
                "id": new_id
            }
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to create new account",
                "input": jsonable_encoder(account_data, exclude={"password"})
            }
        )

# 모든 사용자 계정의 정보를 불러오는 기능
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_accounts():
    account_list: list = Database.get_all_accounts()

    if account_list:
        return {
            "message": "All accounts retrieved successfully",
            "result": jsonable_encoder(account_list)
        }
    else:
        return {
            "message": "No accounts found",
            "result": jsonable_encoder(account_list)
        }

# 사용자 계정 정보를 불러오는 기능
@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def get_account(user_id: str, request_id: str = Depends(Database.check_current_user)):
    request_data: dict = Database.get_one_account(request_id)

    # 시스템 계정을 제외한 사용자는 자신의 계정 정보만 불러올 수 있음
    if not request_data or (request_data["role"] != Role.SYSTEM and user_id != request_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "can not access",
                "message": "You do not have permission",
                "input": {
                    "user_id": user_id,
                    "request_id": request_id
                }
            }
        )

    account_data: dict = Database.get_one_account(user_id)

    if account_data:
        return {
            "message": "Account retrieved successfully",
            "result": jsonable_encoder(account_data)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Account not found",
                "input": {"user_id": user_id}
            }
        )

# 사용자 계정 정보를 수정하는 기능
@router.patch("/{user_id}", status_code=status.HTTP_200_OK)
async def update_account(user_id: str, updated_account: Account):
    previous_account: dict = Database.get_one_account(user_id)

    # 없는 계정을 변경하려는지 확인
    if not previous_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Account not found",
                "input": {"user_id": user_id}
            }
        )

    # 잘못된 옵션을 선택했는지 점검
    if updated_account.role and updated_account.role.lower() not in Role._value2member_map_:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Invalid value provided for account details (role)",
                "input": jsonable_encoder(updated_account)
            }
        )
    elif updated_account.gender is not None and updated_account.gender.lower() not in Gender._value2member_map_:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Invalid value provided for account details (gender)",
                "input": jsonable_encoder(updated_account)
            }
        )

    # 중복된 이메일로 변경하려는지 점검
    if updated_account.email:
        email_list: list = [data["email"] for data in Database.get_all_email()]
        if updated_account.email in email_list:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "type": "already exists",
                    "message": "Email is already in use",
                    "input": jsonable_encoder(updated_account)
                }
            )

    # 입력받은 생년월일을 date 타입으로 변환
    if updated_account.birth_date is None:
        converted_birth_date = None
    else:
        if updated_account.birth_date.year < 1900 or updated_account.birth_date.year > 2022 or \
            updated_account.birth_date.day < 1 or updated_account.birth_date.day > 31 or \
            updated_account.birth_date.month < 1 or updated_account.birth_date.month > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "type": "invalid value",
                    "message": "Invalid value provided for account details (birth date)",
                    "input": jsonable_encoder(updated_account)
                }
            )
        converted_birth_date = date(
            year=updated_account.birth_date.year,
            month=updated_account.birth_date.month,
            day=updated_account.birth_date.day
        )

    # 최종적으로 변경할 데이터 생성
    total_updated_account: AccountsTable = AccountsTable(
        id=user_id,
        email=updated_account.email if updated_account.email is not None else previous_account["email"],
        role=updated_account.role.upper() if updated_account.role is not None else previous_account["role"],
        user_name=updated_account.user_name if updated_account.user_name is not None else previous_account["user_name"],
        birth_date=converted_birth_date if converted_birth_date is not None else previous_account["birth_date"],
        gender=updated_account.gender.upper() if updated_account.gender is not None else previous_account["gender"],
        address=updated_account.address if updated_account.address is not None else previous_account["address"]
    )

    # 사용자 계정 정보 변경
    result: bool = Database.update_one_account(user_id, total_updated_account)

    if result:
        final_updated_account: dict = Database.get_one_account(user_id)
        return {
            "message": "Account updated successfully",
            "result": jsonable_encoder(final_updated_account, exclude={"password"})
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to update account",
                "input": jsonable_encoder(updated_account)
            }
        )

# 사용자 계정을 삭제하는 기능 (사용자의 비밀번호 필요)
@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_account(user_id: str, checker: PasswordCheck):
    previous_account: dict = Database.get_one_account(user_id)

    # 없는 계정을 삭제하려는지 확인
    if not previous_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "type": "not found",
                "message": "Account not found",
                "input": {"user_id": user_id}
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
                "input": {"user_id": user_id}
            }
        )

    # 비밀번호 검증
    input_password: str = checker.password
    hashed_password: str = Database.get_hashed_password(user_id)
    is_verified: bool = verify_password(input_password, hashed_password)

    if not is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "type": "unauthorized",
                "message": "Invalid password",
                "input": {"user_id": user_id, "password": "<PASSWORD>"}
            }
        )

    # 사용자 계정 삭제 진행
    result: bool = Database.delete_one_account(user_id)

    if result:
        return {
            "message": "Account deleted successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "type": "server error",
                "message": "Failed to delete account",
                "input": {"user_id": user_id, "password": "<PASSWORD>"}
            }
        )