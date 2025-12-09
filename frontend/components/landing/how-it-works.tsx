"use client";

import { Target, Bell, TrendingUp, Zap } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Target,
      title: "Add Your Stocks",
      description: "Create custom watchlists and add the stocks you want to track. Import from your broker or build from scratch.",
    },
    {
      number: "02",
      icon: Zap,
      title: "AI Scans for Patterns",
      description: "Our AI continuously monitors your watchlist, detecting chart patterns in real-time across multiple timeframes.",
    },
    {
      number: "03",
      icon: Bell,
      title: "Get Instant Alerts",
      description: "Receive push notifications the moment a pattern forms or a breakout occurs. Never miss an opportunity.",
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Trade with Confidence",
      description: "Review pattern statistics, success rates, and AI insights to make informed trading decisions.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Start Trading Smarter in{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get up and running in minutes. No complex setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 backdrop-blur-sm" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Number Badge */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-xl flex items-center justify-center border-2 border-primary/30 relative z-10 shadow-lg">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xl backdrop-blur-sm">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
            <p className="text-lg font-semibold">Ready to get started?</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Join thousands of traders who are already spotting patterns and making smarter trades with Zoku.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>1,847 patterns detected today</span>
              </div>
              <span>•</span>
              <span>87% success rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
