import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassIconContainerVariants = cva(
  "flex items-center justify-center transition-all duration-300 border-2 shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-primary/10 backdrop-blur-xl border-primary/30 text-primary",
        muted: "bg-muted/50 backdrop-blur-xl border-border/50 text-muted-foreground",
        success: "bg-green-500/10 backdrop-blur-xl border-green-500/30 text-green-500",
        warning: "bg-yellow-500/10 backdrop-blur-xl border-yellow-500/30 text-yellow-500",
        destructive: "bg-red-500/10 backdrop-blur-xl border-red-500/30 text-red-500",
      },
      size: {
        sm: "w-8 h-8 [&_svg]:w-4 [&_svg]:h-4",
        default: "w-10 h-10 [&_svg]:w-5 [&_svg]:h-5",
        lg: "w-12 h-12 [&_svg]:w-6 [&_svg]:h-6",
        xl: "w-16 h-16 [&_svg]:w-8 [&_svg]:h-8",
        "2xl": "w-24 h-24 [&_svg]:w-12 [&_svg]:h-12",
      },
      rounded: {
        default: "rounded-lg",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
      hover: {
        none: "",
        scale: "hover:scale-110",
        lift: "hover:-translate-y-1",
        both: "hover:scale-110 hover:-translate-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "2xl",
      hover: "scale",
    },
  }
);

export interface GlassIconContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassIconContainerVariants> {}

const GlassIconContainer = React.forwardRef<HTMLDivElement, GlassIconContainerProps>(
  ({ className, variant, size, rounded, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassIconContainerVariants({ variant, size, rounded, hover }),
          className
        )}
        {...props}
      />
    );
  }
);

GlassIconContainer.displayName = "GlassIconContainer";

export { GlassIconContainer, glassIconContainerVariants };
