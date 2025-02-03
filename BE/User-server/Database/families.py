"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Families Part
"""

# DB Connector
from connector import Database
from Database.models import *
from sqlalchemy.exc import SQLAlchemyError

database: Database = Database()

# 모든 가족의 ID 불러오기
# DEPRECATED : 사용하지 않아서 삭제될 예정
def get_all_family_id() -> list[dict]:
    """
    등록된 모든 가족의 ID를 불러오는 기능
    :return: 등록된 모든 가족의 ID list[dict]
    """
    result: list[dict] = []

    with database.get_pre_session() as session:
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
def get_all_family_main() -> list[dict]:
    """
    등록된 모든 가족의 Main User ID를 불러오는 기능
    :return: 등록된 모든 가족의 Main User ID list[dict]
    """
    result: list[dict] = []

    with database.get_pre_session() as session:
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
def main_id_to_family_id(main_id: str) -> str:
    """
    주 사용자 ID로 가족 ID를 불러오는 기능
    :param main_id: 주 사용자의 ID
    :return: 가족 ID str
    """
    result: str = ""

    with database.get_pre_session() as session:
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
def create_family(family_data: FamiliesTable) -> bool:
    """
    새로운 가족을 생성하는 기능
    :param family_data: FamiliesTable 형식으로 미리 Mapping된 사용자 정보
    :return: 가족이 정상적으로 등록됬는지 여부 bool
    """
    result: bool = False

    with database.get_pre_session() as session:
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
def get_all_families() -> list[dict]:
    """
    모든 가족 정보를 불러오는 기능
    :return: 가족 단위로 묶은 데이터 list[dict]
    """
    result: list[dict] = []

    with database.get_pre_session() as session:
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
def get_one_family(family_id: str) -> dict:
    """
    Family ID를 이용해 하나의 가족 데이터를 불러오는 기능
    :param family_id: 가족의 ID
    :return: 하나의 가족 데이터 dict
    """
    result: dict = {}

    with database.get_pre_session() as session:
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
def update_one_family(family_id: str, updated_family: FamiliesTable) -> bool:
    """
    가족 ID와 변경할 정보를 토대로 DB에 입력된 가족 정보를 변경하는 기능
    :param family_id: 가족의 ID
    :param updated_family: 변경할 정보가 포함된 FamiliesTable Mapping 정보
    :return: 성공적으로 변경되었는지 여부 bool
    """
    result: bool = False

    with database.get_pre_session() as session:
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
def delete_one_family(family_id: str) -> bool:
    """
    가족 정보 자체를 삭제하는 기능
    :param family_id: 가족의 ID
    :return: 정상적으로 삭제되었는지 여부 bool
    """
    result: bool = False

    with database.get_pre_session() as session:
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