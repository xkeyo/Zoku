"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockPrice, StockSearch, StockStatistics } from "@/components/stocks";
import { WatchlistItem } from "@/components/stocks";
import { TradingViewChart } from "@/components/trading";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TrendingUp, BarChart3, Activity, Sparkles, Star, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWatchlist, addToWatchlist, removeFromWatchlist, checkInWatchlist, WatchlistItem as WatchlistItemType } from "@/api/watchlist";

export default function TradingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedName, setSelectedName] = useState("Apple Inc.");
  const [resolution, setResolution] = useState("D");
  const [watchlist, setWatchlist] = useState<WatchlistItemType[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  // Check if current symbol is in watchlist
  useEffect(() => {
    checkWatchlistStatus();
  }, [selectedSymbol]);

  const loadWatchlist = async () => {
    try {
      const data = await getWatchlist("My Watchlist");
      setWatchlist(data.items);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const inWatchlist = await checkInWatchlist(selectedSymbol, "My Watchlist");
      setIsInWatchlist(inWatchlist);
    } catch (error) {
      console.error("Failed to check watchlist:", error);
    }
  };

  const handleAddToWatchlist = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await addToWatchlist(selectedSymbol, selectedName, "My Watchlist");
      setIsInWatchlist(true);
      await loadWatchlist();
      setSuccessMessage(`${selectedSymbol} added to watchlist!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Failed to add to watchlist:", error);
      setError(error.message || "Failed to add to watchlist");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await removeFromWatchlist(selectedSymbol, "My Watchlist");
      setIsInWatchlist(false);
      await loadWatchlist();
      setSuccessMessage(`${selectedSymbol} removed from watchlist`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Failed to remove from watchlist:", error);
      setError(error.message || "Failed to remove from watchlist");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (symbol: string, name?: string) => {
    setSelectedSymbol(symbol);
    if (name) setSelectedName(name);
  };

  const handleTimeframeChange = (value: string) => {
    setResolution(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-foreground">
            <BarChart3 className="h-5 w-5 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Live Trading
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground"></span>
              </span>
              Real-time data • {watchlist.length} tracked
            </p>
          </div>
        </div>
        <div className="w-64">
          <StockSearch
            onSelectStock={handleStockSelect}
            placeholder="Search stocks..."
          />
        </div>
      </div>

      {/* Main Grid - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100vh-12rem)]">
        {/* Left Column - Chart (50% width) */}
        <div className="flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{selectedSymbol}</CardTitle>
                    <p className="text-xs text-muted-foreground">{selectedName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs value={resolution} onValueChange={handleTimeframeChange}>
                    <TabsList className="h-8">
                      <TabsTrigger value="D" className="text-xs h-7">D</TabsTrigger>
                      <TabsTrigger value="W" className="text-xs h-7">W</TabsTrigger>
                      <TabsTrigger value="M" className="text-xs h-7">M</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button
                    variant={isInWatchlist ? "default" : "outline"}
                    size="sm"
                    onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                    disabled={loading}
                    className="h-8 gap-1.5"
                  >
                    <Star className={`h-3.5 w-3.5 ${isInWatchlist ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 flex-1">
              <div className="w-full h-full rounded-lg overflow-hidden border">
                <TradingViewChart
                  symbol={`NASDAQ:${selectedSymbol}`}
                  interval={resolution}
                  height={600}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Price & Watchlist (50% width) */}
        <div className="flex flex-col gap-3 overflow-hidden">
          {/* Error/Success Messages */}
          {(error || successMessage) && (
            <div className={`p-3 rounded-lg text-sm ${
              error 
                ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                : 'bg-green-500/10 text-green-600 border border-green-500/20'
            }`}>
              {error || successMessage}
            </div>
          )}

          {/* Watchlist - Scrollable - Takes more space */}
          <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
            <CardHeader className="pb-2 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                  <CardTitle className="text-sm font-semibold">Watchlist</CardTitle>
                  <span className="text-xs text-muted-foreground">({watchlist.length})</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 flex-1 overflow-y-auto">
              {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Star className="h-8 w-8 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-xs text-muted-foreground">No stocks yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {watchlist.map((stock) => (
                    <WatchlistItem
                      key={stock.id}
                      symbol={stock.symbol}
                      name={stock.name}
                      onSelect={() => {
                        setSelectedSymbol(stock.symbol);
                        setSelectedName(stock.name);
                      }}
                      onRemove={() => {
                        removeFromWatchlist(stock.symbol, "My Watchlist").then(() => loadWatchlist());
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics Section - Full Width Below */}
      <div className="mt-3">
        <StockStatistics symbol={selectedSymbol} />
      </div>
      </div>
    </DashboardLayout>
  );
}
