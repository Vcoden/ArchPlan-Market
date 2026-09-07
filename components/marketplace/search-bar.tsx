"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSeedSearchSuggestions } from "@/lib/data/query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({
  defaultValue = "",
  className,
  size = "lg",
}: {
  defaultValue?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const suggestions = useMemo(() => getSeedSearchSuggestions(value), [value]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/plans${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={submit} className={cn("relative w-full", className)}>
      <div className="flex items-center gap-2 rounded-xl border bg-card p-2 shadow-[var(--shadow)]">
        <Search className="ml-2 size-4 shrink-0 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search house plans, styles, bedrooms, or keywords..."
          className={cn("border-0 shadow-none focus-visible:ring-0", size === "lg" ? "h-12" : "h-10")}
          name="q"
        />
        <Button type="submit" size={size === "lg" ? "lg" : "default"}>
          Search
        </Button>
      </div>
      {suggestions.length > 0 ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-card shadow-[var(--shadow)]">
          {suggestions.map((item) => (
            <button
              key={item.slug}
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-secondary"
              onClick={() => router.push(`/plans/${item.slug}`)}
            >
              <span>{item.title}</span>
              <span className="capitalize text-muted-foreground">{item.style}</span>
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
