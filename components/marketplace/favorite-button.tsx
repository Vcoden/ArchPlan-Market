"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  planId,
  className,
}: {
  planId: string;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const active = has(planId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(planId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 backdrop-blur-sm transition-colors hover:bg-card",
        className,
      )}
    >
      <Heart className={cn("size-4", active && "fill-accent text-accent")} />
    </button>
  );
}
