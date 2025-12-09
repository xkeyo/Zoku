"use client";

import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Glass Card */}
          <div className="relative backdrop-blur-2xl bg-card/30 border-2 border-primary/30 rounded-3xl p-12 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
            {/* Logo */}
            <div className="relative w-60 h-32 mx-auto mb-8">
              <Image
                src="/zoku-logo.png"
                alt="Zoku"
                fill
                className="object-contain"
              />
            </div>
            
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                404
              </h1>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                <Search className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* Message */}
            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  <Home className="mr-2 w-5 h-5" />
                  Go Home
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 backdrop-blur-sm bg-background/50"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Go Back
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-muted-foreground">
            Need help? Contact our{" "}
            <Link href="/support" className="text-primary hover:underline">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
