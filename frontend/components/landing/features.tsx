"use client";

import {
  TrendingUp,
  Bell,
  LineChart,
  Target,
  Shield,
  Zap,
  Brain,
  Globe,
  CheckCircle2,
  Scan,
  BarChart3,
  Activity,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Scan,
      title: "Pattern Recognition",
      description:
        "AI automatically detects chart patterns like head & shoulders, triangles, flags, and more across all your tracked stocks.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get instant notifications when patterns form, breakouts occur, or key support/resistance levels are tested.",
    },
    {
      icon: LineChart,
      title: "Real-Time Charts",
      description:
        "Professional-grade charting with multiple timeframes, technical indicators, and drawing tools for deep analysis.",
    },
    {
      icon: Target,
      title: "Watchlist Management",
      description:
        "Organize stocks into custom watchlists and track multiple portfolios with real-time price updates and alerts.",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Machine learning analyzes historical patterns to predict potential breakouts and identify high-probability setups.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive statistics on pattern success rates, win/loss ratios, and detailed performance metrics for your trades.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Trade Smarter
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to help you identify opportunities, manage risk,
            and maximize your trading success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/60 rounded-3xl backdrop-blur-xl bg-card/40 shadow-lg"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 border-2 border-primary/30 shadow-lg">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSection() {
  const benefits = [
    "Detect 20+ chart patterns automatically in real-time",
    "Never miss a breakout with instant mobile alerts",
    "Backtest patterns to validate historical success rates",
    "Track unlimited stocks across multiple markets",
    "Access professional-grade charting and analysis tools",
    "Integrate with your favorite trading platforms",
  ];

  return (
    <section id="product" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Product</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Built for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Serious Traders
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Zoku combines advanced pattern recognition AI with professional charting
              tools to give you an edge in the markets. Whether you're a day trader or
              long-term investor, we help you spot opportunities faster.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-3xl" />
            <div className="relative bg-card/30 backdrop-blur-2xl border-2 border-primary/30 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/20 backdrop-blur-xl rounded-2xl border-2 border-primary/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border-2 border-primary/30 shadow-md">
                      <Scan className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Patterns Detected</p>
                      <p className="text-2xl font-bold">1,847</p>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm font-medium">Today</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 backdrop-blur-xl rounded-2xl border-2 border-primary/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border-2 border-primary/30 shadow-md">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Alerts</p>
                      <p className="text-2xl font-bold">342</p>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm font-medium">Live</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 backdrop-blur-xl rounded-2xl border-2 border-primary/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border-2 border-primary/30 shadow-md">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">87%</p>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm font-medium">+3%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
