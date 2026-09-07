import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminOverviewPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();
  const paid = store.orders.filter((order) => order.payment_status === "succeeded");
  const gross = paid.reduce((sum, order) => sum + order.total, 0);
  const revenue = paid.reduce((sum, order) => sum + order.platform_commission, 0);
  const pendingPayouts = store.payouts
    .filter((payout) => payout.status === "pending")
    .reduce((sum, payout) => sum + payout.amount, 0);
  const top = [...store.plans].sort((a, b) => b.sales_count - a.sales_count).slice(0, 5);
  const salesSeries = paid.reduce<Record<string, number>>((acc, order) => {
    const key = new Date(order.created_at).toLocaleString("en-US", { month: "short" });
    acc[key] = (acc[key] ?? 0) + order.total;
    return acc;
  }, {});
  const userSeries = store.accounts.reduce<Record<string, number>>((acc, account) => {
    const key = new Date(account.created_at).toLocaleString("en-US", { month: "short" });
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-4xl">Marketplace overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={String(store.accounts.length)} />
        <StatCard label="Total architects" value={String(store.architects.length)} />
        <StatCard label="Published plans" value={String(store.plans.filter((plan) => plan.status === "published").length)} />
        <StatCard label="Total orders" value={String(store.orders.length)} />
        <StatCard label="Gross sales" value={formatCurrency(gross)} />
        <StatCard label="Platform revenue" value={formatCurrency(revenue)} />
        <StatCard label="Pending payouts" value={formatCurrency(pendingPayouts)} />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-2xl">Sales over time</h2>
          <SalesChart data={Object.entries(salesSeries).map(([date, value]) => ({ date, value }))} />
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl">New users</h2>
          <SalesChart data={Object.entries(userSeries).map(([date, value]) => ({ date, value }))} />
        </div>
      </div>
      <div className="mt-10">
        <h2 className="mb-4 font-display text-2xl">Top-selling plans</h2>
        <DataTable
          columns={["Plan", "Architect", "Sales", "Revenue"]}
          rows={top.map((plan) => [
            plan.title,
            plan.architect?.professional_name ?? "",
            plan.sales_count,
            formatCurrency(plan.price * plan.sales_count),
          ])}
        />
      </div>
    </div>
  );
}
