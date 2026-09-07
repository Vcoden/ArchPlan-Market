"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardSidebar({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block whitespace-nowrap rounded-md px-3 py-2 text-sm",
              active ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
