/**
 * Stock Pattern Recognition API Client
 * 
 * Frontend API client for interacting with the stock pattern recognition backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StockQuote {
  symbol: string;
  current_price: number;
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

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PatternDetection {
  pattern: string;
  type: 'reversal' | 'continuation' | 'support_resistance';
  direction: 'bullish' | 'bearish' | 'neutral';
  start_index: number;
  end_index: number;
  start_date: string;
  end_date: string;
  confidence: number;
  key_levels?: Record<string, any>;
  target_price?: number;
  description: string;
}

export interface PatternAnalysisResponse {
  symbol: string;
  resolution: string;
  data_points: number;
  patterns_found: PatternDetection[];
  current_price?: number;
  analysis_timestamp: string;
}

export interface StockDataResponse {
  symbol: string;
  resolution: string;
  candles: CandleData[];
  data_points: number;
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
  const response = await fetch(`${API_BASE_URL}/stocks/profile/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch profile for ${symbol}`);
  }
  return response.json();
}

/**
 * Get historical candlestick data
 */
export async function getStockCandles(
  symbol: string,
  resolution: string = 'D',
  daysBack: number = 180
): Promise<StockDataResponse> {
  const response = await fetch(
    `${API_BASE_URL}/stocks/candles/${symbol}?resolution=${resolution}&days_back=${daysBack}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch candles for ${symbol}`);
  }
  return response.json();
}

/**
 * Analyze chart patterns for a stock
 */
export async function analyzePatterns(
  symbol: string,
  resolution: string = 'D',
  daysBack: number = 180
): Promise<PatternAnalysisResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stocks/patterns/${symbol}?resolution=${resolution}&days_back=${daysBack}`
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Failed to analyze patterns for ${symbol}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Failed to analyze patterns for ${symbol}`);
  }
}

/**
 * Analyze patterns using POST request (with request body)
 */
export async function analyzePatternsPOST(
  symbol: string,
  resolution: string = 'D',
  daysBack: number = 180
): Promise<PatternAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/stocks/patterns/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbol,
      resolution,
      days_back: daysBack,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to analyze patterns for ${symbol}`);
  }
  return response.json();
}

/**
 * Get pattern color based on direction
 */
export function getPatternColor(direction: string): string {
  switch (direction) {
    case 'bullish':
      return 'text-green-600 bg-green-50';
    case 'bearish':
      return 'text-red-600 bg-red-50';
    case 'neutral':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Get pattern icon based on type
 */
export function getPatternIcon(type: string): string {
  switch (type) {
    case 'reversal':
      return '🔄';
    case 'continuation':
      return '➡️';
    case 'support_resistance':
      return '📊';
    default:
      return '📈';
  }
}

/**
 * Format confidence score as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(0)}%`;
}

/**
 * Get confidence level label
 */
export function getConfidenceLevel(confidence: number): string {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.5) return 'Medium';
  return 'Low';
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
 * Example usage in a React component:
 * 
 * ```tsx
 * import { useState, useEffect } from 'react';
 * import { analyzePatterns, getStockQuote } from '@/api/stocks';
 * 
 * export function StockAnalysis({ symbol }: { symbol: string }) {
 *   const [analysis, setAnalysis] = useState(null);
 *   const [loading, setLoading] = useState(true);
 * 
 *   useEffect(() => {
 *     async function loadData() {
 *       try {
 *         const data = await analyzePatterns(symbol, 'D', 180);
 *         setAnalysis(data);
 *       } catch (error) {
 *         console.error('Failed to load analysis:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     }
 *     loadData();
 *   }, [symbol]);
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (!analysis) return <div>No data</div>;
 * 
 *   return (
 *     <div>
 *       <h2>{analysis.symbol} - Pattern Analysis</h2>
 *       <p>Found {analysis.patterns_found.length} patterns</p>
 *       {analysis.patterns_found.map((pattern, i) => (
 *         <div key={i}>
 *           <h3>{pattern.pattern}</h3>
 *           <p>Direction: {pattern.direction}</p>
 *           <p>Confidence: {formatConfidence(pattern.confidence)}</p>
 *           <p>{pattern.description}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
