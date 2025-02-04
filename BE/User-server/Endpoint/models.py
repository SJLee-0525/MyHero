"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Endpoint Data Models
"""

# Library
from pydantic import BaseModel
from typing import Optional


class Date(BaseModel):
    """
    날짜 데이터
    """
    year: int
    month: int
    day: int

class EmailCheck(BaseModel):
    """
    중복 이메일을 검증하기 위해 Client가 보내는 데이터
    """
    email: Optional[str] = None  # 중복을 검증할 이메일 주소

class PasswordCheck(BaseModel):
    """
    계정 삭제를 위해 Client가 보내는 데이터
    """
    password: Optional[str] = None  # 계정 삭제를 위해 검증할 비밀번호

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

class IDCheck(BaseModel):
    """
    계정 확인 및 점검을 위해 Client가 보내는 데이터
    """
    id: Optional[str] = None  # 확인 및 점검을 위한 ID

class Family(BaseModel):
    """
    가족 생성을 위해 client가 보내는 데이터
    """
    main_user: Optional[str] = None  # 가족의 대표가 될 주 사용자 ID
    family_name: Optional[str] = None  # 가족 구성의 별명

class Member(BaseModel):
    """
    가족 관계 생성을 위해 client가 보내는 데이터
    """
    family_id: Optional[str] = None  # 가족의 ID
    user_id: Optional[str] = None  # 관계를 생성할 대상의 사용자 ID
    nickname: Optional[str] = None  # 주 사용자에게 보여질 별명

class Login(BaseModel):
    """
    로그인을 위해 client가 보내는 데이터
    """
    email: Optional[str] = None  # 로그인에 사용할 이메일 주소
    password: Optional[str] = None  # 로그인에 사용할 비밀번호

class ChangePassword(BaseModel):
    """
    사용자의 비밀번호를 변경하기 위해서 client가 보내는 데이터
    """
    user_id: Optional[str] = None  # 사용자의 ID
    current_password: Optional[str] = None  # 기존의 비밀번호
    new_password: Optional[str] = None  # 새로운 비밀번호
