"use client";

import { useEffect } from "react";
import { LandingNavbar } from "./navbar";
import { HeroSection } from "./hero";
import { ProductSection, FeaturesSection } from "./features";
import { HowItWorksSection } from "./how-it-works";
import { StatsSection } from "./stats";
import { TestimonialsSection } from "./testimonials";
import { PricingSection } from "./pricing";
import { CTASection } from "./cta";
import { SupportSection } from "./support";
import { LandingFooter } from "./footer";

export function LandingPage() {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProductSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <SupportSection />
      </main>
      <LandingFooter />
    </div>
  );
}
