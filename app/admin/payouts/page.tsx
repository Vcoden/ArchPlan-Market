import { RowAction } from "@/components/admin/row-actions";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminPayoutsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Payouts</h1>
      <div className="mt-8 space-y-4">
        {store.payouts.length ? (
          store.payouts.map((payout) => {
            const architect = store.architects.find((item) => item.id === payout.architect_id);
            return (
              <div key={payout.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
                <div>
                  <p className="font-medium">{architect?.professional_name ?? "Architect"}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(payout.amount)} · {payout.status} · {new Date(payout.requested_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <RowAction action="/api/admin/payouts" body={{ id: payout.id, status: "completed" }} label="Mark processed" />
                  <RowAction action="/api/admin/payouts" body={{ id: payout.id, status: "rejected" }} label="Reject" variant="destructive" />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No payout requests yet.</p>
        )}
      </div>
    </div>
  );
}
