import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassBadgeVariants = cva(
  "inline-flex items-center font-medium transition-all duration-300 border-2 backdrop-blur-xl shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary/10 border-primary/30 text-primary",
        secondary: "bg-secondary/10 border-secondary/30 text-secondary-foreground",
        muted: "bg-muted/50 border-muted-foreground/50 text-muted-foreground",
        success: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
        warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
        destructive: "bg-destructive/10 border-destructive/30 text-destructive",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
      rounded: {
        default: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "full",
    },
  }
);

export interface GlassBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBadgeVariants> {}

function GlassBadge({ className, variant, size, rounded, ...props }: GlassBadgeProps) {
  return (
    <div
      className={cn(glassBadgeVariants({ variant, size, rounded }), className)}
      {...props}
    />
  );
}

export { GlassBadge, glassBadgeVariants };
