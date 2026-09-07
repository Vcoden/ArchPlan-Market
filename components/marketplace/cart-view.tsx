"use client";

import Link from "next/link";
import { CoverImage } from "@/components/marketplace/cover-image";
import { EmptyState } from "@/components/marketplace/empty-state";
import { PriceDisplay } from "@/components/marketplace/price-display";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { getPlanImage } from "@/lib/data/query";
import { formatCurrency } from "@/lib/utils";
import type { Plan } from "@/types";

export function CartView({ catalog }: { catalog: Plan[] }) {
  const { ids, remove } = useCart();
  const items = catalog.filter((plan) => ids.includes(plan.id));
  const subtotal = items.reduce((sum, plan) => sum + plan.price, 0);

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty."
        description="Browse the marketplace and add a house plan when you are ready."
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        {items.map((plan) => (
          <div key={plan.id} className="flex gap-4 rounded-xl border bg-card p-4">
            <div className="relative size-24 overflow-hidden rounded-lg">
              <CoverImage src={getPlanImage(plan)} alt={plan.title} sizes="96px" />
            </div>
            <div className="flex flex-1 flex-col">
              <Link href={`/plans/${plan.slug}`} className="font-display text-2xl">
                {plan.title}
              </Link>
              <p className="text-sm text-muted-foreground">{plan.architect?.professional_name}</p>
              <div className="mt-auto flex items-center justify-between">
                <PriceDisplay amount={plan.price} size="sm" />
                <Button variant="ghost" onClick={() => remove(plan.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-xl border bg-card p-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-3 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <Button asChild className="mt-6 w-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
