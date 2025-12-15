"""
Stock market API endpoints with real data from Finnhub.
Provides search for ALL stocks, real-time quotes, and company profiles.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List

from server.schemas.stocks import (
    StockQuote,
    StockSymbol,
    CompanyProfile,
)
from server.utils.stock_service_real import get_stock_service

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


@router.post("/quotes/batch", response_model=List[StockQuote])
async def get_batch_quotes(symbols: List[str]):
    """
    Get quotes for multiple symbols in a single request.
    Limit to 50 symbols per request to avoid rate limiting.
    """
    if len(symbols) > 50:
        raise HTTPException(status_code=400, detail="Maximum 50 symbols per request")
    
    try:
        stock_service = get_stock_service()
        quotes = []
        for symbol in symbols:
            try:
                quote = stock_service.get_quote(symbol.upper())
                quotes.append(StockQuote(**quote))
            except Exception as e:
                print(f"Failed to fetch {symbol}: {e}")
                continue
        return quotes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/market-movers")
async def get_market_movers():
    """
    Get top gainers and losers from a curated list of stocks.
    Returns pre-calculated market movers to reduce frontend API calls.
    """
    try:
        stock_service = get_stock_service()
        
        # Curated list of diverse stocks
        symbols = [
            "AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA",
            "AMD", "INTC", "NFLX", "PYPL", "CRWD", "SNOW",
            "JPM", "BAC", "V", "MA", "GS",
            "JNJ", "UNH", "PFE", "LLY",
            "WMT", "HD", "MCD", "NKE", "COST",
            "XOM", "CVX", "BA", "CAT",
            "TSM", "AVGO", "COIN", "UBER", "ABNB"
        ]
        
        quotes = []
        for symbol in symbols:
            try:
                quote = stock_service.get_quote(symbol)
                quotes.append(quote)
            except Exception as e:
                print(f"Failed to fetch {symbol}: {e}")
                continue
        
        # Sort by percent change
        sorted_by_gain = sorted(quotes, key=lambda x: x.get('percent_change', 0), reverse=True)
        sorted_by_loss = sorted(quotes, key=lambda x: x.get('percent_change', 0))
        
        return {
            "gainers": sorted_by_gain[:5],
            "losers": sorted_by_loss[:5],
            "total_analyzed": len(quotes)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
async def stocks_info():
    return {
        "message": "Stock Market Data API - Hybrid Approach",
        "version": "3.0.0",
        "features": [
            "Real-time stock quotes from Finnhub (FREE)",
            "Search ALL US stocks via Finnhub",
            "Company profiles",
            "Charts powered by TradingView widgets"
        ],
        "data_providers": {
            "quotes": "Finnhub (60 req/min free)",
            "charts": "TradingView (unlimited, free)"
        }
    }
