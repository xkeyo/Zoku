from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import httpx

from server import crud
from server.schemas.users import UserCreate, UserResponse
from server.utils.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_current_user,
    decode_access_token
)
from server.utils.database import get_db
from server.utils.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    crud.user.update_last_login(db, user.user_id)
    access_token = create_access_token({"uid": user.user_id, "email": user.email})
    refresh_token = create_refresh_token({"uid": user.user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.user.get_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )

    user = crud.user.create_user(db=db, user=user_data)
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user=Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = decode_access_token(refresh_token)
        user_id = payload.get("uid")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = crud.user.get(db, user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        access_token = create_access_token({"uid": user.user_id, "email": user.email})
        new_refresh_token = create_refresh_token({"uid": user.user_id})

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/google/login")
async def google_login():
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"access_type=offline"
    )
    return {"url": google_auth_url}


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    try:
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
            token_data = token_response.json()
            
            if "error" in token_data:
                raise HTTPException(status_code=400, detail=token_data["error"])
            
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token_data['access_token']}"},
            )
            user_info = user_info_response.json()
        
        email = user_info.get("email")
        google_id = user_info.get("id")
        first_name = user_info.get("given_name", "")
        last_name = user_info.get("family_name", "")
        
        if not email or not google_id:
            raise HTTPException(status_code=400, detail="Invalid user info from Google")
        
        user = crud.user.create_or_get_google_user(
            db=db,
            email=email,
            first_name=first_name,
            last_name=last_name,
            google_id=google_id,
        )
        
        crud.user.update_last_login(db, user.user_id)
        access_token = create_access_token({"uid": user.user_id, "email": user.email})
        refresh_token = create_refresh_token({"uid": user.user_id})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(user),
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")
