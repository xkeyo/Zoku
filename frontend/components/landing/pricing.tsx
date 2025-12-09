"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, DollarSign } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "Track up to 10 stocks",
        "Basic pattern detection",
        "Email alerts",
        "Daily market summary",
        "Community support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "29",
      description: "For serious traders and investors",
      features: [
        "Unlimited stock tracking",
        "20+ pattern types detected",
        "Real-time push notifications",
        "Advanced charting tools",
        "Backtesting & analytics",
        "Priority support",
        "Custom watchlists",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "99",
      description: "Maximum power for professional traders",
      features: [
        "Everything in Pro",
        "AI-powered predictions",
        "Multi-market scanning",
        "API access",
        "Custom alerts & webhooks",
        "Advanced risk analytics",
        "24/7 priority support",
        "Early access to features",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your business. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-2xl transition-all duration-300 rounded-3xl backdrop-blur-xl bg-card/40 shadow-lg ${
                plan.popular
                  ? "border-2 border-primary shadow-2xl scale-105 md:scale-110"
                  : "border-2 border-primary/20 hover:border-primary/40 hover:-translate-y-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium px-4 py-1 rounded-full shadow-xl backdrop-blur-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  {plan.price === "Custom" ? (
                    <span className="text-4xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button
                    className="w-full rounded-full"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          All paid plans include a 7-day free trial. Cancel anytime, no questions asked.
        </p>
      </div>
    </section>
  );
}
