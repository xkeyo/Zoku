"""
Watchlist model for storing user's favorite stocks
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from server.utils.database import Base


class Watchlist(Base):
    """User's stock watchlist"""
    __tablename__ = "watchlists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    list_name = Column(String(100), nullable=False, default="My Watchlist", index=True)
    symbol = Column(String(10), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="watchlist", foreign_keys=[user_id])
    
    # Ensure user can't add same stock twice to the same list
    __table_args__ = (
        UniqueConstraint('user_id', 'list_name', 'symbol', name='unique_user_list_stock'),
    )
    
    def __repr__(self):
        return f"<Watchlist(user_id={self.user_id}, symbol={self.symbol})>"
