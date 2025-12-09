"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { user } = useAuth();

  // If no user, don't apply dashboard layout (for landing page)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        "md:pt-4 md:pr-4 md:pb-4",
        isCollapsed ? "md:pl-28" : "md:pl-80",
        "pt-20 px-4 pb-4"
      )}
    >
      <div className="w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
