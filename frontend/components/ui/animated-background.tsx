import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "vibrant";
}

const AnimatedBackground = React.forwardRef<HTMLDivElement, AnimatedBackgroundProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      ),
      subtle: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-primary/5" />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        </>
      ),
      vibrant: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-pulse delay-500" />
        </>
      ),
    };

    return (
      <div ref={ref} className={cn("absolute inset-0 -z-10", className)} {...props}>
        {variants[variant]}
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";

export { AnimatedBackground };
