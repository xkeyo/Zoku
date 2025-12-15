"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Flame, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface StockMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
}

export function MarketMovers() {
  const [gainers, setGainers] = useState<StockMover[]>([]);
  const [losers, setLosers] = useState<StockMover[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchMovers = async () => {
      try {
        // Single API call to get market movers
        const response = await fetch(
          `http://localhost:8000/stocks/market-movers`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch market movers");
        }

        const data = await response.json();
        
        if (!isMounted) return;

        // Map the data to our component format
        const mapToStockMover = (quote: any): StockMover => ({
          symbol: quote.symbol,
          name: quote.name,
          price: quote.current_price,
          change: quote.change,
          percentChange: quote.percent_change,
        });

        setGainers(data.gainers.map(mapToStockMover));
        setLosers(data.losers.map(mapToStockMover));
        setTotalAnalyzed(data.total_analyzed);
      } catch (error) {
        console.error("Failed to fetch market movers:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovers();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMovers, 300000);
    
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
            <Flame className="h-5 w-5" />
            Market Movers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const MoversList = ({ stocks, type }: { stocks: StockMover[], type: 'gainer' | 'loser' }) => (
    <div className="space-y-3">
      {stocks.map((stock, index) => {
        const isPositive = stock.change >= 0;
        return (
          <div
            key={stock.symbol}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{stock.symbol}</p>
                <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${stock.price.toFixed(2)}</p>
              <div className="flex items-center gap-1 justify-end">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <p className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Market Movers
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {totalAnalyzed > 0 ? `Analyzing ${totalAnalyzed} stocks across all sectors` : 'Loading market data...'}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="gap-2">
              <TrendingDown className="h-4 w-4" />
              Top Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="mt-4">
            {gainers.length > 0 ? (
              <MoversList stocks={gainers} type="gainer" />
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </TabsContent>
          <TabsContent value="losers" className="mt-4">
            {losers.length > 0 ? (
              <MoversList stocks={losers} type="loser" />
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
