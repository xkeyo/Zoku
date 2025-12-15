"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getWatchlist } from "@/api/watchlist";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WatchlistStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
}

export function WatchlistSummary() {
  const [watchlistData, setWatchlistData] = useState<WatchlistStockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchWatchlistData = async () => {
      try {
        const watchlist = await getWatchlist("My Watchlist");
        
        if (watchlist.items.length === 0) {
          if (isMounted) setLoading(false);
          return;
        }

        // Single batch API call for all watchlist symbols
        const symbols = watchlist.items.map(item => item.symbol);
        const response = await fetch(
          `http://localhost:8000/stocks/quotes/batch`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(symbols),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch watchlist quotes");
        }

        const quotes = await response.json();
        
        if (!isMounted) return;

        const validData: WatchlistStockData[] = quotes.map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.name,
          price: quote.current_price,
          change: quote.change,
          percentChange: quote.percent_change,
        }));

        setWatchlistData(validData);
      } catch (error) {
        console.error("Failed to fetch watchlist data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWatchlistData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchWatchlistData, 300000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            My Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (watchlistData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            My Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No stocks in your watchlist yet</p>
            <Button asChild>
              <Link href="/dashboard/trading">
                <BarChart3 className="h-4 w-4 mr-2" />
                Start Trading
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            My Watchlist
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {watchlistData.length} stocks
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Watchlist Stocks */}
        <div className="space-y-2">
          {watchlistData.slice(0, 8).map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${stock.price.toFixed(2)}</p>
                    <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard/trading">
            View Full Watchlist
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
