"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Server Logging Tools
"""

# Libraries
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)s:\t [%(filename)s] %(message)s",
)

# 각 파일별 logger 반환 기능
def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
