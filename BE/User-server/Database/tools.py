"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Tools Part
"""

# Libraries
from Database.connector import database_instance as database
from Database.models import *

from datetime import datetime, date

from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

from Utilities.logging_tools import *

logger = get_logger("DB_Tools")

# ========== Tool 부분 ==========

# 광역 자치단체 불러오는 기능
def get_all_master_region() -> list[dict]:
    """
    광역자치단체 리스트를 불러오는 기능
    :return: 전체 광역자치단체 list[dict]
    """
    result: list[dict] = []

    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        try:
            region_list = session.query(
                MasterRegionsTable.region_name,
                MasterRegionsTable.region_type
            ).all()

            serialized_data: list[dict] = [{
                "region_name": data[0],
                "region_type": data[1]
            } for data in region_list]

            result = serialized_data
        except SQLAlchemyError as error:
            session.rollback()
            logger.error(f"Error getting all master region data: {str(error)}")
            result = []
        finally:
            return result

# 기초자치단체 불러오는 기능
def get_all_sub_region(master_region: str = None) -> list[dict]:
    """
    해당하는 master_region의 기초자치단체 리스트를 불러오는 기능
    :param master_region: 선택할 광역자치단체 이름 str (Nullable) - 입력이 없으면 모든 기초자치단체
    :return: 선택한 광역자치단체의 기초자치단체 list[dict]
    """
    result: list[dict] = []

    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        try:
            region_list = None
            if master_region is not None:
                region_list = session.query(
                    SubRegionsTable.main_region,
                    SubRegionsTable.sub_region_name,
                    SubRegionsTable.region_type
                ).filter(
                    or_(
                        SubRegionsTable.main_region == master_region,  # 정확히 같은 경우
                        SubRegionsTable.main_region.like(f"%{master_region}%")  # 비슷한 경우
                    )
                ).all()
            else:
                region_list = session.query(
                    SubRegionsTable.main_region,
                    SubRegionsTable.sub_region_name,
                    SubRegionsTable.region_type
                ).all()

            serialized_data: list[dict] = [{
                "main_region": data[0],
                "sub_region_name": data[1],
                "region_type": data[2]
            } for data in region_list]

            result = serialized_data
        except SQLAlchemyError as error:
            session.rollback()
            logger.error(f"Error getting all sub region data: {str(error)}")
            result = []
        finally:
            return result

def get_news(target_date: date) -> dict:
    result: dict = {}

    category_list = [
        "business",
        "entertainment",
        "environment",
        "health",
        "politics",
        "science",
        "sports",
        "technology"
    ]

    database_pre_session = database.get_pre_session()
    with database_pre_session() as session:
        try:
            today_news_list = session.query(
                NewsTable.id,
                NewsTable.category,
                NewsTable.title,
                NewsTable.link,
                NewsTable.image_url,
                NewsTable.pub_date,
                NewsTable.created_at
            ).filter(NewsTable.pub_date == target_date)

            for category in category_list:
                filtered_news_list = today_news_list.filter(NewsTable.category == category).all()

                serialized_data = [{
                    "id": data[0],
                    "category": data[1],
                    "title": data[2],
                    "link": data[3],
                    "image_url": data[4],
                    "pub_date": data[5],
                    "created_at": data[6]
                } for data in filtered_news_list]

                result[category] = serialized_data
        except SQLAlchemyError as error:
            session.rollback()
            logger.error(f"Error getting news data: {str(error)}")
            result = {}
        finally:
            return result
