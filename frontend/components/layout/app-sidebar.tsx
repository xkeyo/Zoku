"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HomeIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/icons";
import { 
  TrendingUp, 
  LineChart, 
  Target, 
  Bell as BellLucide, 
  Scan, 
  BarChart3,
  BookOpen,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: HomeIcon },
      { title: "Market Scanner", href: "/scanner", icon: Scan },
    ],
    collapsible: false,
  },
  {
    title: "Trading",
    items: [
      { title: "Stocks", href: "/stocks", icon: TrendingUp },
      { title: "Watchlists", href: "/watchlists", icon: Target },
      { title: "Charts", href: "/charts", icon: LineChart },
    ],
    collapsible: true,
    defaultOpen: true,
  },
  {
    title: "Alerts & Analysis",
    items: [
      { title: "Alerts", href: "/alerts", icon: BellLucide, badge: "3" },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Backtesting", href: "/backtesting", icon: ChartBarIcon },
    ],
    collapsible: true,
    defaultOpen: true,
  },
  {
    title: "Learn",
    items: [
      { title: "Education", href: "/education", icon: BookOpen },
      { title: "Pattern Library", href: "/pattern-library", icon: Zap },
    ],
    collapsible: true,
    defaultOpen: false,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    navSections.reduce((acc, section) => {
      acc[section.title] = section.defaultOpen ?? true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  if (!user) return null;

  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        suppressHydrationWarning
        className={cn(
          "fixed z-50 transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:left-4 md:top-4 md:bottom-4 md:h-[calc(100vh-2rem)] md:rounded-2xl md:border md:shadow-2xl md:backdrop-blur-xl md:bg-card/95",
          "left-0 top-0 bottom-0 h-screen bg-card border-r md:border-r-0"
        )}
      >
          {/* Logo Section */}
          <div className="flex h-20 items-center justify-between flex-shrink-0 border-b border-border/50" style={{ padding: isCollapsed ? "0 0.75rem" : "0 3.25rem" }}>
            <div className="flex items-center gap-3">
              {isCollapsed ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-xl flex-shrink-0">
                  <Image
                    src="/zoku-logo-icon.png"
                    alt="Zoku"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="relative h-32 w-40">
                  <Image
                    src="/zoku-logo.png"
                    alt="Zoku"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            {/* Desktop Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="hidden md:flex h-8 w-8 hover:bg-accent/50"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="py-4 space-y-2" style={{ padding: isCollapsed ? "1rem 0.5rem" : "1rem 1rem" }}>
              {navSections.map((section, sectionIdx) => {
                const isOpen = openSections[section.title];
                
                return (
                  <div key={sectionIdx} className="space-y-1">
                    {/* Section Header */}
                    {!isCollapsed ? (
                      section.collapsible ? (
                        <button
                          onClick={() => toggleSection(section.title)}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors rounded-lg hover:bg-accent/30"
                        >
                          <span>{section.title}</span>
                          {isOpen ? (
                            <ChevronUpIcon className="h-3 w-3 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="h-3 w-3 flex-shrink-0" />
                          )}
                        </button>
                      ) : (
                        <h3 className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {section.title}
                        </h3>
                      )
                    ) : (
                      sectionIdx > 0 && <div className="h-px bg-border/50 my-2 mx-2" />
                    )}
                    
                    {/* Section Items */}
                    {(!section.collapsible || isOpen || isCollapsed) && (
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "group flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                isCollapsed ? "justify-center p-2.5 mx-auto" : "gap-3 px-3 py-2.5"
                              )}
                              title={isCollapsed ? item.title : undefined}
                            >
                              <item.icon className={cn(
                                "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                isActive && "drop-shadow-sm"
                              )} />
                              {!isCollapsed && (
                                <span className="flex-1 truncate">{item.title}</span>
                              )}
                              {!isCollapsed && item.badge && (
                                <span className="ml-auto flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="flex-shrink-0 border-t border-border/50" style={{ padding: isCollapsed ? "0.75rem 0.5rem" : "0.75rem 1rem" }}>
            {/* User Info - Only when expanded */}
            {!isCollapsed && (
              <Link href="/profile" className="block mb-3">
                <div className="flex items-center gap-3 rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-3 hover:shadow-md transition-all cursor-pointer group">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Icon-only Action Buttons */}
            <div className={cn(
              "flex items-center",
              isCollapsed ? "flex-col gap-2" : "gap-2 justify-between"
            )}>
              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-10 w-10 hover:bg-accent/50 rounded-xl"
                title="Settings"
              >
                <Link href="/dashboard/settings">
                  <SettingsIcon className="h-5 w-5" />
                </Link>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 hover:bg-accent/50 rounded-xl"
                title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              >
                <div className="relative h-5 w-5">
                  <SunIcon className="h-5 w-5 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="h-5 w-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                title="Logout"
              >
                <LogoutIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden backdrop-blur-xl bg-card/40 border-2 border-primary/30 shadow-lg hover:shadow-xl rounded-full"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}
