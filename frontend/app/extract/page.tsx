"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExtractPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/extract-premium");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  );
}
