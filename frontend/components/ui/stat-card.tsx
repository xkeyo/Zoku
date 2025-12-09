import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  value: string | number | ReactNode;
  description?: string;
  icon?: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: "",
  primary: "border-l-4 border-l-primary",
  success: "border-l-4 border-l-green-500",
  warning: "border-l-4 border-l-yellow-500",
  danger: "border-l-4 border-l-red-500",
};

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = "default",
  className = ""
}: StatCardProps) {
  return (
    <Card className={`${variantStyles[variant]} ${className}`}>
      <CardHeader className="pb-3">
        {description && <CardDescription>{description}</CardDescription>}
        <CardTitle className="text-2xl flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {value}
        </CardTitle>
        {title && <p className="text-sm text-muted-foreground">{title}</p>}
      </CardHeader>
    </Card>
  );
}

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | ReactNode;
  className?: string;
}

export function InfoCard({ icon: Icon, label, value, className = "" }: InfoCardProps) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${className}`}>
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}
