"use client";

import { EmptyState } from "@/components/marketplace/empty-state";
import { PlanGrid } from "@/components/marketplace/plan-grid";
import { useFavorites } from "@/hooks/use-favorites";
import type { Plan } from "@/types";

export function FavoritesView({ catalog }: { catalog: Plan[] }) {
  const { ids } = useFavorites();
  const plans = catalog.filter((plan) => ids.includes(plan.id));

  if (!plans.length) {
    return (
      <EmptyState
        title="You haven't saved any house plans yet."
        description="Tap the heart on a listing to keep it here."
        actionLabel="Explore Plans"
      />
    );
  }

  return <PlanGrid plans={plans} />;
}
