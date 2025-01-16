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
        :return: 등록된 사용자의 모든 이메일 list
        """
        try:
            account_list = self.session.query(Account.email).all()
            return [{"email": data[0]} for data in account_list]

        except SQLAlchemyError as error:
            print(f"[DB] Error getting all email: {str(error)}")
            return []
        finally:
            self.session.close()
