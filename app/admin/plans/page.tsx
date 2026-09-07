import { RowAction } from "@/components/admin/row-actions";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminPlansPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Plan review</h1>
      <p className="mt-2 text-muted-foreground">
        Approve, reject, request changes, feature, or suspend listings. Suspended plans stay attached to historical orders.
      </p>
      <div className="mt-8 space-y-4">
        {store.plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{plan.title}</p>
                <p className="text-sm text-muted-foreground">
                  {plan.architect?.professional_name} · {plan.status} · {formatCurrency(plan.price)}
                  {plan.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <RowAction method="PATCH" action={`/api/plans/${plan.id}`} body={{ status: "published" }} label="Approve" />
                <RowAction method="PATCH" action={`/api/plans/${plan.id}`} body={{ status: "rejected" }} label="Reject" />
                <RowAction method="PATCH" action={`/api/plans/${plan.id}`} body={{ status: "draft", review_notes: "Please revise and resubmit." }} label="Request changes" />
                <RowAction method="PATCH" action={`/api/plans/${plan.id}`} body={{ featured: !plan.featured }} label={plan.featured ? "Unfeature" : "Feature"} />
                <RowAction method="PATCH" action={`/api/plans/${plan.id}`} body={{ status: "suspended" }} label="Suspend" variant="destructive" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
