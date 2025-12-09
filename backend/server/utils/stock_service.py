import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pandas as pd
import requests
import time
from functools import lru_cache
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


class StockDataService:
    """Service for fetching real-time and historical stock data from Alpha Vantage"""
    
    def __init__(self):
        api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        if not api_key or api_key == "your_alpha_vantage_api_key_here":
            raise ValueError(
                "ALPHA_VANTAGE_API_KEY not configured. "
                "Get a free API key from https://www.alphavantage.co/support/#api-key"
            )
        self.api_key = api_key
        self.base_url = "https://www.alphavantage.co/query"
        self._last_request_time = 0
        self._min_request_interval = 12  # 5 requests per minute = 12 seconds between requests
        self._cache = {}  # Simple in-memory cache
        self._cache_ttl = 300  # Cache for 5 minutes
    
    def _rate_limit(self):
        """Enforce rate limiting"""
        current_time = time.time()
        time_since_last_request = current_time - self._last_request_time
        if time_since_last_request < self._min_request_interval:
            time.sleep(self._min_request_interval - time_since_last_request)
        self._last_request_time = time.time()
    
    def _get_cache_key(self, params: Dict) -> str:
        """Generate cache key from parameters"""
        # Sort params for consistent keys
        sorted_params = json.dumps(params, sort_keys=True)
        return hashlib.md5(sorted_params.encode()).hexdigest()
    
    def _get_cached(self, cache_key: str) -> Optional[Dict]:
        """Get cached data if still valid"""
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if time.time() - timestamp < self._cache_ttl:
                return cached_data
            else:
                # Remove expired cache
                del self._cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Dict):
        """Store data in cache"""
        self._cache[cache_key] = (data, time.time())
    
    def _make_request(self, params: Dict, use_cache: bool = True) -> Dict:
        """Make API request with rate limiting and caching"""
        # Check cache first
        if use_cache:
            cache_key = self._get_cache_key(params)
            cached_data = self._get_cached(cache_key)
            if cached_data is not None:
                logger.info(f"Cache hit for {params.get('function')} {params.get('symbol')}")
                return cached_data
        
        # Make actual request
        logger.info(f"Making API request: {params.get('function')} {params.get('symbol')}")
        self._rate_limit()
        params['apikey'] = self.api_key
        
        try:
            response = requests.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
        except requests.exceptions.Timeout:
            raise Exception("API request timed out. Please try again.")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error: {str(e)}")
        
        # Check for API errors
        if "Error Message" in data:
            logger.error(f"API Error: {data['Error Message']}")
            raise Exception(data["Error Message"])
        if "Note" in data:
            logger.warning("API rate limit exceeded")
            raise Exception("API rate limit exceeded. Please wait a minute.")
        
        # Check if we got empty data
        if not data or len(data) == 0:
            logger.warning(f"Empty response for {params.get('symbol')}")
            raise Exception(f"No data returned from API for {params.get('symbol')}")
        
        # Cache the result
        if use_cache:
            self._set_cache(cache_key, data)
        
        return data
    
    def get_quote(self, symbol: str) -> Dict:
        """Get real-time quote for a stock symbol"""
        try:
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol
            }
            data = self._make_request(params)
            
            if "Global Quote" not in data or not data["Global Quote"]:
                raise Exception(f"No data available for {symbol}")
            
            quote = data["Global Quote"]
            
            return {
                "symbol": symbol,
                "current_price": float(quote.get("05. price", 0)),
                "change": float(quote.get("09. change", 0)),
                "percent_change": float(quote.get("10. change percent", "0").replace("%", "")),
                "high": float(quote.get("03. high", 0)),
                "low": float(quote.get("04. low", 0)),
                "open": float(quote.get("02. open", 0)),
                "previous_close": float(quote.get("08. previous close", 0)),
                "timestamp": int(datetime.now().timestamp()),
            }
        except Exception as e:
            raise Exception(f"Error fetching quote for {symbol}: {str(e)}")
    
    def get_candles(
        self,
        symbol: str,
        resolution: str = "D",
        days_back: int = 180
    ) -> pd.DataFrame:
        """
        Get historical candlestick data
        
        Args:
            symbol: Stock symbol (e.g., 'AAPL')
            resolution: Resolution (D=daily, W=weekly, M=monthly) - intraday not in free tier
            days_back: Number of days of historical data
        
        Returns:
            DataFrame with OHLCV data
        """
        try:
            # Alpha Vantage function mapping
            if resolution == "D":
                function = "TIME_SERIES_DAILY"
                outputsize = "full" if days_back > 100 else "compact"
            elif resolution == "W":
                function = "TIME_SERIES_WEEKLY"
                outputsize = "full"
            elif resolution == "M":
                function = "TIME_SERIES_MONTHLY"
                outputsize = "full"
            else:
                # For intraday, use daily as fallback (intraday requires premium)
                function = "TIME_SERIES_DAILY"
                outputsize = "compact"
            
            params = {
                'function': function,
                'symbol': symbol,
                'outputsize': outputsize
            }
            
            data = self._make_request(params)
            
            # Find the time series key
            time_series_key = None
            for key in data.keys():
                if "Time Series" in key:
                    time_series_key = key
                    break
            
            if not time_series_key or not data[time_series_key]:
                raise Exception(f"No data available for {symbol}")
            
            time_series = data[time_series_key]
            
            # Convert to DataFrame
            df_data = []
            for date_str, values in time_series.items():
                df_data.append({
                    "timestamp": pd.to_datetime(date_str),
                    "open": float(values.get("1. open", 0)),
                    "high": float(values.get("2. high", 0)),
                    "low": float(values.get("3. low", 0)),
                    "close": float(values.get("4. close", 0)),
                    "volume": float(values.get("5. volume", 0))
                })
            
            df = pd.DataFrame(df_data)
            df = df.sort_values("timestamp").reset_index(drop=True)
            
            # Filter by days_back
            cutoff_date = datetime.now() - timedelta(days=days_back)
            df = df[df["timestamp"] >= cutoff_date]
            
            return df
            
        except Exception as e:
            raise Exception(f"Error fetching candles for {symbol}: {str(e)}")
    
    def search_symbols(self, query: str) -> List[Dict]:
        """Search for stock symbols"""
        try:
            params = {
                'function': 'SYMBOL_SEARCH',
                'keywords': query
            }
            data = self._make_request(params)
            
            if "bestMatches" not in data:
                return []
            
            results = []
            for match in data["bestMatches"][:10]:
                results.append({
                    "symbol": match.get("1. symbol", ""),
                    "description": match.get("2. name", ""),
                    "type": match.get("3. type", ""),
                })
            
            return results
        except Exception as e:
            raise Exception(f"Error searching symbols: {str(e)}")
    
    def get_company_profile(self, symbol: str) -> Dict:
        """Get company profile information"""
        try:
            params = {
                'function': 'OVERVIEW',
                'symbol': symbol
            }
            data = self._make_request(params)
            
            if not data or "Symbol" not in data:
                raise Exception(f"No profile data available for {symbol}")
            
            return {
                "name": data.get("Name"),
                "ticker": data.get("Symbol"),
                "exchange": data.get("Exchange"),
                "industry": data.get("Industry"),
                "logo": None,  # Alpha Vantage doesn't provide logos
                "market_cap": float(data.get("MarketCapitalization", 0)) if data.get("MarketCapitalization") else None,
                "country": data.get("Country"),
                "currency": data.get("Currency"),
                "ipo": None,
                "weburl": None,
            }
        except Exception as e:
            raise Exception(f"Error fetching profile for {symbol}: {str(e)}")


# Singleton instance
_stock_service = None


def get_stock_service() -> StockDataService:
    """Get or create stock data service instance"""
    global _stock_service
    if _stock_service is None:
        _stock_service = StockDataService()
    return _stock_service
