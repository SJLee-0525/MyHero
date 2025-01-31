"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Connector
"""

# Library
from sqlalchemy import create_engine
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
            pool_size=10,
            max_overflow=20,
            pool_recycle=1800,
            echo=False
        )

        # ORM Session 설정
        self.pre_session = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )

        print("[DB] DB Engine created and ready to use!")

    # ========== Accounts ==========

    # 모든 사용자의 이메일 불러오기
    def get_all_email(self) -> list[dict]:
        """
        등록된 사용자 계정 이메일을 모두 불러오는 기능
        :return: 등록된 사용자의 모든 이메일 list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                account_list = session.query(AccountsTable.email).all()
                result = [{"email": data[0]} for data in account_list]
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting all email: {str(error)}")
                result = []
            finally:
                return result

    # 모든 사용자의 ID 불러오기
    # DEPRECATED : 사용하지 않아서 삭제될 예정
    def get_all_account_id(self) -> list[dict]:
        """
        등록된 사용자 계정 ID를 모두 불러오는 기능
        :return: 등록된 사용자의 모든 ID list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                id_list = session.query(AccountsTable.id).all()
                result = [{"id": data[0]} for data in id_list]
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting all account id: {str(error)}")
                result = []
            finally:
                return result

    # 새로운 사용자 계정 추가하기
    def create_account(self, account_data: AccountsTable) -> bool:
        """
        새로운 사용자 계정을 만드는 기능
        :param account_data: AccountsTable 형식으로 미리 Mapping된 사용자 정보
        :return: 계정이 정상적으로 등록 됬는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                session.add(account_data)
                print(f"[DB] New account created: {account_data}")
                result = True
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error creating new account: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # 모든 사용자 계정 정보 불러오기
    def get_all_accounts(self) -> list[dict]:
        """
        모든 사용자의 계정 정보를 불러오는 기능
        :return: 사용자 계정 단위로 묶은 데이터 list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                account_list = session.query(
                    AccountsTable.id,
                    AccountsTable.email,
                    AccountsTable.role,
                    AccountsTable.user_name,
                    AccountsTable.birth_date,
                    AccountsTable.gender,
                    AccountsTable.address
                ).all()

                serialized_data: list[dict] = [{
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
                session.rollback()
                print(f"[DB] Error getting all account data: {str(error)}")
                result = []
            finally:
                return result

    # 사용자 계정 정보 불러오기
    def get_one_account(self, account_id: str) -> dict:
        """
        ID를 이용해 하나의 사용자 계정 정보를 불러오는 기능
        :param account_id: 사용자의 ID
        :return: 하나의 사용자 데이터 dict
        """
        result: dict = {}

        with self.pre_session() as session:
            try:
                account_data = session.query(
                    AccountsTable.id,
                    AccountsTable.email,
                    AccountsTable.role,
                    AccountsTable.user_name,
                    AccountsTable.birth_date,
                    AccountsTable.gender,
                    AccountsTable.address
                ).filter(AccountsTable.id == account_id).first()

                if account_data is not None:
                    serialized_data: dict = {
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
                session.rollback()
                print(f"[DB] Error getting one account data: {str(error)}")
                result = {}
            finally:
                return result

    # 사용자 비밀번호 Hash 정보 불러오기
    def get_hashed_password(self, account_id: str) -> str:
        """
        한 사용자의 Hashed 비밀번호를 불러오는 기능
        :param account_id: 사용자 ID
        :return: Hashed 비밀번호 str
        """
        result: str = ""

        with self.pre_session() as session:
            try:
                hashed_password = \
                session.query(AccountsTable.password).filter(AccountsTable.id == account_id).first()[0]
                result = hashed_password.__str__()
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting hashed password: {str(error)}")
                result = ""
            finally:
                return result

    # 사용자 계정 정보 변경하기
    def update_one_account(self, account_id: str, updated_account: AccountsTable) -> bool:
        """
        아이디와 최종으로 변경할 데이터를 이용해 계정의 정보를 변경하는 기능
        :param account_id: 사용자의 ID
        :param updated_account: 변경할 정보가 포함된 AccountsTable Mapping 정보
        :return: 정보가 성공적으로 변경되었는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                previous_account = session.query(AccountsTable).filter(AccountsTable.id == account_id).first()

                if previous_account is not None:
                    # 이메일 정보가 있는 경우 변경
                    if updated_account.email is not None:
                        previous_account.email = updated_account.email
                    # 사용자 역할이 있는 경우 변경
                    if updated_account.role is not None:
                        previous_account.role = updated_account.role
                    # 사용자 이름이 있는 경우 변경
                    if updated_account.user_name is not None:
                        previous_account.user_name = updated_account.user_name
                    # 생년월일이 있는 경우 변경
                    if updated_account.birth_date is not None:
                        previous_account.birth_date = updated_account.birth_date
                    # 성별 정보가 있는 경우
                    if updated_account.gender is not None:
                        previous_account.gender = updated_account.gender
                    # 주소 정보가 있는 경우
                    if updated_account.address is not None:
                        previous_account.address = updated_account.address
                    result = True
                else:
                    result = False
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error updating one account data: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # 사용자 계정을 삭제하는 기능 (비밀번호 검증 필요)
    def delete_one_account(self, account_id: str) -> bool:
        """
        사용자 계정 자체를 삭제하는 기능
        :param account_id: 사용자의 ID
        :return: 삭제가 성공적으로 이뤄졌는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                account_data = session.query(AccountsTable).filter(AccountsTable.id == account_id).first()
                if account_data is not None:
                    session.delete(account_data)
                    result = True
                else:
                    result = False
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error deleting one account data: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # ========== Families ==========

    # 모든 가족의 ID 불러오기
    # DEPRECATED : 사용하지 않아서 삭제될 예정
    def get_all_family_id(self) -> list[dict]:
        """
        등록된 모든 가족의 ID를 불러오는 기능
        :return: 등록된 모든 가족의 ID list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                id_list = session.query(FamiliesTable.id).all()
                result = [{"id": data[0]} for data in id_list]
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting all family id: {str(error)}")
                result = []
            finally:
                return result

    # 모든 가족의 Main User ID 불러오기
    # DEPRECATED : 사용하지 않아서 삭제될 예정
    def get_all_family_main(self) -> list[dict]:
        """
        등록된 모든 가족의 Main User ID를 불러오는 기능
        :return: 등록된 모든 가족의 Main User ID list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                main_id_list = session.query(FamiliesTable.main_user).all()
                result = [{"main_id": data[0]} for data in main_id_list]
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting all family main id: {str(error)}")
                result = []
            finally:
                return result

    # 주 사용자 ID로 가족 ID를 불러오기
    def main_id_to_family_id(self, main_id: str) -> str:
        """
        주 사용자 ID로 가족 ID를 불러오는 기능
        :param main_id: 주 사용자의 ID
        :return: 가족 ID str
        """
        result: str = ""

        with self.pre_session() as session:
            try:
                family_id = session.query(FamiliesTable.id).filter(FamiliesTable.main_user == main_id).first()

                if family_id is not None:
                    result = family_id[0].__str__()
                else:
                    result = ""
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting family id from main id: {str(error)}")
                result = ""
            finally:
                return result

    # 새로운 가족을 생성하는 기능
    def create_family(self, family_data: FamiliesTable) -> bool:
        """
        새로운 가족을 생성하는 기능
        :param family_data: FamiliesTable 형식으로 미리 Mapping된 사용자 정보
        :return: 가족이 정상적으로 등록됬는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                session.add(family_data)
                print(f"[DB] New family created: {family_data}")
                result = True
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error creating new family: {str(error)}")
            finally:
                session.commit()
                return result

    # 모든 가족 정보를 불러오는 기능
    def get_all_families(self) -> list[dict]:
        """
        모든 가족 정보를 불러오는 기능
        :return: 가족 단위로 묶은 데이터 list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                family_list = session.query(
                    FamiliesTable.id,
                    FamiliesTable.main_user,
                    FamiliesTable.family_name
                ).all()

                serialized_data: list[dict] = [{
                    "id": data[0],
                    "main_user": data[1],
                    "family_name": data[2]
                } for data in family_list]

                result = serialized_data
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting all family data: {str(error)}")
                result = []
            finally:
                return result

    # 가족 정보를 불러오는 기능
    def get_one_family(self, family_id: str) -> dict:
        """
        Family ID를 이용해 하나의 가족 데이터를 불러오는 기능
        :param family_id: 가족의 ID
        :return: 하나의 가족 데이터 dict
        """
        result: dict = {}

        with self.pre_session() as session:
            try:
                family_data = session.query(
                    FamiliesTable.id,
                    FamiliesTable.main_user,
                    FamiliesTable.family_name
                ).filter(FamiliesTable.id == family_id).first()

                serialized_data: dict = {
                    "id": family_data[0],
                    "main_user": family_data[1],
                    "family_name": family_data[2]
                }

                result = serialized_data
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting one family data: {str(error)}")
                result = {}
            finally:
                return result

    # 가족 정보를 업데이트 하는 기능
    def update_one_family(self, family_id: str, updated_family: FamiliesTable) -> bool:
        """
        가족 ID와 변경할 정보를 토대로 DB에 입력된 가족 정보를 변경하는 기능
        :param family_id: 가족의 ID
        :param updated_family: 변경할 정보가 포함된 FamiliesTable Mapping 정보
        :return: 성공적으로 변경되었는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                previous_family = session.query(FamiliesTable).filter(FamiliesTable.id == family_id).first()

                if previous_family is not None:
                    # 가족 별명 정보가 있는 경우
                    if updated_family.family_name is not None:
                        previous_family.family_name = updated_family.family_name
                    result = True
                else:
                    result = False
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error updating one family data: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # 가족 정보를 삭제하는 기능 (비밀번호 검증 필요)
    def delete_one_family(self, family_id: str) -> bool:
        """
        가족 정보 자체를 삭제하는 기능
        :param family_id: 가족의 ID
        :return: 정상적으로 삭제되었는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                family_data = session.query(FamiliesTable).filter(FamiliesTable.id == family_id).first()
                if family_data is not None:
                    session.delete(family_data)
                    result = True
                else:
                    result = False
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error deleting one family data: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # ========== Members ==========

    # 새로운 가족 관계 생성하는 기능
    def create_member(self, member_data: MemberRelationsTable) -> bool:
        """
        새로운 가족 관계를 생성하는 기능
        :param member_data: MemberRelationsTable 형식으로 미리 Mapping된 정보
        :return: 가족 관계가 정상적으로 생성되었는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                session.add(member_data)
                print(f"[DB] New member created: {member_data}")
                result = True
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error creating new member: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # 조건에 따른 모든 가족 관계 불러오는 기능
    def get_all_members(self, family_id: str = None, user_id: str = None) -> list[dict]:
        """
        조건에 따른 모든 가족 관계 정보 불러오는 기능
        :param family_id: 가족 ID str (Nullable)
        :param user_id: 사용자 계정 ID str (Nullable)
        :return: 가족 관계 단위로 묶은 데이터 list[dict]
        """
        result: list[dict] = []

        with self.pre_session() as session:
            try:
                member_list: list = []

                # 주어진 조건에 따라 Query 설정
                if family_id and not user_id:
                    member_list = session.query(
                        MemberRelationsTable.id,
                        MemberRelationsTable.family_id,
                        MemberRelationsTable.user_id,
                        MemberRelationsTable.nickname
                    ).filter(MemberRelationsTable.family_id == family_id).all()
                elif not family_id and user_id:
                    member_list = session.query(
                        MemberRelationsTable.id,
                        MemberRelationsTable.family_id,
                        MemberRelationsTable.user_id,
                        MemberRelationsTable.nickname
                    ).filter(MemberRelationsTable.user_id == user_id).all()
                elif family_id and user_id:
                    member_list = session.query(
                        MemberRelationsTable.id,
                        MemberRelationsTable.family_id,
                        MemberRelationsTable.user_id,
                        MemberRelationsTable.nickname
                    ).filter(MemberRelationsTable.family_id == family_id and
                             MemberRelationsTable.user_id == user_id).all()
                else:
                    member_list = session.query(
                        MemberRelationsTable.id,
                        MemberRelationsTable.family_id,
                        MemberRelationsTable.user_id,
                        MemberRelationsTable.nickname
                    ).all()

                serialized_data: list[dict] = [{
                    "id": data[0],
                    "family_id": data[1],
                    "user_id": data[2],
                    "nickname": data[3]
                } for data in member_list]

                result = serialized_data
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting all member data: {str(error)}")
                result = []
            finally:
                return result

    # 가족 관계 정보를 불러오는 기능
    def get_one_member(self, member_id: str) -> dict:
        """
        Member ID를 이용해 하나의 가족 관계 정보를 불러오는 기능
        :param member_id: 가족 관계 ID
        :return: 하나의 가족 관계 정보 dict
        """
        result: dict = {}

        with self.pre_session() as session:
            try:
                member_data = session.query(
                    MemberRelationsTable.id,
                    MemberRelationsTable.family_id,
                    MemberRelationsTable.user_id,
                    MemberRelationsTable.nickname
                ).filter(MemberRelationsTable.id == member_id).first()

                serialized_data: dict = {
                    "id": member_data[0],
                    "family_id": member_data[1],
                    "user_id": member_data[2],
                    "nickname": member_data[3]
                }

                result = serialized_data
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error getting one member data: {str(error)}")
                result = {}
            finally:
                return result

    # 가족 관계 정보를 업데이트 하는 기능
    def update_one_member(self, member_id: str, updated_member: MemberRelationsTable) -> bool:
        """
        가족 관계 ID와 변경할 정보를 토대로 DB에 입력된 정보를 변경하는 기능
        :param member_id: 가족 관계를 나타내는 ID
        :param updated_member: 변경할 정보가 포함된 MemberRelationsTable Mapping 정보
        :return: 성공적으로 변경되었는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                previous_member = session.query(MemberRelationsTable).filter(MemberRelationsTable.id == member_id).first()

                if previous_member is not None:
                    # 가족 관계 별명 정보가 있는 경우
                    if updated_member.nickname is not None:
                        previous_member.nickname = updated_member.nickname
                    result = True
                else:
                    result = False
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error updating one member data: {str(error)}")
                result = False
            finally:
                session.commit()
                return result

    # 가족 관계 정보를 삭제하는 기능
    def delete_one_member(self, member_id: str) -> bool:
        """
        가족 관계 정보 자체를 삭제하는 기능
        :param member_id: 가족 관계의 ID
        :return: 정상적으로 삭제되었는지 여부 bool
        """
        result: bool = False

        with self.pre_session() as session:
            try:
                member_data = session.query(MemberRelationsTable).filter(MemberRelationsTable.id == member_id).first()
                if member_data is not None:
                    session.delete(member_data)
                    result = True
                else:
                    result = False
            except SQLAlchemyError as error:
                session.rollback()
                print(f"[DB] Error deleting one member data: {str(error)}")
                result = False
            finally:
                session.commit()
                return result
