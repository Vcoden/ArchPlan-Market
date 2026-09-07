import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { findPlan, getCommissionPercent, readStore, updateStore, type StoredOrder } from "@/lib/data/store";
import { getPaymentProvider } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { absoluteUrl, calculateCommission } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { planIds, email } = (await request.json()) as { planIds?: string[]; email?: string };
    if (!planIds?.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const profile = await getSessionAccount();
    if (!profile) {
      return NextResponse.json({ error: "Sign in to complete checkout." }, { status: 401 });
    }

    const store = await readStore();
    const commissionPercent = getCommissionPercent(store);
    const plans = planIds
      .map((id) => findPlan(store, id))
      .filter((plan): plan is NonNullable<typeof plan> => Boolean(plan && plan.status === "published"));

    if (!plans.length) {
      return NextResponse.json({ error: "Those house plans are no longer available." }, { status: 400 });
    }

    const items = plans.map((plan) => {
      const split = calculateCommission(plan.price, commissionPercent);
      return {
        id: crypto.randomUUID(),
        order_id: "",
        plan_id: plan.id,
        architect_id: plan.architect_id,
        price: plan.price,
        commission_percentage: commissionPercent,
        platform_commission: split.platformCommission,
        architect_earnings: split.architectEarnings,
        plan_title: plan.title,
        architect_name: plan.architect?.professional_name ?? "Architect",
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const platformCommission = items.reduce((sum, item) => sum + item.platform_commission, 0);
    const architectEarnings = items.reduce((sum, item) => sum + item.architect_earnings, 0);
    const orderId = crypto.randomUUID();
    items.forEach((item) => {
      item.order_id = orderId;
    });

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.from("orders").insert({
        id: orderId,
        buyer_id: profile.id,
        subtotal,
        commission_percentage: commissionPercent,
        platform_commission: platformCommission,
        architect_earnings: architectEarnings,
        payment_fee: 0,
        total: subtotal,
        payment_status: "pending",
        order_status: "pending",
      });
      if (error) return NextResponse.json({ error: "Unable to create the order." }, { status: 400 });
      await supabase.from("order_items").insert(
        items.map(({ plan_title: _t, architect_name: _n, ...item }) => item),
      );
    } else {
      const order: StoredOrder = {
        id: orderId,
        buyer_id: profile.id,
        buyer_email: email || profile.email || "",
        subtotal,
        commission_percentage: commissionPercent,
        platform_commission: platformCommission,
        architect_earnings: architectEarnings,
        payment_fee: 0,
        total: subtotal,
        currency: "USD",
        payment_status: "pending",
        order_status: "pending",
        created_at: new Date().toISOString(),
        items,
      };
      await updateStore((next) => {
        next.orders.push(order);
      });
    }

    const provider = getPaymentProvider();
    const session = await provider.createCheckout({
      orderId,
      buyerId: profile.id,
      buyerEmail: email || profile.email || "",
      amount: subtotal,
      currency: "USD",
      items: plans.map((plan) => ({
        planId: plan.id,
        title: plan.title,
        architectName: plan.architect?.professional_name ?? "Architect",
        price: plan.price,
      })),
      successUrl: absoluteUrl(`/checkout/success?order=${orderId}`),
      cancelUrl: absoluteUrl("/checkout"),
    });

    return NextResponse.json({ orderId, checkoutUrl: session.checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
