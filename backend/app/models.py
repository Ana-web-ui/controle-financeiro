from sqlalchemy import Column, Integer, String, Boolean, Float, Date, DateTime, ForeignKey  # ← adiciona DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_configured = Column(Boolean, default=False)
    balance = Column(Float, default=0)
    setup_step = Column(String, default="waiting_balance")

    transactions = relationship("Transaction", back_populates="owner")
    categories = relationship("Category", back_populates="owner")
    tokens = relationship("RefreshToken", back_populates="user")  # ← adiciona isso

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime)            # ← DateTime maiúsculo
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)  # ← DateTime maiúsculo
    user = relationship("User", back_populates="tokens")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    date = Column(Date)

    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    owner = relationship("User", back_populates="transactions")
    category = relationship("Category")
    
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="categories")
    
