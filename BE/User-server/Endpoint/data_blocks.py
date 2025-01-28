"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Body Data Blocks
"""

# Library
from pydantic import BaseModel
from typing import Optional


class EmailCheck(BaseModel):
    """
    중복 이메일을 검증하기 위해 Client가 보내는 데이터
    """
    email: str  # 중복을 검증할 이메일 주소

class PasswordCheck(BaseModel):
    """
    계정 삭제를 위해 Client가 보내는 데이터
    """
    password: str  # 계정 삭제를 위해 검증할 비밀번호

class Date(BaseModel):
    """
    날짜 데이터
    """
    year: int
    month: int
    day: int

class Account(BaseModel):
    """
    계정 생성을 위해 client가 보내는 데이터
    """
    email: Optional[str] = None  # 로그인에 사용할 이메일 주소
    password: Optional[str] = None  # 로그인에 사용할 비밀번호
    role: Optional[str] = None  # 사용자의 역할 ("main", "sub", "system", "test")
    user_name: Optional[str] = None  # 사용자 본명
    birth_date: Optional[Date] = None  # 사용자 생년월일
    gender: Optional[str] = None  # 사용자 성별 ("male" or "female")
    address: Optional[str] = None  # 사용자 거주지 ("읍면동" 단위까지)

class Family(BaseModel):
    """
    가족 생성을 위해 client가 보내는 데이터
    """
    main_user: Optional[str] = None  # 가족의 대표가 될 주 사용자 ID
    family_name: Optional[str] = None  # 가족 구성의 별명