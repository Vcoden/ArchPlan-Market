import Link from "next/link";
import { EmptyState } from "@/components/marketplace/empty-state";
import { DataTable } from "@/components/dashboard/data-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { buyerOrders, readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default async function OrdersPage() {
  const profile = await getCurrentProfile();
  const store = await readStore();
  const orders = profile ? buyerOrders(store, profile.id) : [];

  return (
    <div>
      <h1 className="font-display text-4xl">My Orders</h1>
      <div className="mt-8">
        {orders.length ? (
          <DataTable
            columns={["Order", "Plans", "Total", "Status", "Date"]}
            rows={orders.map((order) => [
              order.id.slice(0, 8),
              order.items.map((item) => item.plan_title ?? "House plan").join(", "),
              formatCurrency(order.total),
              order.payment_status,
              new Date(order.created_at).toLocaleDateString(),
            ])}
          />
        ) : (
          <EmptyState
            title="Your purchased plans will appear here."
            description="Completed checkouts show plan, price, and download access."
          />
        )}
      </div>
      {orders.length ? (
        <p className="mt-4 text-sm">
          <Link href="/dashboard/downloads" className="underline">
            Open downloads
          </Link>
        </p>
      ) : null}
    </div>
  );
}
