"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  current_price: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  timestamp: number;
}

interface StockPriceProps {
  symbol: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function StockPrice({ symbol, autoRefresh = false, refreshInterval = 60000 }: StockPriceProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:8000/stocks/quote/${symbol}`,
        { credentials: "include" }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchQuote();
    }
  }, [symbol]);

  useEffect(() => {
    if (autoRefresh && symbol) {
      const interval = setInterval(fetchQuote, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [symbol, autoRefresh, refreshInterval]);

  if (loading && !quote) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !quote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error || "No data available"}</p>
          <Button onClick={fetchQuote} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl sm:text-2xl truncate">{quote.symbol}</CardTitle>
            <CardDescription className="text-xs sm:text-sm truncate">{quote.name}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchQuote}
            disabled={loading}
            className="flex-shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Current Price */}
        <div className="space-y-2">
          <div className="text-3xl sm:text-4xl font-bold">
            ${quote.current_price.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 text-base sm:text-lg">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            ) : (
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.percent_change.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Open</div>
            <div className="text-base sm:text-lg font-semibold">${quote.open.toFixed(2)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Prev Close</div>
            <div className="text-base sm:text-lg font-semibold">${quote.previous_close.toFixed(2)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Day High</div>
            <div className="text-base sm:text-lg font-semibold">${quote.high.toFixed(2)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-muted-foreground">Day Low</div>
            <div className="text-base sm:text-lg font-semibold">${quote.low.toFixed(2)}</div>
          </div>
        </div>

        {/* Exchange Info */}
        <div className="pt-3 sm:pt-4 border-t text-xs sm:text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
            <span className="truncate">Exchange: {quote.exchange}</span>
            <span className="text-xs">Updated: {new Date(quote.timestamp * 1000).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
