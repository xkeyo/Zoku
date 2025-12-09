from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pandas as pd
import yfinance as yf
import time
import hashlib
import json
import logging
from functools import wraps
import requests
import numpy as np

logger = logging.getLogger(__name__)

CACHE_TTL = 600
MIN_REQUEST_INTERVAL = 2.0
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
USE_MOCK_DATA = True  # Set to False when Yahoo Finance is working


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
    def __init__(self):
        self._cache: Dict = {}
        self._cache_ttl = CACHE_TTL
        self._last_request_time = 0
        self._min_request_interval = MIN_REQUEST_INTERVAL
        
        self._session = requests.Session()
        self._session.headers.update({
            'User-Agent': USER_AGENT,
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        })
    
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
        try:
            cache_key = self._get_cache_key({'function': 'quote', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching quote for {symbol}")
            
            try:
                ticker = yf.Ticker(symbol, session=self._session)
                info = ticker.info
                
                current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
                previous_close = info.get('previousClose', current_price)
                
                if not current_price or current_price == 0:
                    raise ValueError("No price data available")
                    
            except Exception as e:
                if USE_MOCK_DATA:
                    logger.warning(f"Using mock quote for {symbol}: {e}")
                    mock_df = self._generate_mock_data(symbol, 2)
                    current_price = float(mock_df.iloc[-1]['close'])
                    previous_close = float(mock_df.iloc[-2]['close'])
                    info = {
                        'dayHigh': float(mock_df.iloc[-1]['high']),
                        'dayLow': float(mock_df.iloc[-1]['low']),
                        'open': float(mock_df.iloc[-1]['open']),
                    }
                else:
                    raise
            
            change = current_price - previous_close
            percent_change = (change / previous_close * 100) if previous_close else 0
            
            result = {
                "symbol": symbol,
                "current_price": float(current_price),
                "change": float(change),
                "percent_change": float(percent_change),
                "high": float(info.get('dayHigh') or info.get('regularMarketDayHigh', current_price)),
                "low": float(info.get('dayLow') or info.get('regularMarketDayLow', current_price)),
                "open": float(info.get('open') or info.get('regularMarketOpen', current_price)),
                "previous_close": float(previous_close),
                "timestamp": int(datetime.now().timestamp()),
            }
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {e}")
            raise Exception(f"Error fetching quote for {symbol}: {str(e)}")
    
    @retry_on_error(max_retries=1, delay=3)
    def get_candles(self, symbol: str, resolution: str = "D", days_back: int = 180) -> pd.DataFrame:
        try:
            cache_key = self._get_cache_key({
                'function': 'candles',
                'symbol': symbol,
                'resolution': resolution,
                'days_back': days_back
            })
            cached = self._get_cached(cache_key)
            if cached:
                return pd.DataFrame(cached)
            
            logger.info(f"Fetching candles for {symbol} (resolution={resolution}, days_back={days_back})")
            self._rate_limit()
            
            interval_map = {
                '1': '1m', '5': '5m', '15': '15m', '30': '30m',
                '60': '1h', 'D': '1d', 'W': '1wk', 'M': '1mo'
            }
            period_map = {
                30: '1mo', 60: '2mo', 90: '3mo', 180: '6mo', 365: '1y'
            }
            
            interval = interval_map.get(resolution, '1d')
            period = period_map.get(days_back, f'{days_back}d')
            
            ticker = yf.Ticker(symbol, session=self._session)
            
            try:
                df = ticker.history(period=period, interval=interval, auto_adjust=True, actions=False)
            except Exception as e:
                logger.error(f"yfinance error for {symbol}: {e}")
                if USE_MOCK_DATA:
                    logger.warning(f"Using mock data for {symbol} due to Yahoo Finance error")
                    df = self._generate_mock_data(symbol, days_back)
                else:
                    raise Exception(f"Unable to fetch data for {symbol}. Yahoo Finance may be rate limiting.")
            
            if df is None or df.empty:
                if USE_MOCK_DATA:
                    logger.warning(f"Using mock data for {symbol} - no data from Yahoo")
                    df = self._generate_mock_data(symbol, days_back)
                else:
                    raise Exception(f"No data available for {symbol}. Try again later.")
            
            df = df.reset_index()
            df = df.rename(columns={
                'Date': 'timestamp', 'Datetime': 'timestamp',
                'Open': 'open', 'High': 'high', 'Low': 'low',
                'Close': 'close', 'Volume': 'volume'
            })
            
            df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
            
            if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
                df['timestamp'] = pd.to_datetime(df['timestamp'])
            
            df = df.sort_values('timestamp').reset_index(drop=True)
            self._set_cache(cache_key, df.to_dict('records'))
            
            logger.info(f"Successfully fetched {len(df)} candles for {symbol}")
            return df
            
        except Exception as e:
            logger.error(f"Error fetching candles for {symbol}: {e}")
            raise Exception(f"Error fetching candles for {symbol}: {str(e)}")
    
    def search_symbols(self, query: str) -> List[Dict]:
        try:
            cache_key = self._get_cache_key({'function': 'search', 'query': query})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Searching symbols for: {query}")
            results = []
            
            try:
                ticker = yf.Ticker(query.upper(), session=self._session)
                info = ticker.info
                if info and 'symbol' in info:
                    results.append({
                        "symbol": info.get('symbol', query.upper()),
                        "description": info.get('longName') or info.get('shortName', ''),
                        "type": info.get('quoteType', 'EQUITY'),
                    })
            except:
                pass
            
            self._set_cache(cache_key, results)
            return results
            
        except Exception as e:
            logger.error(f"Error searching symbols: {e}")
            raise Exception(f"Error searching symbols: {str(e)}")
    
    def _generate_mock_data(self, symbol: str, days_back: int) -> pd.DataFrame:
        """Generate realistic mock stock data for development/demo purposes"""
        base_prices = {
            'AAPL': 180.0,
            'TSLA': 250.0,
            'NVDA': 500.0,
            'MSFT': 380.0,
            'GOOGL': 140.0,
            'AMZN': 150.0,
            'META': 350.0,
            'JPM': 150.0,
        }
        
        base_price = base_prices.get(symbol, 100.0)
        dates = pd.date_range(end=datetime.now(), periods=days_back, freq='D')
        
        np.random.seed(hash(symbol) % 2**32)
        returns = np.random.normal(0.001, 0.02, days_back)
        prices = base_price * np.exp(np.cumsum(returns))
        
        data = []
        for i, date in enumerate(dates):
            price = prices[i]
            daily_volatility = price * 0.02
            
            open_price = price + np.random.normal(0, daily_volatility)
            close_price = price + np.random.normal(0, daily_volatility)
            high_price = max(open_price, close_price) + abs(np.random.normal(0, daily_volatility))
            low_price = min(open_price, close_price) - abs(np.random.normal(0, daily_volatility))
            volume = int(np.random.uniform(50000000, 150000000))
            
            data.append({
                'timestamp': date,
                'open': open_price,
                'high': high_price,
                'low': low_price,
                'close': close_price,
                'volume': volume
            })
        
        return pd.DataFrame(data)
    
    def get_company_profile(self, symbol: str) -> Dict:
        try:
            cache_key = self._get_cache_key({'function': 'profile', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            logger.info(f"Fetching profile for {symbol}")
            ticker = yf.Ticker(symbol, session=self._session)
            info = ticker.info
            
            if not info or 'symbol' not in info:
                raise Exception(f"No profile data available for {symbol}")
            
            result = {
                "name": info.get("longName") or info.get("shortName"),
                "ticker": info.get("symbol"),
                "exchange": info.get("exchange"),
                "industry": info.get("industry"),
                "logo": info.get("logo_url"),
                "market_cap": info.get("marketCap"),
                "country": info.get("country"),
                "currency": info.get("currency"),
                "ipo": None,
                "weburl": info.get("website"),
            }
            
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
