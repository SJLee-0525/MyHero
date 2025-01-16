"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Body Data Blocks
"""

# Library
from pydantic import BaseModel


class EmailCheck(BaseModel):
    """
    중복 이메일을 검증하기 위해 Client가 보내는 데이터
    """
    email: str  # 중복을 검증할 이메일 주소


class PersonalInfo(BaseModel):
    """
    사용자의 민감 정보 데이터
    """
    user_name: str  # 사용자 본명
    age: int  # 사용자 연령
    gender: str  # 사용자 성별 ("male" or "female")
    address: str  # 사용자 거주지 ("읍면동" 단위까지)


class Account(BaseModel):
    """
    계정 생성을 위해 Client가 보내는 데이터
    """
    email: str  # 로그인에 사용할 이메일 주소
    password: str  # 로그인에 사용할 비밀번호
    role: str  # 사용자의 역할 ("main", "sub", "system")
    personal_info: PersonalInfo  # 사용자의 민감 정보