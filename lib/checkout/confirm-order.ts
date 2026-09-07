import { findPlan, updateStore } from "@/lib/data/store";
import { getPaymentProvider } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function confirmLocalOrder(orderId: string, reference: string) {
  const result = await getPaymentProvider().confirmPayment(reference);
  if (!result.success) return;

  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase
      .from("orders")
      .update({ payment_status: "succeeded", order_status: "paid" })
      .eq("id", orderId);
    await supabase.from("transactions").update({ status: "succeeded" }).eq("order_id", orderId);
    return;
  }

  await updateStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);
    if (!order || order.payment_status === "succeeded") return;
    order.payment_status = "succeeded";
    order.order_status = "paid";
    for (const item of order.items) {
      const plan = findPlan(store, item.plan_id);
      if (!plan) continue;
      plan.sales_count += 1;
      const architect = store.architects.find((entry) => entry.id === plan.architect_id);
      if (architect) architect.sales_count = (architect.sales_count ?? 0) + 1;
    }
  });
}
