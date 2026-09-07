import { DataTable } from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/marketplace/empty-state";
import { getCurrentArchitect } from "@/lib/auth/session";
import { architectOrders, readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default async function ArchitectOrdersPage() {
  const architect = await getCurrentArchitect();
  const store = await readStore();
  const orders = architect ? architectOrders(store, architect.id) : [];

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-2 text-muted-foreground">Sales of your published plans.</p>
      <div className="mt-8">
        {orders.length ? (
          <DataTable
            columns={["Order", "Plan", "Amount", "Your earnings", "Status"]}
            rows={orders.flatMap((order) =>
              order.items
                .filter((item) => item.architect_id === architect?.id)
                .map((item) => [
                  order.id.slice(0, 8),
                  item.plan_title ?? "House plan",
                  formatCurrency(item.price),
                  formatCurrency(item.architect_earnings),
                  order.payment_status,
                ]),
            )}
          />
        ) : (
          <EmptyState title="No seller orders yet." actionHref="/dashboard/architect/plans/new" actionLabel="Add a plan" />
        )}
      </div>
    </div>
  );
}
