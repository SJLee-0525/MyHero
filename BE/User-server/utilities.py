"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Server Utilities
"""

# Library
import random
import string


def random_id(length : int = 16):
    """
    사용자 ID를 난수로 생성하는 기능
    :param length: [int] ID의 길이
    :return: 문자와 숫자가 혼합된 length 길이의 ID
    """

    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))