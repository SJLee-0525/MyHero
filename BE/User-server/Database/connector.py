"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Connector
"""

# Library
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker
from Database.models import *
from dotenv import load_dotenv
import os


class Database:
    def __init__(self):
        load_dotenv()  # database environment 불러오기

        self.host = os.getenv("DB_HOST")
        self.port = int(os.getenv("DB_PORT", 3306))
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        self.schema = os.getenv("DB_SCHEMA")
        self.charset = os.getenv("DB_CHARSET", "utf8")

        # Connection Pool 방식 SQL 연결 생성
        self.engine = create_engine(
            f"mysql+pymysql://{self.user}:"+
            f"{self.password}@{self.host}:{self.port}/"+
            f"{self.schema}?charset={self.charset}",
            pool_size=5,
            max_overflow=10,
            pool_recycle=3600,
            echo=False
        )

        # ORM Session 설정
        self.pre_session = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        self.session = self.pre_session()

        print("[DB] DB Engine created and ready to use!")

    # 모든 사용자의 이메일 불러오기
    def get_all_email(self) -> list[dict]:
        """
        등록된 사용자 계정 이메일을 모두 불러오는 기능
        :return: 등록된 사용자의 모든 이메일 list[dict]
        """
        try:
            account_list = self.session.query(AccountTable.email).all()
            return [{"email": data[0]} for data in account_list]
        except SQLAlchemyError as error:
            print(f"[DB] Error getting all email: {str(error)}")
            return []
        finally:
            self.session.close()

    # 모든 사용자의 ID 불러오기
    def get_all_account_id(self) -> list[dict]:
        """
        등록된 사용자 계정 ID를 모두 불러오는 기능
        :return: 등록된 사용자의 모든 ID list[dict]
        """
        try:
            id_list = self.session.query(AccountTable.id).all()
            return [{"id": data[0]} for data in id_list]
        except SQLAlchemyError as error:
            print(f"[DB] Error getting all account id: {str(error)}")
            return []
        finally:
            self.session.close()

    # 새로운 사용자 계정 추가하기
    def create_account(self, account_data: AccountTable) -> bool:
        try:
            self.session.add(account_data)
            print(f"[DB] New account created: {account_data}")
            return True
        except SQLAlchemyError as error:
            self.session.rollback()
            print(f"[DB] Error creating new account: {str(error)}")
            return False
        finally:
            self.session.commit()
            self.session.close()


    # 모든 사용자 계정 정보 불러오기
    def get_all_account(self) -> list[dict]:
        try:
            account_list = self.session.query(
                AccountTable.id,
                AccountTable.email,
                AccountTable.role,
                AccountTable.user_name,
                AccountTable.birth_date,
                AccountTable.gender,
                AccountTable.address
            ).all()
            print(f"[DB] All account data retrieved: {account_list}")
            serialized_data = [{
                "id": data[0],
                "email": data[1],
                "role": data[2],
                "user_name": data[3],
                "birth_date": data[4],
                "gender": data[5],
                "address": data[6]
            } for data in account_list]
            return serialized_data
        except SQLAlchemyError as error:
            print(f"[DB] Error getting all account data: {str(error)}")
            return []
        finally:
            self.session.close()


