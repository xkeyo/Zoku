from datetime import datetime
from typing import Dict, List, Optional
import time
import hashlib
import json
import logging
from functools import wraps
import requests

logger = logging.getLogger(__name__)

CACHE_TTL = 600
MIN_REQUEST_INTERVAL = 2.0
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'


def retry_on_error(max_retries: int = 3, delay: int = 1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    wait_time = delay * (2 ** attempt)
                    logger.warning(f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
            return func(*args, **kwargs)
        return wrapper
    return decorator


class StockDataService:
    """Simplified stock service using Alpha Vantage API"""
    
    def __init__(self):
        self._cache: Dict = {}
        self._cache_ttl = CACHE_TTL
        self._last_request_time = 0
        self._min_request_interval = MIN_REQUEST_INTERVAL
        
        self._session = requests.Session()
        self._session.headers.update({
            'User-Agent': USER_AGENT,
            'Accept': 'application/json',
        })
        
        # Mock data for demo
        self._mock_prices = {
            'AAPL': 180.0,
            'TSLA': 250.0,
            'NVDA': 500.0,
            'MSFT': 380.0,
            'GOOGL': 140.0,
            'AMZN': 150.0,
            'META': 350.0,
            'JPM': 150.0,
        }
    
    def _get_cache_key(self, params: Dict) -> str:
        sorted_params = json.dumps(params, sort_keys=True)
        return hashlib.md5(sorted_params.encode()).hexdigest()
    
    def _get_cached(self, cache_key: str) -> Optional[Dict]:
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if time.time() - timestamp < self._cache_ttl:
                logger.info(f"Cache hit for {cache_key[:8]}...")
                return cached_data
            del self._cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Dict) -> None:
        self._cache[cache_key] = (data, time.time())
    
    def _rate_limit(self) -> None:
        current_time = time.time()
        time_since_last_request = current_time - self._last_request_time
        if time_since_last_request < self._min_request_interval:
            time.sleep(self._min_request_interval - time_since_last_request)
        self._last_request_time = time.time()
    
    def get_quote(self, symbol: str) -> Dict:
        """Get current stock quote - using mock data for demo"""
        try:
            cache_key = self._get_cache_key({'function': 'quote', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching quote for {symbol}")
            
            # Use mock data
            base_price = self._mock_prices.get(symbol, 100.0)
            # Add some random variation
            import random
            variation = random.uniform(-0.02, 0.02)
            current_price = base_price * (1 + variation)
            previous_close = base_price
            
            change = current_price - previous_close
            percent_change = (change / previous_close * 100) if previous_close else 0
            
            result = {
                "symbol": symbol,
                "current_price": float(current_price),
                "change": float(change),
                "percent_change": float(percent_change),
                "high": float(current_price * 1.01),
                "low": float(current_price * 0.99),
                "open": float(previous_close),
                "previous_close": float(previous_close),
                "timestamp": int(datetime.now().timestamp()),
            }
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {e}")
            raise Exception(f"Error fetching quote for {symbol}: {str(e)}")
    
    def search_symbols(self, query: str) -> List[Dict]:
        """Search for stock symbols"""
        try:
            cache_key = self._get_cache_key({'function': 'search', 'query': query})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Searching symbols for: {query}")
            
            # Return mock results
            query_upper = query.upper()
            results = []
            
            mock_symbols = {
                'AAPL': 'Apple Inc.',
                'TSLA': 'Tesla Inc.',
                'NVDA': 'NVIDIA Corporation',
                'MSFT': 'Microsoft Corporation',
                'GOOGL': 'Alphabet Inc.',
                'AMZN': 'Amazon.com Inc.',
                'META': 'Meta Platforms Inc.',
                'JPM': 'JPMorgan Chase & Co.',
            }
            
            for symbol, name in mock_symbols.items():
                if query_upper in symbol or query_upper in name.upper():
                    results.append({
                        "symbol": symbol,
                        "description": name,
                        "type": "EQUITY",
                    })
            
            self._set_cache(cache_key, results)
            return results
            
        except Exception as e:
            logger.error(f"Error searching symbols: {e}")
            raise Exception(f"Error searching symbols: {str(e)}")
    
    def get_company_profile(self, symbol: str) -> Dict:
        """Get company profile"""
        try:
            cache_key = self._get_cache_key({'function': 'profile', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching profile for {symbol}")
            
            # Mock profile data
            mock_profiles = {
                'AAPL': {
                    "name": "Apple Inc.",
                    "ticker": "AAPL",
                    "exchange": "NASDAQ",
                    "industry": "Technology",
                    "logo": None,
                    "market_cap": 3000000000000,
                    "country": "US",
                    "currency": "USD",
                    "ipo": None,
                    "weburl": "https://www.apple.com",
                },
                'TSLA': {
                    "name": "Tesla Inc.",
                    "ticker": "TSLA",
                    "exchange": "NASDAQ",
                    "industry": "Automotive",
                    "logo": None,
                    "market_cap": 800000000000,
                    "country": "US",
                    "currency": "USD",
                    "ipo": None,
                    "weburl": "https://www.tesla.com",
                },
            }
            
            result = mock_profiles.get(symbol, {
                "name": f"{symbol} Inc.",
                "ticker": symbol,
                "exchange": "NASDAQ",
                "industry": "Technology",
                "logo": None,
                "market_cap": 100000000000,
                "country": "US",
                "currency": "USD",
                "ipo": None,
                "weburl": None,
            })
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching profile for {symbol}: {e}")
            raise Exception(f"Error fetching profile for {symbol}: {str(e)}")


_stock_service: Optional[StockDataService] = None


def get_stock_service() -> StockDataService:
    global _stock_service
    if _stock_service is None:
        _stock_service = StockDataService()
    return _stock_service
