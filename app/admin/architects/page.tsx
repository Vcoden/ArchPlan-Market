import { RowAction } from "@/components/admin/row-actions";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { redirect } from "next/navigation";

export default async function AdminArchitectsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Architects</h1>
      <p className="mt-2 text-muted-foreground">Approve or reject seller applications before they can publish.</p>
      <div className="mt-8 space-y-4">
        {store.architects.map((architect) => (
          <div key={architect.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
            <div>
              <p className="font-medium">{architect.professional_name}</p>
              <p className="text-sm text-muted-foreground">
                {architect.location} · {architect.approval_status}
              </p>
            </div>
            <div className="flex gap-2">
              <RowAction action="/api/admin/architects" body={{ id: architect.id, status: "approved" }} label="Approve" />
              <RowAction
                action="/api/admin/architects"
                body={{ id: architect.id, status: "rejected" }}
                label="Reject"
                variant="destructive"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
