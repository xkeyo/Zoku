"""
Watchlist schemas for API requests/responses
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class WatchlistItemBase(BaseModel):
    symbol: str
    name: str
    list_name: str = "My Watchlist"


class WatchlistItemCreate(WatchlistItemBase):
    """Schema for adding stock to watchlist"""
    pass


class WatchlistItemResponse(WatchlistItemBase):
    """Schema for watchlist item response"""
    id: int
    user_id: int
    added_at: datetime
    
    class Config:
        from_attributes = True


class WatchlistResponse(BaseModel):
    """Schema for full watchlist response"""
    items: list[WatchlistItemResponse]
    count: int


class WatchlistListResponse(BaseModel):
    """Schema for list of watchlist names"""
    lists: list[str]
    count: int


class WatchlistRenameRequest(BaseModel):
    """Schema for renaming a watchlist"""
    old_name: str
    new_name: str


class WatchlistDeleteRequest(BaseModel):
    """Schema for deleting a watchlist"""
    list_name: str
