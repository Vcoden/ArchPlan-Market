import { JsonForm } from "@/components/forms/json-form";
import { DataTable } from "@/components/dashboard/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { redirect } from "next/navigation";

export default async function AdminCategoriesPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Categories</h1>
      <div className="mt-8 max-w-xl rounded-xl border bg-card p-6">
        <JsonForm action="/api/admin/categories" success="Category added." buttonLabel="Add category">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" className="mt-2" />
          </div>
        </JsonForm>
      </div>
      <div className="mt-8">
        <DataTable
          columns={["Name", "Slug", "Description"]}
          rows={store.categories.map((category) => [category.name, category.slug, category.description ?? ""])}
        />
      </div>
    </div>
  );
}
