"""
Stock data service for TradingView integration.
Provides stock search and basic info without external API calls.
All real-time price data is displayed via TradingView widgets on the frontend.
"""
from typing import Dict, List, Optional
import time
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

CACHE_TTL = 300  # 5 minutes cache


class StockDataService:
    """
    Lightweight stock service for TradingView integration.
    No external API calls - uses local database of popular stocks.
    Real-time prices are displayed via TradingView widgets on frontend.
    """
    
    def __init__(self):
        self._cache: Dict = {}
        self._cache_ttl = CACHE_TTL
        
        # Popular stocks database
        self._stocks_db = {
            'AAPL': {'name': 'Apple Inc.', 'exchange': 'NASDAQ', 'industry': 'Consumer Electronics'},
            'TSLA': {'name': 'Tesla, Inc.', 'exchange': 'NASDAQ', 'industry': 'Auto Manufacturers'},
            'NVDA': {'name': 'NVIDIA Corporation', 'exchange': 'NASDAQ', 'industry': 'Semiconductors'},
            'MSFT': {'name': 'Microsoft Corporation', 'exchange': 'NASDAQ', 'industry': 'Software'},
            'GOOGL': {'name': 'Alphabet Inc.', 'exchange': 'NASDAQ', 'industry': 'Internet Content'},
            'AMZN': {'name': 'Amazon.com Inc.', 'exchange': 'NASDAQ', 'industry': 'Internet Retail'},
            'META': {'name': 'Meta Platforms Inc.', 'exchange': 'NASDAQ', 'industry': 'Internet Content'},
            'JPM': {'name': 'JPMorgan Chase & Co.', 'exchange': 'NYSE', 'industry': 'Banks'},
            'BAC': {'name': 'Bank of America Corp.', 'exchange': 'NYSE', 'industry': 'Banks'},
            'WMT': {'name': 'Walmart Inc.', 'exchange': 'NYSE', 'industry': 'Discount Stores'},
            'V': {'name': 'Visa Inc.', 'exchange': 'NYSE', 'industry': 'Credit Services'},
            'JNJ': {'name': 'Johnson & Johnson', 'exchange': 'NYSE', 'industry': 'Drug Manufacturers'},
            'XOM': {'name': 'Exxon Mobil Corporation', 'exchange': 'NYSE', 'industry': 'Oil & Gas'},
            'PG': {'name': 'Procter & Gamble Co.', 'exchange': 'NYSE', 'industry': 'Household Products'},
            'MA': {'name': 'Mastercard Inc.', 'exchange': 'NYSE', 'industry': 'Credit Services'},
            'HD': {'name': 'Home Depot Inc.', 'exchange': 'NYSE', 'industry': 'Home Improvement'},
            'CVX': {'name': 'Chevron Corporation', 'exchange': 'NYSE', 'industry': 'Oil & Gas'},
            'KO': {'name': 'Coca-Cola Company', 'exchange': 'NYSE', 'industry': 'Beverages'},
            'PEP': {'name': 'PepsiCo Inc.', 'exchange': 'NASDAQ', 'industry': 'Beverages'},
            'NFLX': {'name': 'Netflix Inc.', 'exchange': 'NASDAQ', 'industry': 'Entertainment'},
            'DIS': {'name': 'Walt Disney Company', 'exchange': 'NYSE', 'industry': 'Entertainment'},
            'INTC': {'name': 'Intel Corporation', 'exchange': 'NASDAQ', 'industry': 'Semiconductors'},
            'AMD': {'name': 'Advanced Micro Devices', 'exchange': 'NASDAQ', 'industry': 'Semiconductors'},
            'ORCL': {'name': 'Oracle Corporation', 'exchange': 'NYSE', 'industry': 'Software'},
            'CSCO': {'name': 'Cisco Systems Inc.', 'exchange': 'NASDAQ', 'industry': 'Communication Equipment'},
            'ADBE': {'name': 'Adobe Inc.', 'exchange': 'NASDAQ', 'industry': 'Software'},
            'CRM': {'name': 'Salesforce Inc.', 'exchange': 'NYSE', 'industry': 'Software'},
            'PYPL': {'name': 'PayPal Holdings Inc.', 'exchange': 'NASDAQ', 'industry': 'Credit Services'},
            'COIN': {'name': 'Coinbase Global Inc.', 'exchange': 'NASDAQ', 'industry': 'Financial Services'},
            'SQ': {'name': 'Block Inc.', 'exchange': 'NYSE', 'industry': 'Software'},
            'SHOP': {'name': 'Shopify Inc.', 'exchange': 'NYSE', 'industry': 'Software'},
            'UBER': {'name': 'Uber Technologies Inc.', 'exchange': 'NYSE', 'industry': 'Software'},
            'LYFT': {'name': 'Lyft Inc.', 'exchange': 'NASDAQ', 'industry': 'Software'},
            'ABNB': {'name': 'Airbnb Inc.', 'exchange': 'NASDAQ', 'industry': 'Internet Content'},
            'SPOT': {'name': 'Spotify Technology SA', 'exchange': 'NYSE', 'industry': 'Internet Content'},
            'SNAP': {'name': 'Snap Inc.', 'exchange': 'NYSE', 'industry': 'Internet Content'},
            'TWTR': {'name': 'Twitter Inc.', 'exchange': 'NYSE', 'industry': 'Internet Content'},
            'RBLX': {'name': 'Roblox Corporation', 'exchange': 'NYSE', 'industry': 'Electronic Gaming'},
            'GME': {'name': 'GameStop Corp.', 'exchange': 'NYSE', 'industry': 'Specialty Retail'},
            'AMC': {'name': 'AMC Entertainment Holdings', 'exchange': 'NYSE', 'industry': 'Entertainment'},
        }
    
    def _get_cache_key(self, params: Dict) -> str:
        sorted_params = json.dumps(params, sort_keys=True)
        return hashlib.md5(sorted_params.encode()).hexdigest()
    
    def _get_cached(self, cache_key: str) -> Optional[Dict]:
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            if time.time() - timestamp < self._cache_ttl:
                return cached_data
            del self._cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Dict) -> None:
        self._cache[cache_key] = (data, time.time())
    
    def get_quote(self, symbol: str) -> Dict:
        """
        Returns basic quote info - actual price data comes from TradingView widget
        """
        try:
            cache_key = self._get_cache_key({'function': 'quote', 'symbol': symbol})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            stock_info = self._stocks_db.get(symbol, {
                'name': f'{symbol} Inc.',
                'exchange': 'NASDAQ',
                'industry': 'Technology'
            })
            
            result = {
                "symbol": symbol,
                "current_price": 0,  # TradingView widget will show real price
                "change": 0,
                "percent_change": 0,
                "high": 0,
                "low": 0,
                "open": 0,
                "previous_close": 0,
                "timestamp": int(time.time()),
                "name": stock_info['name'],
                "exchange": stock_info['exchange']
            }
            
            self._set_cache(cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {e}")
            raise Exception(f"Error fetching quote for {symbol}: {str(e)}")
    
    def search_symbols(self, query: str) -> List[Dict]:
        """Search for stock symbols in our database"""
        try:
            cache_key = self._get_cache_key({'function': 'search', 'query': query})
            cached = self._get_cached(cache_key)
            if cached:
                return cached
            
            query_upper = query.upper()
            results = []
            
            for symbol, info in self._stocks_db.items():
                if query_upper in symbol or query_upper in info['name'].upper():
                    results.append({
                        "symbol": symbol,
                        "description": info['name'],
                        "type": "EQUITY",
                        "exchange": info['exchange']
                    })
            
            # Limit to top 10 results
            results = results[:10]
            
            self._set_cache(cache_key, results)
            return results
            
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
            
            stock_info = self._stocks_db.get(symbol, {
                'name': f'{symbol} Inc.',
                'exchange': 'NASDAQ',
                'industry': 'Technology'
            })
            
            result = {
                "name": stock_info['name'],
                "ticker": symbol,
                "exchange": stock_info['exchange'],
                "industry": stock_info['industry'],
                "logo": None,
                "market_cap": None,
                "country": "United States",
                "currency": "USD",
                "ipo": None,
                "weburl": None,
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
