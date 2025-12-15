"""
Stock data schemas for API responses.
All price data comes from TradingView widgets on the frontend.
"""
from pydantic import BaseModel
from typing import Optional


class StockQuote(BaseModel):
    """Basic stock quote - prices displayed via TradingView widgets"""
    symbol: str
    name: str
    exchange: str
    current_price: float = 0  # TradingView shows real price
    change: float = 0
    percent_change: float = 0
    high: float = 0
    low: float = 0
    open: float = 0
    previous_close: float = 0
    timestamp: int


class StockSymbol(BaseModel):
    """Stock symbol search result"""
    symbol: str
    description: str
    type: str
    exchange: Optional[str] = None


class CompanyProfile(BaseModel):
    """Company profile information"""
    name: Optional[str] = None
    ticker: Optional[str] = None
    exchange: Optional[str] = None
    industry: Optional[str] = None
    logo: Optional[str] = None
    market_cap: Optional[float] = None
    country: Optional[str] = None
    currency: Optional[str] = None
    ipo: Optional[str] = None
    weburl: Optional[str] = None
