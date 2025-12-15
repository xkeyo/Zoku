from typing import Optional
from sqlalchemy.orm import Session
from server.models.users import User
from server.utils.auth import get_password_hash, verify_password
from server.schemas.users import UserCreate
from datetime import datetime

class UserCRUD:
    def get(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.user_id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create_user(self, db: Session, user: UserCreate) -> User:
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def create_or_get_google_user(self, db: Session, email: str, first_name: str, last_name: str, 
                                   google_id: str, profile_picture: Optional[str] = None) -> User:
        """Create or get user from Google OAuth"""
        # Check if user exists by email
        user = self.get_by_email(db, email)
        if user:
            # Update ref_auth with Google ID if not set
            if not user.ref_auth:
                user.ref_auth = google_id
            # Update profile picture from Google if available
            if profile_picture and not user.profile_image:
                user.profile_image = profile_picture
            db.commit()
            db.refresh(user)
            return user
        
        # Create new user with Google OAuth
        db_user = User(
            email=email,
            password=get_password_hash(google_id),  # Use Google ID as password hash
            first_name=first_name,
            last_name=last_name,
            ref_auth=google_id,
            profile_image=profile_picture,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update_last_login(self, db: Session, user_id: int) -> Optional[User]:
        user = self.get(db, user_id)
        if user:
            user.last_login = datetime.now()
            db.commit()
            db.refresh(user)
        return user

    def update_profile(self, db: Session, user_id: int, first_name: Optional[str] = None, 
                      last_name: Optional[str] = None, email: Optional[str] = None) -> Optional[User]:
        """Update user profile information"""
        user = self.get(db, user_id)
        if not user:
            return None
        
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if email is not None:
            # Check if email is already taken by another user
            existing = db.query(User).filter(User.email == email, User.user_id != user_id).first()
            if existing:
                raise ValueError("Email already in use")
            user.email = email
        
        db.commit()
        db.refresh(user)
        return user

    def change_password(self, db: Session, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user password"""
        user = self.get(db, user_id)
        if not user:
            return False
        
        # Check if user is Google account (ref_auth is set)
        if user.ref_auth:
            raise ValueError("Cannot change password for Google accounts")
        
        # Verify current password
        if not verify_password(current_password, user.password):
            raise ValueError("Current password is incorrect")
        
        # Update password
        user.password = get_password_hash(new_password)
        db.commit()
        return True

    def update_profile_picture(self, db: Session, user_id: int, profile_image_url: str) -> Optional[User]:
        """Update user profile picture"""
        user = self.get(db, user_id)
        if not user:
            return None
        
        user.profile_image = profile_image_url
        db.commit()
        db.refresh(user)
        return user

    def get_profile_picture(self, db: Session, user_id: int) -> Optional[str]:
        """Get user profile picture URL"""
        user = self.get(db, user_id)
        if not user:
            return None
        return user.profile_image


user = UserCRUD()
