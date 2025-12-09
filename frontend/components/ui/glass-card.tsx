import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "primary";
  rounded?: "default" | "lg" | "xl" | "2xl" | "3xl" | "full";
  blur?: "sm" | "md" | "lg" | "xl";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", rounded = "3xl", blur = "sm", ...props }, ref) => {
    const glassCardVariants = cva(
      "rounded-3xl border-2 transition-all duration-300 shadow-lg",
      {
        variants: {
          variant: {
            default: "bg-card/40 backdrop-blur-xl border-primary/20 hover:border-primary/30 hover:shadow-xl",
            muted: "bg-muted/40 backdrop-blur-xl border-border/50 hover:border-border hover:shadow-xl",
            primary: "bg-primary/10 backdrop-blur-xl border-primary/30 hover:border-primary/50 hover:shadow-xl",
          },
          rounded: {
            default: "rounded-3xl",
            lg: "rounded-2xl",
            xl: "rounded-3xl",
            "2xl": "rounded-[2rem]",
            "3xl": "rounded-[2.5rem]",
            full: "rounded-full",
          },
          blur: {
            sm: "backdrop-blur-sm",
            md: "backdrop-blur-md",
            lg: "backdrop-blur-lg",
            xl: "backdrop-blur-2xl",
          },
        },
        defaultVariants: {
          variant: "default",
          rounded: "default",
          blur: "xl",
        },
      }
    );

    return (
      <div
        ref={ref}
        className={cn(glassCardVariants({ variant, rounded, blur }), className)}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
