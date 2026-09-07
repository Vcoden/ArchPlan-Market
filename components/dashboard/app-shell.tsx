"use client";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const buyer = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "My Orders" },
  { href: "/dashboard/downloads", label: "Downloads" },
  { href: "/dashboard/favorites", label: "Favorites" },
  { href: "/dashboard/reviews", label: "Reviews" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/architect", label: "Seller dashboard" },
];

const seller = [
  { href: "/dashboard/architect", label: "Overview" },
  { href: "/dashboard/architect/plans", label: "My Plans" },
  { href: "/dashboard/architect/plans/new", label: "Add New Plan" },
  { href: "/dashboard/architect/orders", label: "Orders" },
  { href: "/dashboard/architect/earnings", label: "Earnings" },
  { href: "/dashboard/architect/payouts", label: "Payouts" },
  { href: "/dashboard/architect/reviews", label: "Reviews" },
  { href: "/dashboard/architect/profile", label: "Profile" },
  { href: "/dashboard/architect/settings", label: "Settings" },
];

const admin = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/architects", label: "Architects" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const items = pathname.startsWith("/admin")
    ? admin
    : pathname.startsWith("/dashboard/architect")
      ? seller
      : buyer;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <DashboardSidebar items={items} />
        <div>{children}</div>
      </div>
    </div>
  );
}
