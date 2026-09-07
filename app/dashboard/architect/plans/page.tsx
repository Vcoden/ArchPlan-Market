import Link from "next/link";
import { DataTable } from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/marketplace/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentArchitect } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default async function ArchitectPlansPage() {
  const architect = await getCurrentArchitect();
  const store = await readStore();
  const plans = architect ? store.plans.filter((plan) => plan.architect_id === architect.id) : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">My Plans</h1>
        <Button asChild>
          <Link href="/dashboard/architect/plans/new">Add New Plan</Link>
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground">
        Status moves from draft → pending review → published. Only published plans appear in the marketplace.
      </p>
      <div className="mt-8">
        {plans.length ? (
          <DataTable
            columns={["Plan", "Status", "Price", "Sales", "Rating"]}
            rows={plans.map((plan) => [
              plan.title,
              plan.status,
              formatCurrency(plan.price),
              plan.sales_count,
              `${plan.average_rating} (${plan.review_count})`,
            ])}
          />
        ) : (
          <EmptyState
            title="You haven't published any plans yet."
            actionLabel="Add New Plan"
            actionHref="/dashboard/architect/plans/new"
          />
        )}
      </div>
      <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
        <Badge>draft</Badge>
        <Badge>pending_review</Badge>
        <Badge variant="accent">published</Badge>
        <Badge>rejected</Badge>
      </div>
    </div>
  );
}
