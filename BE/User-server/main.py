"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
version : 0.2.0
"""

# Libraries
from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from Database.connector import Database
from Database.models import *

from Endpoint.data_blocks import *

from Utilities.basic import *
from datetime import date

app = FastAPI()
database = Database()

# ========== CORS 설정 ==========
origins_url = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    "https://dev-main.itdice.net",
    "https://dev-sub.itdice.net",
    "https://main.itdice.net",
    "https://sub.itdice.net",
    "https://dev-ai.itdice.net",
    "https://ai.itdice.net"
]

app.add_middleware(  # type: ignore
    CORSMiddleware,
    allow_origins=origins_url,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== Account 부분 ==========

# 가입 가능한 이메일인지 확인하는 기능
@app.post("/accounts/check-email", status_code=status.HTTP_200_OK)
async def check_email(email_check: EmailCheck):
    target_email: str = email_check.email
    email_list: list = [data["email"] for data in database.get_all_email()]

    if target_email is None or target_email == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "message": "Email is required",
                "input": jsonable_encoder(email_check)
            }
        )
    elif target_email in email_list:
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
@app.post("/accounts", status_code=status.HTTP_201_CREATED)
async def create_account(account: Account):
    # 필수 입력 정보 점검 (비밀번호, 역할, 이메일)
    if account.password is None or account.password == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "password"],
                "message": "Password is required",
                "input": jsonable_encoder(account)
            }
        )
    elif account.role is None or account.role == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "role"],
                "message": "Role is required",
                "input": jsonable_encoder(account, exclude={"password"})
            }
        )
    elif account.email is None or account.email == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "email"],
                "message": "Email is required",
                "input": jsonable_encoder(account, exclude={"password"})
            }
        )

    # 잘못된 옵션을 선택했는지 점검
    if account.role is not None and account.role.lower() not in Role._value2member_map_:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Invalid value provided for account details (role)",
                "input": jsonable_encoder(account, exclude={"password"})
            }
        )
    elif account.gender is not None and account.gender.lower() not in Gender._value2member_map_:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Invalid value provided for account details (gender)",
            }
        )

    # 중복 이메일 점검
    email_list: list = [data["email"] for data in database.get_all_email()]

    if account.email in email_list:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "type": "already exists",
                "message": "Email is already in use",
                "input": jsonable_encoder(account, exclude={"password"})
            }
        )

    # ID 생성 및 중복 점검
    new_id: str = ""
    id_verified: bool = False

    while not id_verified:
        new_id: str = random_id(16, Identify.USER)
        account_data: dict = database.get_one_account(new_id)
        id_list = [data["id"] for data in account_data]
        if new_id not in id_list:
            id_verified = True

    # 새로운 Account 정보 생성
    hashed_password = hash_password(account.password)  # 암호화된 비밀번호

    if account.birth_date is None:  # 입력받은 생년월일을 date 타입으로 변환
        converted_birth_date = None
    else:
        if account.birth_date.year < 1900 or account.birth_date.year > 2022 or \
            account.birth_date.day < 1 or account.birth_date.day > 31 or \
            account.birth_date.month < 1 or account.birth_date.month > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "type": "invalid value",
                    "message": "Invalid value provided for account details (birth date)",
                    "input": jsonable_encoder(account, exclude={"password"})
                }
            )
        converted_birth_date = date(
            year=account.birth_date.year,
            month=account.birth_date.month,
            day=account.birth_date.day
        )

    new_account: AccountsTable = AccountsTable(
        id=new_id,
        email=account.email,
        password=hashed_password,
        role=account.role.upper() if account.role is not None else "TEST",
        user_name=account.user_name,
        birth_date=converted_birth_date,
        gender=account.gender.upper() if account.gender is not None else "OTHER",
        address=account.address
    )

    # 계정 업로드
    result: bool = database.create_account(new_account)

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
                "input": jsonable_encoder(account, exclude={"password"})
            }
        )

# 모든 사용자 계정의 정보를 불러오는 기능
@app.get("/accounts", status_code=status.HTTP_200_OK)
async def get_all_accounts():
    account_list: list = database.get_all_accounts()

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

# 한 사용자 계정 정보를 불러오는 기능
@app.get("/accounts/{user_id}", status_code=status.HTTP_200_OK)
async def get_account(user_id: str):
    account_data: dict = database.get_one_account(user_id)

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

# 한 사용자 계정 정보를 수정하는 기능
@app.patch("/accounts/{user_id}", status_code=status.HTTP_200_OK)
async def update_account(user_id: str, updated_account: Account):
    previous_account: dict = database.get_one_account(user_id)

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
        email_list: list = [data["email"] for data in database.get_all_email()]
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
    result: bool = database.update_one_account(user_id, total_updated_account)

    if result:
        final_updated_account: dict = database.get_one_account(user_id)
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

# 한 사용자 계정을 삭제하는 기능
@app.delete("/accounts/{user_id}", status_code=status.HTTP_200_OK)
async def delete_account(user_id: str, checker: PasswordCheck):
    previous_account: dict = database.get_one_account(user_id)

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

    # 비밀번호 입력이 없이 요청한 경우
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
    hashed_password: str = database.get_hashed_password(user_id)
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
    result: bool = database.delete_one_account(user_id)

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

# ========== Family 부분 ==========

# 주 사용자의 ID를 이용해 가족이 이미 생성되었는지 확인하는 기능
@app.post("/families/check-exist", status_code=status.HTTP_200_OK)
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
    exist_family: str = database.main_id_to_family_id(family_check.id)

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
@app.post("/families", status_code=status.HTTP_201_CREATED)
async def create_family(family: Family):
    # 필수 입력 정보 점검 (Main User)
    if family.main_user is None or family.main_user == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "main_user"],
                "message": "Main user is required",
                "input": jsonable_encoder(family)
            }
        )

    # 가족이 이미 생성되었는지 점검
    exist_family: str = database.main_id_to_family_id(family.main_user)

    if exist_family:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "type": "already exists",
                "message": "Main user already has a family",
                "input": jsonable_encoder(family)
            }
        )

    # 주 사용자로 제공된 ID의 역할 점검
    user_role: str = database.get_one_account(family.main_user)["role"]

    if user_role is not Role.MAIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "type": "invalid value",
                "message": "Input user is not a main user",
                "input": jsonable_encoder(family)
            }
        )

    # ID 생성 및 중복 점검
    new_id: str = ""
    id_verified: bool = False

    while not id_verified:
        new_id: str = random_id(16, Identify.FAMILY)
        family_data: dict = database.get_one_family(new_id)
        id_list = [data["id"] for data in family_data]
        if new_id not in id_list:
            id_verified = True

    # 새로운 가족 정보 생성
    new_family: FamiliesTable = FamiliesTable(
        id=new_id,
        main_user=family.main_user,
        family_name=family.family_name
    )

    result: bool = database.create_family(new_family)

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
                "input": jsonable_encoder(family)
            }
        )

# 모든 가족의 정보를 불러오는 기능
@app.get("/families", status_code=status.HTTP_200_OK)
async def get_all_families():
    family_list: list = database.get_all_families()

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

# 한 가족 정보를 불러오는 기능
@app.get("/families/{family_id}", status_code=status.HTTP_200_OK)
async def get_family(family_id: str):
    family_data: dict = database.get_one_family(family_id)

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

# 한 가족 정보를 수정하는 기능
@app.patch("/families/{family_id}", status_code=status.HTTP_200_OK)
async def update_family(family_id: str, updated_family: Family):
    previous_family: dict = database.get_one_family(family_id)

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
    result: bool = database.update_one_family(family_id, total_updated_family)

    if result:
        final_updated_family: dict = database.get_one_family(family_id)
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

# 한 가족을 삭제하는 기능
@app.delete("/families/{family_id}", status_code=status.HTTP_200_OK)
async def delete_family(family_id: str, checker: PasswordCheck):
    previous_family: dict = database.get_one_family(family_id)

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

    # 비밀번호 입력 없이 요청한 경우
    if checker.password is None or checker.password == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "loc": ["body", "password"],
                "message": "Password is required",
                "input": {"family_id": family_id}
            }
        )

    # 비밀번호 검증
    input_password: str = checker.password
    hashed_password: str = database.get_hashed_password(previous_family["main_user"])
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
    # TODO - 해당 Family에 연관된 Member 삭제 선행

    final_result: bool = database.delete_one_family(family_id)

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
