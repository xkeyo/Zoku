from typing import Optional
from sqlalchemy.orm import Session
from server.models.users import User
from server.utils.auth import get_password_hash
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

    def create_or_get_google_user(self, db: Session, email: str, first_name: str, last_name: str, google_id: str) -> User:
        """Create or get user from Google OAuth"""
        # Check if user exists by email
        user = self.get_by_email(db, email)
        if user:
            # Update ref_auth with Google ID if not set
            if not user.ref_auth:
                user.ref_auth = google_id
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


user = UserCRUD()
