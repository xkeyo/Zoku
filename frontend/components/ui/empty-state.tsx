import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <p className="text-muted-foreground mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
