'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  analyzePatterns, 
  getStockQuote,
  searchStocks,
  formatPrice,
  formatConfidence,
  getPatternColor,
  getConfidenceLevel,
  type PatternAnalysisResponse,
  type StockQuote,
  type StockSymbol
} from '@/api/stocks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, BarChart3 } from 'lucide-react';
import { StockChart } from '@/components/charts/stock-chart';
import { PriceGrid } from '@/components/ui/price-display';
import { LoadingCard, LoadingSpinner } from '@/components/ui/loading-state';
import { ErrorCard } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Dynamically import TradingView to avoid SSR issues
const TradingViewChart = dynamic(
  () => import('@/components/charts/tradingview-chart'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[500px]"><LoadingSpinner size="lg" /></div> }
);

export default function StocksPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSymbol[]>([]);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [analysis, setAnalysis] = useState<PatternAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  async function loadStockData() {
    setLoading(true);
    setError(null);
    
    try {
      const [quoteResult, analysisResult] = await Promise.allSettled([
        getStockQuote(symbol),
        analyzePatterns(symbol, 'D', 180)
      ]);
      
      if (quoteResult.status === 'fulfilled') {
        setQuote(quoteResult.value);
      } else {
        console.error('Failed to load quote:', quoteResult.reason);
      }
      
      if (analysisResult.status === 'fulfilled') {
        setAnalysis(analysisResult.value);
      } else {
        console.error('Failed to load analysis:', analysisResult.reason);
        setError(analysisResult.reason instanceof Error ? analysisResult.reason.message : 'Failed to load pattern analysis');
      }
      
      if (quoteResult.status === 'rejected' && analysisResult.status === 'rejected') {
        setError('Failed to load stock data. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }

  function selectStock(stockSymbol: string) {
    setSymbol(stockSymbol);
    setSearchQuery('');
    setSearchResults([]);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Pattern Recognition</h1>
          <p className="text-muted-foreground">Real-time chart pattern analysis</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by company name or ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => selectStock(result.symbol)}
                >
                  <div className="font-semibold">{result.symbol}</div>
                  <div className="text-sm text-muted-foreground">{result.description}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {loading && !quote && <LoadingCard message={`Loading ${symbol} data...`} />}

      {error && <ErrorCard message={error} />}

      {quote && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{symbol}</CardTitle>
                <CardDescription>Real-time Quote</CardDescription>
              </div>
              <Button variant="outline" onClick={loadStockData} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PriceGrid
              currentPrice={quote.current_price}
              change={quote.change}
              percentChange={quote.percent_change}
              high={quote.high}
              low={quote.low}
              open={quote.open}
              previousClose={quote.previous_close}
            />
          </CardContent>
        </Card>
      )}

      {symbol && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Price Chart</CardTitle>
              </div>
            </div>
            <CardDescription>Interactive stock price visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recharts" className="w-full">
              <TabsList>
                <TabsTrigger value="recharts">Simple Chart</TabsTrigger>
                <TabsTrigger value="tradingview">TradingView</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recharts" className="mt-4">
                <StockChart symbol={symbol} resolution="D" daysBack={180} />
              </TabsContent>
              
              <TabsContent value="tradingview" className="mt-4">
                <TradingViewChart symbol={symbol} interval="D" theme="light" height={500} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Pattern Analysis</CardTitle>
            <CardDescription>
              Detected {analysis.patterns_found.length} patterns from {analysis.data_points} data points
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.patterns_found.length === 0 ? (
              <EmptyState message="No significant patterns detected. Try a different stock or time period." />
            ) : (
              <div className="space-y-4">
                {analysis.patterns_found.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getPatternColor(pattern.direction)}>
                            {pattern.direction}
                          </Badge>
                          <Badge variant="outline">{pattern.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="text-xl font-bold">{formatConfidence(pattern.confidence)}</div>
                        <div className="text-xs text-muted-foreground">
                          {getConfidenceLevel(pattern.confidence)}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Start:</span>
                        <span className="ml-2 font-medium">
                          {new Date(pattern.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End:</span>
                        <span className="ml-2 font-medium">
                          {new Date(pattern.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      {pattern.target_price && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Target Price:</span>
                          <span className="ml-2 font-medium text-lg">
                            {formatPrice(pattern.target_price)}
                          </span>
                        </div>
                      )}
                    </div>

                    {pattern.key_levels && Object.keys(pattern.key_levels).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm font-medium mb-2">Key Levels</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(pattern.key_levels).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="ml-2 font-medium">
                                {typeof value === 'number' ? formatPrice(value) : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Popular Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'].map((s) => (
              <Button
                key={s}
                variant={symbol === s ? 'default' : 'outline'}
                onClick={() => setSymbol(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
