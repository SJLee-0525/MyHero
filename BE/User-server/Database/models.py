"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Table Models
"""

# Library
from sqlalchemy import Column, Date, TIMESTAMP, INT, FLOAT, Enum, TEXT, String, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

from enum import Enum as BaseEnum

# Create table base
Base = declarative_base()

# Enum
class Role(BaseEnum):
    TEST = "test"
    SYSTEM = "system"
    MAIN = "main"
    SUB = "sub"


class Gender(BaseEnum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Order(BaseEnum):
    ASC = "asc"
    DESC = "desc"

# ========== DB Tables ==========

class AccountsTable(Base):
    """
    사용자 계정 정보
    """
    __tablename__ = "accounts"

    id = Column(String(16), primary_key=True, nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    role = Column(Enum(Role), nullable=False)
    user_name = Column(String(32), nullable=True)
    birth_date = Column(Date, nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    address = Column(String(128), nullable=True)

    family_relations = relationship("FamiliesTable", cascade="all, delete")
    member_relations = relationship("MemberRelationsTable", cascade="all, delete")
    login_sessions = relationship("LoginSessionsTable", cascade="all, delete")

    def __repr__(self):
        return (f"" +
                f"<Account(id='{self.id}', " +
                f"email='{self.email}', " +
                f"password='{self.password}', " +
                f"role='{self.role}', " +
                f"user_name='{self.user_name}', " +
                f"birth_date='{self.birth_date}', " +
                f"gender='{self.gender}', " +
                f"address='{self.address}')>"
                )

class FamiliesTable(Base):
    """
    가족 정보
    """
    __tablename__ = "families"

    id = Column(String(16), primary_key=True, nullable=False)
    main_user = Column(String(16), ForeignKey('accounts.id'), nullable=False)
    family_name = Column(String(128), nullable=True)

    member_relations = relationship("MemberRelationsTable", cascade="all, delete")
    home_status = relationship("HomeStatusTable", cascade="all, delete")
    health_status = relationship("HealthStatusTable", cascade="all, delete")
    active_status = relationship("ActiveStatusTable", cascade="all, delete")
    mental_status = relationship("MentalStatusTable", cascade="all, delete")
    mental_reports = relationship("MentalReportsTable", cascade="all, delete")

    def __repr__(self):
        return (f"" +
                f"<Family(id='{self.id}', " +
                f"main_user='{self.main_user}', " +
                f"family_name='{self.family_name}')>"
                )

class MemberRelationsTable(Base):
    """
    가족에 연관된 멤버 정보
    """
    __tablename__ = "memberrelations"

    id = Column(String(16), primary_key=True, nullable=False)
    family_id = Column(String(16), ForeignKey('families.id'), nullable=False)
    user_id = Column(String(16), ForeignKey('accounts.id'), nullable=False)
    nickname = Column(String(32), nullable=True)

    def __repr__(self):
        return (f"" +
                f"<MemberRelation(id='{self.id}', " +
                f"family_id='{self.family_id}', " +
                f"user_id='{self.user_id}', " +
                f"nickname='{self.nickname}')>"
                )

class LoginSessionsTable(Base):
    """
    사용자의 로그인 세션 정보
    """
    __tablename__ = "loginsessions"

    xid = Column(String(32), primary_key=True, nullable=False)
    user_id = Column(String(16), ForeignKey('accounts.id'), nullable=False)
    last_active = Column(TIMESTAMP, nullable=True, server_default=func.now(), server_onupdate=func.now())
    is_main_user = Column(Boolean, nullable=False)

    def __repr__(self):
        return (f"" +
                f"<LoginSession(xid='{self.xid}', " +
                f"user_id='{self.user_id}', " +
                f"last_active='{self.last_active}', " +
                f"is_main_user='{self.is_main_user}')>"
                )

class HomeStatusTable(Base):
    __tablename__ = "homestatus"

    index = Column(INT, primary_key=True, nullable=False, autoincrement=True)
    family_id = Column(String(16), ForeignKey('families.id'), nullable=False)
    reported_at = Column(TIMESTAMP, nullable=True, server_default=func.now())
    temperature = Column(FLOAT, nullable=True)
    humidity = Column(FLOAT, nullable=True)
    dust_level = Column(FLOAT, nullable=True)
    ethanol = Column(FLOAT, nullable=True)
    others = Column(TEXT, nullable=True)

    def __repr__(self):
        return (f"" +
                f"<HomeStatus(index='{self.index}', " +
                f"family_id='{self.family_id}', " +
                f"reported_at='{self.reported_at}', " +
                f"temperature='{self.temperature}', " +
                f"humidity='{self.humidity}', " +
                f"dust_level='{self.dust_level}', " +
                f"ethanol='{self.ethanol}', " +
                f"others='{self.others}')>"
        )

class HealthStatusTable(Base):
    __tablename__ = "healthstatus"

    index = Column(INT, primary_key=True, nullable=False, autoincrement=True)
    family_id = Column(String(16), ForeignKey('families.id'), nullable=False)
    reported_at = Column(TIMESTAMP, nullable=True, server_default=func.now())
    heart_rate = Column(INT, nullable=True)

    def __repr__(self):
        return (f"" +
                f"<HealthStatus(index='{self.index}', " +
                f"family_id='{self.family_id}', " +
                f"reported_at='{self.reported_at}', " +
                f"heart_rate='{self.heart_rate}')>"
        )

class ActiveStatusTable(Base):
    __tablename__ = "activestatus"

    index = Column(INT, primary_key=True, nullable=False, autoincrement=True)
    family_id = Column(String(16), ForeignKey('families.id'), nullable=False)
    reported_at = Column(TIMESTAMP, nullable=True, server_default=func.now())
    score = Column(INT, nullable=True)
    action = Column(String(32), nullable=True)
    is_critical = Column(Boolean, nullable=True)
    description = Column(TEXT, nullable=True)

    def __repr__(self):
        return (f"" +
                f"<ActiveStatus(index='{self.index}', " +
                f"family_id='{self.family_id}', " +
                f"reported_at='{self.reported_at}', " +
                f"score='{self.score}', " +
                f"action='{self.action}', " +
                f"is_critical='{self.is_critical}', " +
                f"description='{self.description}')>"
        )

class MentalStatusTable(Base):
    __tablename__ = "mentalstatus"

    index = Column(INT, primary_key=True, nullable=False, autoincrement=True)
    family_id = Column(String(16), ForeignKey('families.id'), nullable=False)
    reported_at = Column(TIMESTAMP, nullable=True, server_default=func.now())
    score = Column(INT, nullable=True)
    is_critical = Column(Boolean, nullable=True)
    description = Column(TEXT, nullable=True)

    def __repr__(self):
        return (f"" +
                f"<MentalStatus(index='{self.index}', " +
                f"family_id='{self.family_id}', " +
                f"reported_at='{self.reported_at}', " +
                f"score='{self.score}', " +
                f"is_critical='{self.is_critical}', " +
                f"description='{self.description}')>"
        )

class MentalReportsTable(Base):
    __tablename__ = "mentalreports"

    index = Column(INT, primary_key=True, nullable=False, autoincrement=True)
    family_id = Column(String(16), ForeignKey('families.id'), nullable=False)
    reported_at = Column(TIMESTAMP, nullable=True, server_default=func.now())
    start_time = Column(TIMESTAMP, nullable=True)
    end_time = Column(TIMESTAMP, nullable=True)
    average_score = Column(INT, nullable=True)
    critical_days = Column(INT, nullable=True)
    best_day = Column(Date, nullable=True)
    worst_day = Column(Date, nullable=True)
    improvement_needed = Column(Boolean, nullable=True)
    summary = Column(TEXT, nullable=True)
