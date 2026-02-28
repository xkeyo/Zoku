"use client";

import { useEffect } from "react";
import { LandingNavbar } from "./navbar";
import { HeroSection } from "./hero";
import { LandingFooter } from "./footer";

export function LandingPage() {
  useEffect(() => {
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
      </main>
      <LandingFooter />
    </div>
  );
}
