"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface WatchlistItemProps {
  symbol: string;
  name: string;
  onSelect: () => void;
  onRemove: () => void;
}

interface QuoteData {
  current_price: number;
  change: number;
  percent_change: number;
}

export function WatchlistItem({ symbol, name, onSelect, onRemove }: WatchlistItemProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/stocks/quote/${symbol}`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setQuote({
            current_price: data.current_price,
            change: data.change,
            percent_change: data.percent_change,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
    // Refresh every 60 seconds
    const interval = setInterval(fetchQuote, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  const isPositive = quote ? quote.change >= 0 : false;

  return (
    <div
      className="group p-3 rounded-lg border bg-card hover:bg-muted transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-base font-bold truncate">{symbol}</p>
            <BarChart3 className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground truncate mb-2">{name}</p>
          
          {loading ? (
            <div className="h-6 w-20 bg-muted animate-pulse rounded" />
          ) : quote ? (
            <div className="space-y-1">
              <div className="text-lg font-bold">
                ${quote.current_price.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.percent_change.toFixed(2)}%)
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">Price unavailable</div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
