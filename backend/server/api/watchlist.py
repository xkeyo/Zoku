"""
Watchlist API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.utils.database import get_db
from server.models.watchlist import Watchlist
from server.schemas.watchlist import (
    WatchlistItemCreate,
    WatchlistItemResponse,
    WatchlistResponse,
    WatchlistListResponse,
    WatchlistRenameRequest,
    WatchlistDeleteRequest,
)
from server.api.auth import get_current_user
from server.models.users import User

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.get("/lists", response_model=WatchlistListResponse)
async def get_watchlist_names(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all watchlist names for the user"""
    user_id = current_user.user_id
    lists = db.query(Watchlist.list_name).filter(
        Watchlist.user_id == user_id
    ).distinct().all()
    list_names = [item[0] for item in lists]
    return WatchlistListResponse(lists=list_names, count=len(list_names))


@router.get("/", response_model=WatchlistResponse)
async def get_watchlist(
    list_name: str = "My Watchlist",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's watchlist for a specific list"""
    user_id = current_user.user_id
    items = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == list_name
    ).order_by(Watchlist.added_at.desc()).all()
    return WatchlistResponse(items=items, count=len(items))


@router.post("/", response_model=WatchlistItemResponse)
async def add_to_watchlist(
    item: WatchlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add stock to watchlist"""
    user_id = current_user.user_id
    
    # Check if already exists in this list
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == item.list_name,
        Watchlist.symbol == item.symbol.upper()
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Stock already in this watchlist")
    
    watchlist_item = Watchlist(
        user_id=user_id,
        list_name=item.list_name,
        symbol=item.symbol.upper(),
        name=item.name
    )
    
    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)
    
    return watchlist_item


@router.delete("/{symbol}")
async def remove_from_watchlist(
    symbol: str,
    list_name: str = "My Watchlist",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove stock from watchlist"""
    user_id = current_user.user_id
    
    item = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == list_name,
        Watchlist.symbol == symbol.upper()
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Stock not in this watchlist")
    
    db.delete(item)
    db.commit()
    
    return {"message": f"{symbol} removed from watchlist"}


@router.get("/check/{symbol}")
async def check_in_watchlist(
    symbol: str,
    list_name: str = "My Watchlist",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check if stock is in watchlist"""
    user_id = current_user.user_id
    
    exists = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == list_name,
        Watchlist.symbol == symbol.upper()
    ).first() is not None
    
    return {"in_watchlist": exists}


@router.post("/rename")
async def rename_watchlist(
    request: WatchlistRenameRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Rename a watchlist"""
    user_id = current_user.user_id
    
    # Check if new name already exists
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == request.new_name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Watchlist with this name already exists")
    
    # Update all items with old name
    items = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == request.old_name
    ).all()
    
    if not items:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    
    for item in items:
        item.list_name = request.new_name
    
    db.commit()
    
    return {"message": "Watchlist renamed successfully"}


@router.delete("/list")
async def delete_watchlist(
    request: WatchlistDeleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an entire watchlist"""
    user_id = current_user.user_id
    
    items = db.query(Watchlist).filter(
        Watchlist.user_id == user_id,
        Watchlist.list_name == request.list_name
    ).all()
    
    if not items:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    
    for item in items:
        db.delete(item)
    
    db.commit()
    
    return {"message": "Watchlist deleted successfully"}