import { DataTable } from "@/components/dashboard/data-table";
import { JsonForm } from "@/components/forms/json-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentArchitect } from "@/lib/auth/session";
import { architectEarnings, readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default async function PayoutsPage() {
  const architect = await getCurrentArchitect();
  const store = await readStore();
  const payouts = architect ? store.payouts.filter((item) => item.architect_id === architect.id) : [];
  const available = architect ? architectEarnings(store, architect.id).available : 0;

  return (
    <div>
      <h1 className="font-display text-4xl">Payouts</h1>
      <p className="mt-2 text-muted-foreground">Available balance: {formatCurrency(available)}</p>
      <div className="mt-8 max-w-md rounded-xl border bg-card p-6">
        <JsonForm action="/api/payouts" success="Payout requested." buttonLabel="Request payout">
          <div>
            <Label htmlFor="amount">Request withdrawal</Label>
            <Input id="amount" name="amount" type="number" min={50} placeholder="50" className="mt-2" />
          </div>
        </JsonForm>
      </div>
      <div className="mt-8">
        <DataTable
          columns={["Requested", "Amount", "Method", "Status"]}
          rows={payouts.map((payout) => [
            new Date(payout.requested_at).toLocaleDateString(),
            formatCurrency(payout.amount),
            payout.payout_method,
            payout.status,
          ])}
        />
      </div>
    </div>
  );
}
