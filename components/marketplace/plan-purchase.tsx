"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import type { Plan } from "@/types";

export function PlanPurchase({ plan }: { plan: Plan }) {
  const router = useRouter();
  const cart = useCart();
  const favorites = useFavorites();

  return (
    <div className="grid gap-3">
      <Button
        size="lg"
        onClick={() => {
          cart.add(plan.id);
          toast.success("Plan added to cart.");
          router.push("/cart");
        }}
      >
        Buy This Plan
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => {
          favorites.toggle(plan.id);
          toast.success(favorites.has(plan.id) ? "Removed from favorites." : "Saved to favorites.");
        }}
      >
        <Heart className={favorites.has(plan.id) ? "fill-accent text-accent" : ""} />
        Add to Favorites
      </Button>
    </div>
  );
}
