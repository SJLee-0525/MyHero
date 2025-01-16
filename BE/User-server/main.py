"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
version : 0.0.1
"""

# Libraries
from fastapi import FastAPI, HTTPException, status
from Database.connector import Database
from Endpoint.data_blocks import *

app = FastAPI()
database = Database()


# 새로운 계정을 생성하는 기능
@app.post("/accounts")
async def create_account(account: Account):
    pass


# 가입 가능한 이메일인지 확인하는 기능
@app.post("/accounts/check-email", status_code=status.HTTP_200_OK)
async def check_email(email_check: EmailCheck):
    target_email = email_check.email
    email_list = [data["email"] for data in database.get_all_email()]

    if target_email == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Email is required"
            }
        )
    elif target_email in email_list:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "Email is already in use"
            }
        )
    else:
        return {
            "message": "Email is available"
        }