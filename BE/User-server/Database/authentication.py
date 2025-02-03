"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Authentication Part
"""
from dotenv import load_dotenv

# Library
from Database.connector import Database
from Database.models import *
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from fastapi import Request, HTTPException, status
from time import time
import os

database: Database = Database()

# 세션 만료 시간 불러오기
load_dotenv()
session_expire_time: int = int(os.getenv("SESSION_EXPIRE_TIME", 1800))

# 로그인을 위해 Session을 생성하는 기능
def create_session(session_data: LoginSessionsTable) -> bool:
    """
    로그인 처리를 위헤 Session을 생성하여 DB에 등록하는 기능
    :param session_data: Session 생성을 위해 LoginSessionsTable로 미리 Mapping된 정보
    :return: Session을 성공적으로 생성했는지 여부 bool
    """
    result: bool = False

    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        try:
            session.add(session_data)
            print(f"[DB] New session created: {session_data}")
            result = True
        except SQLAlchemyError as error:
            session.rollback()
            print(f"[DB] Error creating new session: {str(error)}")
            result = False
        finally:
            session.commit()
            return result

# 로그아웃을 위해 세션을 삭제하는 기능
def delete_session(session_id: str) -> bool:
    """
    로그아웃 처리를 위해 Session을 DB에서 삭제하는 기능
    :param session_id: 제거할 Session의 ID
    :return: Session을 성공적으로 삭제했는지 여부 bool
    """
    result: bool = False

    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        try:
            session_data = session.query(LoginSessionsTable).filter(LoginSessionsTable.xid == session_id).first()
            if session_data is not None:
                session.delete(session_data)
                result = True
            else:
                result = False
        except SQLAlchemyError as error:
            session.rollback()
            print(f"[DB] Error deleting session: {str(error)}")
            result = False
        finally:
            session.commit()
            return result

# 현재 사용자 정보 가져오기
def check_current_user(request: Request) -> str:
    """
    요청한 자료 내의 Cookie 값을 이용해 사용자 ID를 식별하는 기능
    :param request: 사용자가 요청한 자료 덩어리
    :return: 해당 사용자의 ID str
    """
    session_id: str = request.cookies.get("session_id")

    # 세션 아이디가 전해준 쿠키에 포함되어 있는지 확인
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "type": "no data",
                "message": "Session ID is not provided. Please login again with your account."
            }
        )

    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        try:
            login_data = session.query(
                LoginSessionsTable.xid,
                LoginSessionsTable.user_id,
                LoginSessionsTable.last_active,
                LoginSessionsTable.is_main_user
            ).filter(LoginSessionsTable.xid == session_id).first()

            # DB에 해당하는 세션 정보가 존재하는지 확인
            if not login_data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={
                        "type": "unauthorized",
                        "message": "Session ID is invalid."
                    }
                )

            serialized_data: dict = {
                "xid": login_data[0],
                "user_id": login_data[1],
                "last_active": login_data[2],
                "is_main_user": login_data[3]
            }

            # Main User가 아닌 경우 세션 만료를 적용
            if not serialized_data["is_main_user"]:
                current_time: int = int(time())
                last_active: int = serialized_data["last_active"].timestamp()

                # 시간 초과로 세션이 만료되었는지 확인
                if current_time - last_active > session_expire_time:
                    session.delete(login_data)
                    session.commit()
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail={
                            "type": "unauthorized",
                            "message": "Session ID is expired. Please login again with your account."
                        }
                    )

            # 최근 접근 기록 갱신하기
            login_data.last_active = func.now()
        except SQLAlchemyError as error:
            session.rollback()
            print(f"[DB] Error checking current user: {str(error)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "type": "server error",
                    "message": "Failed to check current user. Please try again later."
                }
            )
        finally:
            session.commit()
            return serialized_data["user_id"]
