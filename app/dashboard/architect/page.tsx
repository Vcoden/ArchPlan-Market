import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getCurrentArchitect } from "@/lib/auth/session";
import { architectEarnings, architectOrders, readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default async function ArchitectOverviewPage() {
  const architect = await getCurrentArchitect();
  const store = await readStore();
  const stats = architect
    ? architectEarnings(store, architect.id)
    : { lifetime: 0, available: 0, sales: 0 };
  const plans = architect ? store.plans.filter((plan) => plan.architect_id === architect.id) : [];
  const sellerOrders = architect ? architectOrders(store, architect.id) : [];
  const pending = sellerOrders.filter((order) => order.payment_status === "pending").length;
  const series = sellerOrders
    .filter((order) => order.payment_status === "succeeded")
    .reduce<Record<string, number>>((acc, order) => {
      const key = new Date(order.created_at).toLocaleString("en-US", { month: "short" });
      acc[key] =
        (acc[key] ?? 0) +
        order.items
          .filter((item) => item.architect_id === architect?.id)
          .reduce((sum, item) => sum + item.architect_earnings, 0);
      return acc;
    }, {});
  const chart = Object.entries(series).map(([date, value]) => ({ date, value }));

  return (
    <div>
      <h1 className="font-display text-4xl">Seller overview</h1>
      <p className="mt-2 text-muted-foreground">
        {architect
          ? `Application status: ${architect.approval_status.replace("_", " ")}.`
          : "Submit an architect application to start selling."}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Sales" value={String(stats.sales)} />
        <StatCard label="Total Earnings" value={formatCurrency(stats.lifetime)} />
        <StatCard label="Available Balance" value={formatCurrency(stats.available)} />
        <StatCard label="Published Plans" value={String(plans.filter((plan) => plan.status === "published").length)} />
        <StatCard label="Pending Orders" value={String(pending)} />
      </div>
      <div className="mt-10">
        <h2 className="mb-4 font-display text-2xl">Sales</h2>
        <SalesChart data={chart.length ? chart : [{ date: "—", value: 0 }]} />
      </div>
    </div>
  );
}
