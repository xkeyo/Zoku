from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class StockQuote(BaseModel):
    """Real-time stock quote"""
    symbol: str
    current_price: float
    change: float
    percent_change: float
    high: float
    low: float
    open: float
    previous_close: float
    timestamp: int


class StockSymbol(BaseModel):
    """Stock symbol search result"""
    symbol: str
    description: str
    type: str


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


class CandleData(BaseModel):
    """Single candlestick data point"""
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class PatternDetection(BaseModel):
    """Detected chart pattern"""
    pattern: str
    type: str  # reversal, continuation, support_resistance
    direction: str  # bullish, bearish, neutral
    start_index: int
    end_index: int
    start_date: str
    end_date: str
    confidence: float
    key_levels: Optional[Dict[str, Any]] = None
    target_price: Optional[float] = None
    description: str


class PatternAnalysisRequest(BaseModel):
    """Request for pattern analysis"""
    symbol: str = Field(..., description="Stock symbol (e.g., AAPL)")
    resolution: str = Field(default="D", description="Time resolution: 1, 5, 15, 30, 60, D, W, M")
    days_back: int = Field(default=180, ge=30, le=365, description="Days of historical data")


class PatternAnalysisResponse(BaseModel):
    """Response with pattern analysis"""
    symbol: str
    resolution: str
    data_points: int
    patterns_found: List[PatternDetection]
    current_price: Optional[float] = None
    analysis_timestamp: str


class StockDataResponse(BaseModel):
    """Historical stock data response"""
    symbol: str
    resolution: str
    candles: List[CandleData]
    data_points: int
