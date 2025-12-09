"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass";
import { SpinnerIcon, ArrowLeftIcon } from "@/components/icons";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement forgot password API call
      // await forgotPassword({ email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-8 shadow-2xl border-2 border-primary/30" blur="xl">
          <div className="space-y-6 text-center">
            <div className="relative w-60 h-32 mx-auto">
              <Image
                src="/zoku-logo.png"
                alt="Zoku"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 backdrop-blur-xl flex items-center justify-center border-2 border-primary/30 shadow-lg">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-full backdrop-blur-sm bg-background/50"
                onClick={() => setSent(false)}
              >
                Try another email
              </Button>
              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full rounded-full">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8" blur="xl">
        <div className="space-y-6">
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
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email and we'll send you a link to reset your password
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? (
                <>
                  <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full rounded-full">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
