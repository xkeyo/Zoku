"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TrendingUp, TrendingDown, Bell, Target, Activity, Plus, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { WatchlistSummary, MarketMoversWidget, StockNews } from "@/components/dashboard";
import { getWatchlist } from "@/api/watchlist";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const watchlist = await getWatchlist("My Watchlist");
        setWatchlistCount(watchlist.count);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Stocks Tracked",
      value: loading ? "..." : watchlistCount.toString(),
      change: watchlistCount > 0 ? `+${watchlistCount}` : "0",
      icon: BarChart3,
      trend: "up" as const,
    },
    {
      title: "Market Status",
      value: "Live",
      change: "Real-time",
      icon: Activity,
      trend: "up" as const,
    },
    {
      title: "Trading Tools",
      value: "Active",
      change: "Ready",
      icon: Target,
      trend: "up" as const,
    },
    {
      title: "AI Insights",
      value: "Beta",
      change: "Coming Soon",
      icon: Sparkles,
      trend: "up" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your stocks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl bg-card/40 border-2 border-primary/20 hover:border-primary/40 rounded-3xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 backdrop-blur-xl flex items-center justify-center border-2 border-primary/30 shadow-md">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Watchlist Summary */}
          <WatchlistSummary />
          
          {/* Live Trading Card */}
          <Card className="backdrop-blur-xl bg-card/40 border-2 border-primary/20 rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Live Trading</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                View real-time stock charts, prices, and market data powered by TradingView.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-2xl font-bold">{watchlistCount}</div>
                  <div className="text-sm text-muted-foreground">In Watchlist</div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-2xl font-bold">Live</div>
                  <div className="text-sm text-muted-foreground">Real-time Data</div>
                </div>
              </div>
              <Button asChild className="w-full rounded-full">
                <Link href="/dashboard/trading">
                  Open Trading Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Market News */}
          <StockNews />
        </div>
      </div>

      {/* Market Movers - Full Width */}
      <MarketMoversWidget />
      </div>
    </DashboardLayout>
  );
}
