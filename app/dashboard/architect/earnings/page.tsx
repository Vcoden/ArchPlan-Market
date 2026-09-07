import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { getCurrentArchitect } from "@/lib/auth/session";
import { architectEarnings, architectOrders, getCommissionPercent, readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default async function EarningsPage() {
  const architect = await getCurrentArchitect();
  const store = await readStore();
  const stats = architect ? architectEarnings(store, architect.id) : { lifetime: 0, available: 0, sales: 0 };
  const items = architect
    ? architectOrders(store, architect.id)
        .filter((order) => order.payment_status === "succeeded")
        .flatMap((order) => order.items.filter((item) => item.architect_id === architect.id))
    : [];

  return (
    <div>
      <h1 className="font-display text-4xl">Earnings</h1>
      <p className="mt-2 text-muted-foreground">
        Commission is stored on each order item. The current default rate is {getCommissionPercent(store)}%.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Lifetime earnings" value={formatCurrency(stats.lifetime)} />
        <StatCard
          label="Platform commission withheld"
          value={formatCurrency(items.reduce((sum, item) => sum + item.platform_commission, 0))}
        />
        <StatCard label="Available balance" value={formatCurrency(stats.available)} />
      </div>
      <div className="mt-8">
        <DataTable
          columns={["Plan", "Price", "Commission", "Your earnings"]}
          rows={items.map((item) => [
            item.plan_title ?? "House plan",
            formatCurrency(item.price),
            `${item.commission_percentage}% / ${formatCurrency(item.platform_commission)}`,
            formatCurrency(item.architect_earnings),
          ])}
        />
      </div>
    </div>
  );
}
