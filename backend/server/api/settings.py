"""
User Settings API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from server.utils.database import get_db
from server.api.auth import get_current_user
from server import crud
from server.schemas.settings import (
    PasswordChangeRequest,
    ProfileUpdateRequest,
    ProfilePictureResponse,
    SettingsResponse,
)

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/", response_model=SettingsResponse)
async def get_user_settings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get current user settings and profile information"""
    user_id = current_user["user_id"]
    user = crud.user.get(db, user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return SettingsResponse(
        user_id=user.user_id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        profile_image=user.profile_image,
        is_google_account=bool(user.ref_auth),
        created_at=user.created_at.isoformat(),
        last_login=user.last_login.isoformat(),
    )


@router.put("/profile", response_model=SettingsResponse)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update user profile information"""
    user_id = current_user["user_id"]
    
    try:
        user = crud.user.update_profile(
            db=db,
            user_id=user_id,
            first_name=profile_data.first_name,
            last_name=profile_data.last_name,
            email=profile_data.email,
        )
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return SettingsResponse(
            user_id=user.user_id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            profile_image=user.profile_image,
            is_google_account=bool(user.ref_auth),
            created_at=user.created_at.isoformat(),
            last_login=user.last_login.isoformat(),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    user_id = current_user["user_id"]
    
    try:
        success = crud.user.change_password(
            db=db,
            user_id=user_id,
            current_password=password_data.current_password,
            new_password=password_data.new_password,
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Password changed successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/profile-picture", response_model=ProfilePictureResponse)
async def get_profile_picture(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get user profile picture URL"""
    user_id = current_user["user_id"]
    user = crud.user.get(db, user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return ProfilePictureResponse(
        profile_image=user.profile_image,
        is_google_account=bool(user.ref_auth),
    )


@router.post("/profile-picture")
async def update_profile_picture(
    profile_image_url: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update user profile picture URL
    
    For now, accepts a URL. In production, you'd want to:
    1. Accept file upload
    2. Upload to cloud storage (S3, Cloudinary, etc.)
    3. Save the URL to database
    """
    user_id = current_user["user_id"]
    
    user = crud.user.update_profile_picture(db, user_id, profile_image_url)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "message": "Profile picture updated successfully",
        "profile_image": user.profile_image
    }


@router.delete("/profile-picture")
async def delete_profile_picture(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Remove user profile picture"""
    user_id = current_user["user_id"]
    user = crud.user.get(db, user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't delete if it's a Google profile picture
    if user.ref_auth and user.profile_image:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete Google profile picture. Upload a custom picture to replace it."
        )
    
    user = crud.user.update_profile_picture(db, user_id, None)
    
    return {"message": "Profile picture removed successfully"}


@router.delete("/account")
async def delete_account(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete user account (soft delete by deactivating)"""
    user_id = current_user["user_id"]
    user = crud.user.get(db, user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Soft delete - deactivate account
    user.is_active = False
    db.commit()
    
    return {"message": "Account deactivated successfully"}
