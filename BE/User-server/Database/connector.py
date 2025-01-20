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
        result: list[dict] = []

        try:
            account_list = self.session.query(AccountTable.email).all()
            result =  [{"email": data[0]} for data in account_list]
        except SQLAlchemyError as error:
            print(f"[DB] Error getting all email: {str(error)}")
            result =  []
        finally:
            self.session.close()
            return result

    # 모든 사용자의 ID 불러오기
    def get_all_account_id(self) -> list[dict]:
        """
        등록된 사용자 계정 ID를 모두 불러오는 기능
        :return: 등록된 사용자의 모든 ID list[dict]
        """
        result: list[dict] = []

        try:
            id_list = self.session.query(AccountTable.id).all()
            result = [{"id": data[0]} for data in id_list]
        except SQLAlchemyError as error:
            print(f"[DB] Error getting all account id: {str(error)}")
            result = []
        finally:
            self.session.close()
            return result

    # 새로운 사용자 계정 추가하기
    def create_account(self, account_data: AccountTable) -> bool:
        """
        새로운 사용자 계정을 만드는 기능
        :param account_data: AccountTable 형식으로 미리 Mapping된 사용자 정보
        :return: 계정이 정상적으로 등록 됬는지 여부 bool
        """
        result: bool = False

        try:
            self.session.add(account_data)
            print(f"[DB] New account created: {account_data}")
            result = True
        except SQLAlchemyError as error:
            self.session.rollback()
            print(f"[DB] Error creating new account: {str(error)}")
            result = False
        finally:
            self.session.commit()
            self.session.close()
            return result

    # 모든 사용자 계정 정보 불러오기
    def get_all_accounts(self) -> list[dict]:
        """
        모든 사용자의 계정 정보를 불러오는 기능
        :return: 사용자 계정 단위로 묶은 데이터 list[dict]
        """
        result: list[dict] = []

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

            serialized_data = [{
                "id": data[0],
                "email": data[1],
                "role": data[2],
                "user_name": data[3],
                "birth_date": data[4],
                "gender": data[5],
                "address": data[6]
            } for data in account_list]
            result = serialized_data

        except SQLAlchemyError as error:
            print(f"[DB] Error getting all account data: {str(error)}")
            result = []
        finally:
            self.session.close()
            return result

    # 한 사용자 계정 정보 불러오기
    def get_one_account(self, account_id: str) -> dict:
        """
        ID를 이용해 하나의 사용자 계정 정보를 불러오는 기능
        :param account_id: 사용자의 ID
        :return: 하나의 사용자 데이터 dict
        """
        result: dict = {}

        try:
            account_data = self.session.query(
                AccountTable.id,
                AccountTable.email,
                AccountTable.role,
                AccountTable.user_name,
                AccountTable.birth_date,
                AccountTable.gender,
                AccountTable.address
            ).filter(AccountTable.id == account_id).first()

            if account_data is not None:
                serialized_data = {
                    "id": account_data[0],
                    "email": account_data[1],
                    "role": account_data[2],
                    "user_name": account_data[3],
                    "birth_date": account_data[4],
                    "gender": account_data[5],
                    "address": account_data[6]
                }
                result = serialized_data
            else:
                result = {}

        except SQLAlchemyError as error:
            print(f"[DB] Error getting one account data: {str(error)}")
            result = {}
        finally:
            self.session.close()
            return result

    # 한 사용자 비밀번호 Hash 정보 불러오기
    def get_hashed_password(self, account_id: str) -> str:
        """
        한 사용자의 Hashed 비밀번호를 불러오는 기능
        :param account_id: 사용자 ID
        :return: Hashed 비밀번호 str
        """
        result: str = ""

        try:
            hashed_password = self.session.query(AccountTable.password).filter(AccountTable.id == account_id).first()[0]
            result = hashed_password.__str__()
        except SQLAlchemyError as error:
            print(f"[DB] Error getting hashed password: {str(error)}")
            result = ""
        finally:
            self.session.close()
            return result

    # 한 사용자 계정 정보 변경하기
    def update_one_account(self, account_id: str, updated_account: AccountTable) -> bool:
        """
        아이디와 최종으로 변경할 데이터를 이용해 계정의 정보를 변경하는 기능
        :param account_id: 사용자의 ID
        :param updated_account: 변경할 정보가 포함된 AccountTable Mapping 정보
        :return: 정보가 성공적으로 변경되었는지 여부 bool
        """
        result: bool = False

        try:
            previous_account = self.session.query(AccountTable).filter(AccountTable.id == account_id).first()

            if previous_account is not None:
                if updated_account.email is not None:
                    previous_account.email = updated_account.email
                if updated_account.role is not None:
                    previous_account.role = updated_account.role
                if updated_account.user_name is not None:
                    previous_account.user_name = updated_account.user_name
                if updated_account.birth_date is not None:
                    previous_account.birth_date = updated_account.birth_date
                if updated_account.gender is not None:
                    previous_account.gender = updated_account.gender
                if updated_account.address is not None:
                    previous_account.address = updated_account.address
                result = True
            else:
                result = False
        except SQLAlchemyError as error:
            self.session.rollback()
            print(f"[DB] Error updating one account data: {str(error)}")
            result = False
        finally:
            self.session.commit()
            self.session.close()
            return result

    # 한 사용자 계정을 삭제하는 기능
    def delete_one_account(self, account_id: str) -> bool:
        """
        사용자 계정 자체를 삭제하는 기능
        :param account_id: 사용자의 ID
        :return: 삭제가 성공적으로 이뤄졌는지 여부 bool
        """
        result: bool = False

        try:
            account_data = self.session.query(AccountTable).filter(AccountTable.id == account_id).first()
            if account_data is not None:
                self.session.delete(account_data)
                result = True
            else:
                result = False
        except SQLAlchemyError as error:
            self.session.rollback()
            print(f"[DB] Error deleting one account data: {str(error)}")
            result = False
        finally:
            self.session.commit()
            self.session.close()
            return result

