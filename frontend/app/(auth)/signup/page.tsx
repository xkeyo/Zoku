"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SignupPage } from "@/components/pages/(auth)/signup/client";

export default function Signup() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    setLoading(true);
    try {
      await register(data);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/google/login`;
  };

  return (
    <SignupPage
      onSubmit={handleSubmit}
      onGoogleSignup={handleGoogleSignup}
      loading={loading}
    />
  );
}
