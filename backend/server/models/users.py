import datetime

from sqlalchemy import (
    TIMESTAMP,
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    UniqueConstraint,
    event,
    DateTime
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import JSON

from server.utils.database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id =Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
        unique=True,
    )
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    profile_image = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(
        TIMESTAMP,
        default=datetime.datetime.utcnow,
        nullable=False,
    )

    last_login = Column(
        TIMESTAMP,
        default=datetime.datetime.utcnow,
        nullable=False,
    )

    ref_auth = Column(String, nullable=True, default=None, unique=True, index=True)
    reset_token = Column(String, nullable=True, default=None, unique=True)
    reset_token_expiry = Column(DateTime, nullable=True, default=None)
    meta = Column(JSON, nullable=True)

    
    
    
    
    
