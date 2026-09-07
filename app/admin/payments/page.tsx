import { DataTable } from "@/components/dashboard/data-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminPaymentsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Payments</h1>
      <p className="mt-2 text-muted-foreground">Provider-agnostic transaction log.</p>
      <div className="mt-8">
        <DataTable
          columns={["Reference", "Provider", "Amount", "Status"]}
          rows={store.orders.map((order) => [
            `mock_${order.id}`,
            "mock",
            formatCurrency(order.total),
            order.payment_status,
          ])}
        />
      </div>
    </div>
  );
}
