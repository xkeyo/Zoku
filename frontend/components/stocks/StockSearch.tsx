"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StockResult {
  symbol: string;
  description: string;
  type: string;
  exchange?: string;
}

interface StockSearchProps {
  onSelectStock: (symbol: string, name?: string) => void;
  placeholder?: string;
  className?: string;
}

export function StockSearch({
  onSelectStock,
  placeholder = "Search any stock (e.g., AAPL, TSLA)...",
  className = "",
}: StockSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockResult[]>([]);
  const [uniqueResults, setUniqueResults] = useState<StockResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setUniqueResults([]);
      return;
    }

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/stocks/search?query=${encodeURIComponent(query)}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Deduplicate by symbol
          const seen = new Set<string>();
          const unique = data.filter((stock: StockResult) => {
            if (seen.has(stock.symbol)) {
              return false;
            }
            seen.add(stock.symbol);
            return true;
          });
          setResults(unique);
          setUniqueResults(unique);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelect = (symbol: string, description: string) => {
    setSelectedStock(`${symbol} - ${description}`);
    setQuery("");
    setOpen(false);
    onSelectStock(symbol);
  };

  const handleClear = () => {
    setSelectedStock("");
    setQuery("");
    onSelectStock("AAPL"); // Default to Apple
  };

  return (
    <div className={`relative ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={selectedStock || placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              className="pl-10 pr-10 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
            />
            {selectedStock && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[400px] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              {loading && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Searching all stocks...
                </div>
              )}
              {!loading && results.length === 0 && query.length > 0 && (
                <CommandEmpty>No stocks found. Try a different search.</CommandEmpty>
              )}
              {!loading && results.length === 0 && query.length === 0 && (
                <div className="py-6 px-4 text-sm text-muted-foreground">
                  <div className="font-medium mb-2">Search any US stock</div>
                  <div className="text-xs">
                    Try: AAPL, TSLA, NVDA, MSFT, GOOGL, or any ticker symbol
                  </div>
                </div>
              )}
              {results.length > 0 && (
                <CommandGroup heading="Search Results">
                  {uniqueResults.map((stock, index) => (
                    <CommandItem
                      key={`${stock.symbol}-${index}`}
                      value={stock.symbol}
                      onSelect={() =>
                        handleSelect(stock.symbol, stock.description)
                      }
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className="font-semibold">{stock.symbol}</span>
                          <span className="text-xs text-muted-foreground">
                            {stock.description}
                          </span>
                        </div>
                        {stock.exchange && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {stock.exchange}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
