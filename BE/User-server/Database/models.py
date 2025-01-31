"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Table Models
"""

# Library
from sqlalchemy import Column, Date, String, Enum, ForeignKey
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