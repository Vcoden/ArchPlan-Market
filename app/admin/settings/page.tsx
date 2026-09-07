import { JsonForm } from "@/components/forms/json-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl">Settings</h1>
      <div className="mt-8">
        <JsonForm action="/api/admin/settings" success="Commission updated. Existing orders are unchanged.">
          <div>
            <Label htmlFor="commission">Default marketplace commission (%)</Label>
            <Input
              id="commission"
              name="commission"
              type="number"
              defaultValue={store.settings.platform_commission}
              className="mt-2"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Changing this rate does not rewrite historical orders.
            </p>
          </div>
        </JsonForm>
      </div>
    </div>
  );
}
