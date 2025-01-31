"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Server Utilities
"""

# Library
import random
import string
import bcrypt
from enum import Enum

class Identify(Enum):
    USER = "user"
    FAMILY = "family"
    MEMBER = "member"


def random_id(length : int = 16, type : Identify = Identify.USER):
    """
    사용자 ID를 난수로 생성하는 기능
    :param length: [int] ID의 길이
    :param type: [Identify] 생성하려는 ID의 종류
    :return: 문자와 숫자가 혼합된 length 길이의 ID
    """

    characters = string.ascii_letters + string.digits
    start = type.value[0].upper()
    return start + ''.join(random.choice(characters) for _ in range(length - 1))


def hash_password(plain_password: str) -> str:
    """
    평문 비밀번호를 암호화된 비밀번호로 변경해주는 기능
    :param plain_password: 평문 비밀번호
    :return: 암호화된 비밀번호
    """

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


def verify_password(input_password: str, hashed_password: str) -> bool:
    """
    사용자가 입력한 평문 비밀번호와 저장된 암호화 비밀번호가 일치하는지 확인하는 기능
    :param input_password: 사용자가 입력한 평문 비밀번호
    :param hashed_password: DB에 저장된 암호화 비밀번호
    :return: True -> 일치함, False -> 불일치함
    """
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))
