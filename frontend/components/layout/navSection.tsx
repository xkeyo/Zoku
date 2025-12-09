"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/icons";
import { useState } from "react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
}

interface NavSectionProps {
  title?: string;
  items: NavItem[];
  className?: string;
}

export function NavSection({ title, items, className }: NavSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <h4 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {items.map((item, index) => (
          <NavItemComponent key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;

  const isActive = item.href ? pathname === item.href : false;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
        >
          <div className="flex items-center">
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span>{item.title}</span>
          </div>
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-4">
            {item.items?.map((subItem, subIndex) => (
              <NavItemComponent key={subIndex} item={subItem} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.href) {
    return (
      <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
        {item.title}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  );
}
