"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CTASection() {
  const benefits = [
    "7-day free trial on all paid plans",
    "No credit card required to start",
    "Cancel anytime, no questions asked",
    "24/7 customer support",
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative backdrop-blur-2xl bg-card/30 border-2 border-primary/30 rounded-3xl p-12 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Transform Your Trading?
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of traders who are already using AI to spot patterns and make smarter trading decisions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all group">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-full backdrop-blur-sm bg-background/50"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Trusted by 10,000+ traders • 4.9/5 rating • 99.9% uptime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
