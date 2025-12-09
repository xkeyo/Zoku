import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SectionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  text: string;
}

const SectionBadge = React.forwardRef<HTMLDivElement, SectionBadgeProps>(
  ({ className, icon: Icon, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20",
          className
        )}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <span className="text-sm font-medium text-primary">{text}</span>
      </div>
    );
  }
);

SectionBadge.displayName = "SectionBadge";

export { SectionBadge };
