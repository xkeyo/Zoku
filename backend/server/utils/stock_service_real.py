"""
Real stock data service using Finnhub API.
Provides real-time quotes, search, and company data.
Free tier: 60 API calls/minute
"""
import os
import time
import hashlib
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime
import finnhub

logger = logging.getLogger(__name__)

CACHE_TTL = 60  # 1 minute cache for real-time data
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "demo")  # Get from env or use demo


class StockDataService:
    """
    Real stock data service using Finnhub API.
    Provides actual market data for all US stocks.
    """
    
    def __init__(self):
        self._cache: Dict = {}
        self._cache_ttl = CACHE_TTL
        self._client = finnhub.Client(api_key=FINNHUB_API_KEY)
        self._last_request_time = 0
        self._min_request_interval = 1.0  # 1 second between requests
        
        logger.info(f"Initialized Finnhub client with API key: {FINNHUB_API_KEY[:10]}...")
    
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
        """Simple rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self._last_request_time
        if time_since_last < self._min_request_interval:
            time.sleep(self._min_request_interval - time_since_last)
        self._last_request_time = time.time()
    
    def get_quote(self, symbol: str) -> Dict:
        """Get real-time stock quote from Finnhub"""
        try:
            cache_key = self._get_cache_key({'function': 'quote', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching real quote for {symbol}")
            self._rate_limit()
            
            # Get real-time quote
            quote = self._client.quote(symbol)
            
            if not quote or quote.get('c', 0) == 0:
                raise ValueError(f"No data available for {symbol}")
            
            current_price = quote['c']  # Current price
            previous_close = quote['pc']  # Previous close
            high = quote['h']  # High
            low = quote['l']  # Low
            open_price = quote['o']  # Open
            
            change = current_price - previous_close
            percent_change = (change / previous_close * 100) if previous_close else 0
            
            # Get company profile for name
            try:
                profile = self._client.company_profile2(symbol=symbol)
                name = profile.get('name', f'{symbol} Inc.')
                exchange = profile.get('exchange', 'UNKNOWN')
            except:
                name = f'{symbol} Inc.'
                exchange = 'UNKNOWN'
            
            result = {
                "symbol": symbol,
                "name": name,
                "exchange": exchange,
                "current_price": float(current_price),
                "change": float(change),
                "percent_change": float(percent_change),
                "high": float(high),
                "low": float(low),
                "open": float(open_price),
                "previous_close": float(previous_close),
                "timestamp": int(time.time()),
            }
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {e}")
            raise Exception(f"Error fetching quote for {symbol}: {str(e)}")
    
    def search_symbols(self, query: str) -> List[Dict]:
        """Search for stock symbols - returns ALL matching stocks"""
        try:
            cache_key = self._get_cache_key({'function': 'search', 'query': query})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Searching for: {query}")
            self._rate_limit()
            
            # Search using Finnhub
            results = self._client.symbol_lookup(query)
            
            if not results or 'result' not in results:
                return []
            
            # Format results
            formatted_results = []
            for item in results['result'][:20]:  # Limit to top 20
                # Only include US stocks
                if item.get('type') in ['Common Stock', 'EQS']:
                    formatted_results.append({
                        "symbol": item['symbol'],
                        "description": item['description'],
                        "type": item.get('type', 'EQUITY'),
                        "exchange": item.get('displaySymbol', item['symbol']).split(':')[0] if ':' in item.get('displaySymbol', '') else 'US'
                    })
            
            self._set_cache(cache_key, formatted_results)
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error searching symbols: {e}")
            raise Exception(f"Error searching symbols: {str(e)}")
    
    def get_company_profile(self, symbol: str) -> Dict:
        """Get company profile information"""
        try:
            cache_key = self._get_cache_key({'function': 'profile', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching profile for {symbol}")
            self._rate_limit()
            
            profile = self._client.company_profile2(symbol=symbol)
            
            if not profile:
                raise Exception(f"No profile data available for {symbol}")
            
            result = {
                "name": profile.get("name"),
                "ticker": profile.get("ticker", symbol),
                "exchange": profile.get("exchange"),
                "industry": profile.get("finnhubIndustry"),
                "logo": profile.get("logo"),
                "market_cap": profile.get("marketCapitalization"),
                "country": profile.get("country"),
                "currency": profile.get("currency"),
                "ipo": profile.get("ipo"),
                "weburl": profile.get("weburl"),
            }
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching profile for {symbol}: {e}")
            raise Exception(f"Error fetching profile for {symbol}: {str(e)}")
    
    def get_candles(self, symbol: str, resolution: str = "D", days_back: int = 30) -> List[Dict]:
        """Get historical candle data"""
        try:
            cache_key = self._get_cache_key({
                'function': 'candles',
                'symbol': symbol,
                'resolution': resolution,
                'days_back': days_back
            })
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching candles for {symbol}")
            self._rate_limit()
            
            # Calculate timestamps
            to_timestamp = int(time.time())
            from_timestamp = to_timestamp - (days_back * 24 * 60 * 60)
            
            # Get candles from Finnhub
            candles = self._client.stock_candles(
                symbol=symbol,
                resolution=resolution,
                _from=from_timestamp,
                to=to_timestamp
            )
            
            if not candles or candles.get('s') != 'ok':
                raise ValueError(f"No candle data available for {symbol}")
            
            # Format candles
            result = []
            for i in range(len(candles['t'])):
                result.append({
                    'timestamp': candles['t'][i],
                    'open': candles['o'][i],
                    'high': candles['h'][i],
                    'low': candles['l'][i],
                    'close': candles['c'][i],
                    'volume': candles['v'][i]
                })
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching candles for {symbol}: {e}")
            raise Exception(f"Error fetching candles for {symbol}: {str(e)}")


_stock_service: Optional[StockDataService] = None


def get_stock_service() -> StockDataService:
    global _stock_service
    if _stock_service is None:
        _stock_service = StockDataService()
    return _stock_service
