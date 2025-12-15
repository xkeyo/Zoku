"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp, Bell, LineChart } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-xl px-4 py-2 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 border-2 border-primary/30 shadow-lg">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Real-Time Stock Market Data
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Spot Chart Patterns
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Before They Break Out
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Track stocks, identify emerging patterns, and get instant alerts when
            technical setups form. Never miss a trading opportunity again.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full backdrop-blur-sm bg-background/50"
              onClick={() => {
                document.querySelector("#product")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-in fade-in duration-700 delay-500">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                <LineChart className="w-4 h-4 text-primary" />
              </div>
              <span>Real-Time Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <span>Instant Alerts</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span>Pattern Detection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/30 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
