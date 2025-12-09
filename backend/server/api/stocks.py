from fastapi import APIRouter, HTTPException, Query
from typing import List
from datetime import datetime

from server.schemas.stocks import (
    StockQuote,
    StockSymbol,
    CompanyProfile,
    PatternAnalysisRequest,
    PatternAnalysisResponse,
    PatternDetection,
    StockDataResponse,
    CandleData
)
from server.utils.stock_service_yfinance import get_stock_service
from server.utils.pattern_recognition import PatternRecognizer

router = APIRouter(prefix="/stocks", tags=["Stocks"])


@router.get("/quote/{symbol}", response_model=StockQuote)
async def get_stock_quote(symbol: str):
    try:
        stock_service = get_stock_service()
        quote = stock_service.get_quote(symbol.upper())
        return StockQuote(**quote)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/search", response_model=List[StockSymbol])
async def search_stocks(query: str = Query(..., min_length=1)):
    try:
        stock_service = get_stock_service()
        results = stock_service.search_symbols(query)
        return [StockSymbol(**item) for item in results]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/profile/{symbol}", response_model=CompanyProfile)
async def get_company_profile(symbol: str):
    try:
        stock_service = get_stock_service()
        profile = stock_service.get_company_profile(symbol.upper())
        return CompanyProfile(**profile)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/candles/{symbol}", response_model=StockDataResponse)
async def get_stock_candles(
    symbol: str,
    resolution: str = Query(default="D"),
    days_back: int = Query(default=180, ge=30, le=365)
):
    try:
        stock_service = get_stock_service()
        df = stock_service.get_candles(symbol.upper(), resolution, days_back)
        
        candles = [
            CandleData(
                timestamp=str(row["timestamp"]),
                open=float(row["open"]),
                high=float(row["high"]),
                low=float(row["low"]),
                close=float(row["close"]),
                volume=float(row["volume"])
            )
            for _, row in df.iterrows()
        ]
        
        return StockDataResponse(
            symbol=symbol.upper(),
            resolution=resolution,
            candles=candles,
            data_points=len(candles)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/patterns/analyze", response_model=PatternAnalysisResponse)
async def analyze_patterns(request: PatternAnalysisRequest):
    try:
        stock_service = get_stock_service()
        df = stock_service.get_candles(
            request.symbol.upper(),
            request.resolution,
            request.days_back
        )
        
        if len(df) < 20:
            raise HTTPException(
                status_code=400,
                detail="Insufficient data for pattern analysis. Need at least 20 data points."
            )
        
        recognizer = PatternRecognizer(df)
        patterns = recognizer.detect_all_patterns()
        current_price = float(df.iloc[-1]["close"])
        
        pattern_detections = [PatternDetection(**pattern) for pattern in patterns]
        
        return PatternAnalysisResponse(
            symbol=request.symbol.upper(),
            resolution=request.resolution,
            data_points=len(df),
            patterns_found=pattern_detections,
            current_price=current_price,
            analysis_timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pattern analysis failed: {str(e)}")


@router.get("/patterns/{symbol}", response_model=PatternAnalysisResponse)
async def quick_pattern_analysis(
    symbol: str,
    resolution: str = Query(default="D"),
    days_back: int = Query(default=180, ge=30, le=365)
):
    request = PatternAnalysisRequest(
        symbol=symbol,
        resolution=resolution,
        days_back=days_back
    )
    return await analyze_patterns(request)


@router.get("/")
async def stocks_info():
    return {
        "message": "Stock Market Pattern Recognition API",
        "version": "1.0.0",
        "features": [
            "Real-time stock quotes",
            "Historical candlestick data",
            "Advanced pattern recognition",
            "Support/Resistance detection",
            "Company profiles",
            "Symbol search"
        ],
        "data_provider": "Yahoo Finance",
        "patterns_supported": [
            "Head and Shoulders",
            "Inverse Head and Shoulders",
            "Double Top/Bottom",
            "Triple Top/Bottom",
            "Ascending/Descending/Symmetrical Triangles",
            "Bull/Bear Flags",
            "Rising/Falling Wedges",
            "Bullish/Bearish Engulfing",
            "Hammer",
            "Shooting Star",
            "Doji",
            "Support/Resistance Levels"
        ]
    }
