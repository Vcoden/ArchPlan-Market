"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ARCHITECTURAL_STYLES, PROPERTY_TYPES, SORT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => setParam(params, key, value));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="space-y-8">
      <div>
        <Label>Sort</Label>
        <select
          className="mt-2 h-11 w-full rounded-md border bg-card px-3 text-sm"
          defaultValue={searchParams.get("sort") ?? "popularity"}
          onChange={(event) => update({ sort: event.target.value })}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Architectural style</Label>
        <div className="mt-3 grid gap-2">
          {ARCHITECTURAL_STYLES.map((style) => (
            <label key={style.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                defaultChecked={searchParams.get("style") === style.value}
                onChange={(event) => update({ style: event.target.checked ? style.value : undefined })}
              />
              {style.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label>Property type</Label>
        <div className="mt-3 grid gap-2">
          {PROPERTY_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                defaultChecked={searchParams.get("type") === type.value}
                onChange={(event) => update({ type: event.target.checked ? type.value : undefined })}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            type="number"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(event) => update({ minPrice: event.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            type="number"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(event) => update({ maxPrice: event.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["beds", "Bedrooms"],
          ["baths", "Bathrooms"],
          ["floors", "Floors"],
        ].map(([key, label]) => (
          <div key={key}>
            <Label>{label}</Label>
            <Input
              type="number"
              defaultValue={searchParams.get(key) ?? ""}
              onBlur={(event) => update({ [key]: event.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min sq ft</Label>
          <Input
            type="number"
            defaultValue={searchParams.get("minArea") ?? ""}
            onBlur={(event) => update({ minArea: event.target.value })}
          />
        </div>
        <div>
          <Label>Max sq ft</Label>
          <Input
            type="number"
            defaultValue={searchParams.get("maxArea") ?? ""}
            onBlur={(event) => update({ maxArea: event.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Lot width</Label>
          <Input
            type="number"
            defaultValue={searchParams.get("lotWidth") ?? ""}
            onBlur={(event) => update({ lotWidth: event.target.value })}
          />
        </div>
        <div>
          <Label>Lot depth</Label>
          <Input
            type="number"
            defaultValue={searchParams.get("lotDepth") ?? ""}
            onBlur={(event) => update({ lotDepth: event.target.value })}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          defaultChecked={searchParams.get("garage") === "1"}
          onChange={(event) => update({ garage: event.target.checked ? "1" : undefined })}
        />
        Garage
      </label>
      <Button variant="outline" className="w-full" onClick={() => router.push(pathname)}>
        Clear filters
      </Button>
    </aside>
  );
}
