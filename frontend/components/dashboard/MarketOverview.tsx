"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);

  // Popular stocks to track
  const popularSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];

  useEffect(() => {
    let isMounted = true;

    const fetchMarketData = async () => {
      try {
        // Single batch API call for all symbols
        const response = await fetch(
          `http://localhost:8000/stocks/quotes/batch`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(popularSymbols),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const quotes = await response.json();
        
        if (!isMounted) return;

        const marketStocks: MarketStock[] = quotes.map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.name,
          price: quote.current_price,
          change: quote.change,
          percentChange: quote.percent_change,
        }));

        setMarketData(marketStocks);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMarketData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 300000);
    
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
            <Activity className="h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.map((stock) => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={stock.symbol}
                className="p-4 rounded-lg border bg-card hover:bg-muted transition-all cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{stock.symbol}</span>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
