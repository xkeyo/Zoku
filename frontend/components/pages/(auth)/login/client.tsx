"use client";

import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass";
import { LoginForm } from "./login-form";

interface LoginPageProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => void;
  loading?: boolean;
}

export function LoginPage({ onSubmit, onGoogleLogin, loading = false }: LoginPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 shadow-2xl border-2 border-primary/30" blur="xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="relative w-60 h-32 mx-auto">
              <Image
                src="/zoku-logo.png"
                alt="Zoku"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
              </p>
            </div>
          </div>

          {/* Form */}
          <LoginForm
            onSubmit={onSubmit}
            onGoogleLogin={onGoogleLogin}
            loading={loading}
          />

          {/* Footer */}
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
