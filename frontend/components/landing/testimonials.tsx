"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Day Trader",
      content: "Zoku's pattern detection has completely changed my trading game. I've caught breakouts I would have missed before. The alerts are incredibly accurate.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Swing Trader",
      content: "The AI-powered insights are phenomenal. It's like having a professional analyst watching my watchlist 24/7. Worth every penny.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "Options Trader",
      content: "Best pattern recognition tool I've used. The backtesting feature helped me validate my strategies before risking real capital.",
      rating: 5,
      avatar: "EW",
    },
    {
      name: "David Kim",
      role: "Long-term Investor",
      content: "Even as a long-term investor, Zoku helps me find optimal entry points. The success rate statistics give me confidence in my trades.",
      rating: 5,
      avatar: "DK",
    },
    {
      name: "Jessica Martinez",
      role: "Crypto Trader",
      content: "Multi-market scanning is a game changer. I can track stocks and crypto patterns in one place. The mobile alerts are instant.",
      rating: 5,
      avatar: "JM",
    },
    {
      name: "Robert Taylor",
      role: "Professional Trader",
      content: "The most comprehensive pattern recognition platform I've found. API access lets me integrate it into my automated trading system.",
      rating: 5,
      avatar: "RT",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Thousands of Traders
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our community has to say about their trading success with Zoku.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/60 rounded-3xl backdrop-blur-xl bg-card/40 shadow-lg"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                  <p className="text-muted-foreground relative z-10 pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Avatar className="w-10 h-10 border-2 border-primary/30 backdrop-blur-sm">
                    <AvatarFallback className="bg-primary/10 backdrop-blur-xl text-primary font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["SC", "MR", "EW", "DK"].map((initials, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-background">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span>Join 10,000+ traders using Zoku</span>
          </div>
        </div>
      </div>
    </section>
  );
}
