import { RowAction } from "@/components/admin/row-actions";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore, toProfile } from "@/lib/data/store";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Users</h1>
      <p className="mt-2 text-muted-foreground">Suspend accounts that violate marketplace rules.</p>
      <div className="mt-8 space-y-4">
        {store.accounts.map((account) => {
          const user = toProfile(account);
          return (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div>
                <p className="font-medium">{user.full_name || account.email}</p>
                <p className="text-sm text-muted-foreground">
                  {account.email} · {user.role} · {user.is_suspended ? "suspended" : "active"}
                </p>
              </div>
              {user.role !== "admin" ? (
                <RowAction
                  action="/api/admin/users"
                  body={{ id: user.id, suspended: !user.is_suspended }}
                  label={user.is_suspended ? "Restore" : "Suspend"}
                  variant={user.is_suspended ? "outline" : "destructive"}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
