"use client";

import { TrendingUp, Users, Zap, Target } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Traders",
      description: "Trust Zoku daily",
    },
    {
      icon: Zap,
      value: "1.8M+",
      label: "Patterns Detected",
      description: "This month alone",
    },
    {
      icon: TrendingUp,
      value: "87%",
      label: "Success Rate",
      description: "Pattern accuracy",
    },
    {
      icon: Target,
      value: "24/7",
      label: "Market Monitoring",
      description: "Never miss a setup",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Trusted by Traders{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a growing community of successful traders using AI to gain an edge in the markets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />
              <div className="relative bg-card/40 backdrop-blur-2xl border-2 border-primary/20 rounded-3xl p-8 text-center space-y-4 hover:border-primary/40 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 border-2 border-primary/30 shadow-lg">
                  <stat.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-lg font-semibold mt-2">{stat.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Social Proof */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-12 opacity-60">
          <div className="text-center">
            <p className="text-2xl font-bold">4.9/5</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold">500K+</p>
            <p className="text-sm text-muted-foreground">Alerts Sent</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold">20+</p>
            <p className="text-sm text-muted-foreground">Pattern Types</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
