"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StockPatternsWidget } from "@/components/dashboard/stock-patterns-widget";
import { TrendingUp, TrendingDown, Bell, Target, LineChart, Scan, Activity, Plus } from "lucide-react";

export default function DashboardPage() {
  const watchlists = [
    { name: "Tech Stocks", count: 12, change: "+5.2%" },
    { name: "Breakout Candidates", count: 8, change: "+3.8%" },
    { name: "Swing Trades", count: 15, change: "-1.2%" },
  ];

  const recentPatterns = [
    {
      stock: "AAPL",
      pattern: "Bull Flag",
      timeframe: "1D",
      confidence: 92,
      status: "forming",
    },
    {
      stock: "TSLA",
      pattern: "Ascending Triangle",
      timeframe: "4H",
      confidence: 87,
      status: "confirmed",
    },
    {
      stock: "NVDA",
      pattern: "Cup & Handle",
      timeframe: "1D",
      confidence: 94,
      status: "breakout",
    },
    {
      stock: "MSFT",
      pattern: "Double Bottom",
      timeframe: "1W",
      confidence: 89,
      status: "forming",
    },
  ];

  const alerts = [
    {
      stock: "AAPL",
      message: "Bull Flag pattern confirmed",
      time: "5 min ago",
      type: "pattern",
    },
    {
      stock: "TSLA",
      message: "Breakout above $250 resistance",
      time: "12 min ago",
      type: "breakout",
    },
    {
      stock: "NVDA",
      message: "High volume detected",
      time: "1 hour ago",
      type: "volume",
    },
  ];

  const stats = [
    {
      title: "Patterns Detected",
      value: "1,847",
      change: "+12%",
      icon: Scan,
      trend: "up",
    },
    {
      title: "Active Alerts",
      value: "342",
      change: "+8%",
      icon: Bell,
      trend: "up",
    },
    {
      title: "Success Rate",
      value: "87%",
      change: "+3%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Watchlist Stocks",
      value: "35",
      change: "+5",
      icon: Target,
      trend: "up",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your stocks.
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Stock
        </Button>
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
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Stock Patterns */}
        <StockPatternsWidget />

        {/* Recent Alerts */}
        <Card className="backdrop-blur-xl bg-card/40 border-2 border-primary/20 rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Recent Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{alert.stock}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                  {index < alerts.length - 1 && <div className="border-b pt-4" />}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-full">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Watchlists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>My Watchlists</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchlists.map((watchlist, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl backdrop-blur-xl bg-card/30 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <h3 className="font-semibold mb-2">{watchlist.name}</h3>
                <p className="text-2xl font-bold mb-1">{watchlist.count} stocks</p>
                <div className="flex items-center space-x-1">
                  {watchlist.change.startsWith("+") ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      watchlist.change.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {watchlist.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
