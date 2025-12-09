import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingState({ message, size = "md" }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && <span className="ml-3 text-lg">{message}</span>}
    </div>
  );
}

export function LoadingCard({ message }: { message?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && <span className="ml-3 text-lg">{message}</span>}
      </CardContent>
    </Card>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return <Loader2 className={`${sizeClasses[size]} animate-spin`} />;
}
