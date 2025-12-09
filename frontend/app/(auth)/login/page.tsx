"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/components/pages/(auth)/login/client";

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/google/login`;
  };

  return (
    <LoginPage
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      loading={loading}
    />
  );
}
