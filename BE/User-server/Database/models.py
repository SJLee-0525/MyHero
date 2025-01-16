"""
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Care-bot User API Server ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Database Table Models
"""

# Library
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

# Create table base
Base = declarative_base()


class Account(Base):
    __tablename__ = "account"

    id = Column(String(16), primary_key=True, nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    role = Column(String(16), nullable=False)
    user_name = Column(String(32), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(16), nullable=True)
    address = Column(String(128), nullable=True)

    def __repr__(self):
        return (f"" +
                f"<Account(id='{self.id}', " +
                f"email='{self.email}', " +
                f"password='{self.password}', " +
                f"role='{self.role}', " +
                f"user_name='{self.user_name}', " +
                f"age='{self.age}', " +
                f"gender='{self.gender}', " +
                f"address='{self.address}')>"
                )
