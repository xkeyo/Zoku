from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, constr

class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str

class UserLoginSchema(BaseModel):
    email: str
    password: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    ref_auth: Optional[str] = None
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[datetime] = None
    last_login: Optional[datetime] = None

class UserChangePasswordSchema(BaseModel):
    old_password: str = Field(..., min_length=8, description="Your current password")
    new_password: str = Field(
        ..., min_length=8, description="Your desired new password"
    )

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = constr(min_length=8)

class EmailVerificationRequest(BaseModel):
    token: str
    otp_code: str

class ResendVerificationRequest(BaseModel):
    email: str

class UserResponse(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    email: str
    profile_image: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True