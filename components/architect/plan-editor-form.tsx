"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ARCHITECTURAL_STYLES, DEFAULT_INCLUDED_ITEMS, PLAN_FILE_TYPES, PROPERTY_TYPES } from "@/lib/constants";
import { seedCategories } from "@/lib/data/seed";

export function PlanEditorForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      const response = await fetch("/api/plans", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to save plan.");
      toast.success(payload.status === "draft" ? "Draft saved." : "Plan submitted for review.");
      router.push("/dashboard/architect/plans");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="grid gap-10">
      <section className="grid gap-4">
        <h2 className="font-display text-2xl">Basic information</h2>
        <Field name="title" label="Plan name" required />
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required minLength={40} className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select id="categoryId" name="categoryId" className="mt-2 h-11 w-full rounded-md border bg-card px-3">
              {seedCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="architecturalStyle">Architectural style</Label>
            <select id="architecturalStyle" name="architecturalStyle" className="mt-2 h-11 w-full rounded-md border bg-card px-3">
              {ARCHITECTURAL_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="propertyType">Property type</Label>
            <select id="propertyType" name="propertyType" className="mt-2 h-11 w-full rounded-md border bg-card px-3">
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <Field name="price" label="Price" type="number" required />
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-2xl">Specifications</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="bedrooms" label="Bedrooms" type="number" required />
          <Field name="bathrooms" label="Bathrooms" type="number" required />
          <Field name="floors" label="Floors" type="number" required />
          <Field name="floorArea" label="Total floor area" type="number" required />
          <Field name="lotWidth" label="Lot width" type="number" />
          <Field name="lotDepth" label="Lot depth" type="number" />
          <Field name="garageSpaces" label="Garage spaces" type="number" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Living room", "Dining room", "Kitchen", "Office", "Laundry", "Balcony", "Basement", "Pool"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="amenities" value={item} defaultChecked={["Living room", "Dining room", "Kitchen", "Laundry"].includes(item)} />
              {item}
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-2xl">Media</h2>
        <FileField name="mainImage" label="Main image" />
        <FileField name="gallery" label="Gallery images" multiple />
        <FileField name="floorPlans" label="Floor plan images" multiple />
        <FileField name="exterior" label="Exterior render" />
        <FileField name="interior" label="Interior render" />
      </section>

      <section className="grid gap-4">
        <h2 className="font-display text-2xl">Digital files</h2>
        <p className="text-sm text-muted-foreground">
          These remain private. Buyers receive signed download links only after payment.
        </p>
        <FileField name="planFiles" label="PDF, DWG, DXF, SKP, RVT, or ZIP" multiple accept=".pdf,.dwg,.dxf,.skp,.rvt,.zip" />
        <div>
          <Label>File formats included</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {PLAN_FILE_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="fileFormats" value={type.value} />
                {type.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="includedItems">What&apos;s included</Label>
          <Textarea
            id="includedItems"
            name="includedItems"
            className="mt-2"
            defaultValue={DEFAULT_INCLUDED_ITEMS.join("\n")}
          />
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" name="intent" value="submit" disabled={pending}>
          Submit for review
        </Button>
        <Button type="submit" name="intent" value="draft" variant="outline" disabled={pending}>
          Save draft
        </Button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} className="mt-2" />
    </div>
  );
}

function FileField({
  name,
  label,
  multiple,
  accept = "image/*",
}: {
  name: string;
  label: string;
  multiple?: boolean;
  accept?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="file" multiple={multiple} accept={accept} className="mt-2" />
    </div>
  );
}
