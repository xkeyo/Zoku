/**
 * Stock Market API Client
 * 
 * Frontend API client for stock search and basic info.
 * Real-time price data is displayed via TradingView widgets.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  current_price: number;  // Note: Use TradingView widgets for real-time prices
  change: number;
  percent_change: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  timestamp: number;
}

export interface StockSymbol {
  symbol: string;
  description: string;
  type: string;
  exchange?: string;
}

export interface CompanyProfile {
  name?: string;
  ticker?: string;
  exchange?: string;
  industry?: string;
  logo?: string;
  market_cap?: number;
  country?: string;
  currency?: string;
  ipo?: string;
  weburl?: string;
}

/**
 * Get real-time stock quote
 */
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/quote/${symbol}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to fetch quote for ${symbol}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
}

/**
 * Search for stock symbols
 */
export async function searchStocks(query: string): Promise<StockSymbol[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stocks/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to search stocks');
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to search stocks');
  }
}

/**
 * Get company profile
 */
export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/profile/${symbol}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to fetch profile for ${symbol}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Failed to fetch profile for ${symbol}`);
  }
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Format percent change
 */
export function formatPercentChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Format large numbers (market cap, volume, etc.)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

/**
 * Example usage:
 * 
 * ```tsx
 * import { searchStocks, getStockQuote } from '@/api/stocks';
 * 
 * // Search for stocks
 * const results = await searchStocks('AAPL');
 * 
 * // Get stock quote (basic info - use TradingView widgets for real-time prices)
 * const quote = await getStockQuote('AAPL');
 * 
 * // Get company profile
 * const profile = await getCompanyProfile('AAPL');
 * ```
 */
