"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PriceDisplay } from "@/components/marketplace/price-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { brand } from "@/lib/brand";
import { calculateCommission, formatCurrency } from "@/lib/utils";
import type { Plan } from "@/types";

export function CheckoutView({ catalog }: { catalog: Plan[] }) {
  const router = useRouter();
  const { ids, clear } = useCart();
  const items = catalog.filter((plan) => ids.includes(plan.id));
  const subtotal = items.reduce((sum, plan) => sum + plan.price, 0);
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");

  async function pay() {
    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planIds: items.map((plan) => plan.id), email }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Checkout failed.");
      clear();
      router.push(payload.checkoutUrl ?? `/checkout/success?order=${payload.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (!items.length) {
    return <p className="mt-8 text-muted-foreground">Your cart is empty.</p>;
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
      <section className="rounded-xl border bg-card p-6">
        <h2 className="font-display text-3xl">Payment</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Payment is routed through a provider abstraction. The current environment uses the
          development provider and can later switch to Stripe, Paystack, or Flutterwave.
        </p>
        <div className="mt-6 grid gap-4">
          <div>
            <Label htmlFor="email">Email for receipts</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button size="lg" onClick={pay} disabled={pending}>
            {pending ? "Processing..." : `Pay ${formatCurrency(subtotal)}`}
          </Button>
        </div>
      </section>
      <aside className="h-fit rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-4">
          {items.map((plan) => {
            const split = calculateCommission(plan.price, brand.defaultCommissionPercent);
            return (
              <li key={plan.id} className="border-b pb-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span>{plan.title}</span>
                  <PriceDisplay amount={plan.price} size="sm" />
                </div>
                <p className="mt-1 text-muted-foreground">{plan.architect?.professional_name} · Qty 1</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Platform {brand.defaultCommissionPercent}% ({formatCurrency(split.platformCommission)}) ·
                  Architect {formatCurrency(split.architectEarnings)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
