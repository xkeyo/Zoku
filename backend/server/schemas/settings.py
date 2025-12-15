"""
User settings schemas for API requests/responses
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional


class PasswordChangeRequest(BaseModel):
    """Schema for changing password"""
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class ProfileUpdateRequest(BaseModel):
    """Schema for updating profile information"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


class ProfilePictureResponse(BaseModel):
    """Schema for profile picture URL response"""
    profile_image: Optional[str] = None
    is_google_account: bool = False


class SettingsResponse(BaseModel):
    """Schema for user settings response"""
    user_id: int
    email: str
    first_name: str
    last_name: str
    profile_image: Optional[str] = None
    is_google_account: bool = False
    created_at: str
    last_login: str
    
    class Config:
        from_attributes = True
