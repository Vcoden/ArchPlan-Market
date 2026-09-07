import { DataTable } from "@/components/dashboard/data-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <div className="mt-8">
        <DataTable
          columns={["Order", "Buyer", "Total", "Commission", "Architect earnings", "Status"]}
          rows={store.orders.map((order) => [
            order.id.slice(0, 8),
            order.buyer_email,
            formatCurrency(order.total),
            formatCurrency(order.platform_commission),
            formatCurrency(order.architect_earnings),
            order.payment_status,
          ])}
        />
      </div>
    </div>
  );
}
