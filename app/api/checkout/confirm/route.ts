import { NextResponse } from "next/server";
import { findPlan, updateStore } from "@/lib/data/store";
import { getPaymentProvider } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    const { reference, orderId } = (await request.json()) as {
      reference?: string;
      orderId?: string;
    };
    if (!reference || !orderId) {
      return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
    }

    const result = await getPaymentProvider().confirmPayment(reference);
    if (!result.success) {
      return NextResponse.json({ error: "Payment could not be confirmed." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase
        .from("orders")
        .update({ payment_status: "succeeded", order_status: "paid" })
        .eq("id", orderId);
      await supabase.from("transactions").update({ status: "succeeded" }).eq("order_id", orderId);
      return NextResponse.json({ ok: true });
    }

    await updateStore((store) => {
      const order = store.orders.find((item) => item.id === orderId);
      if (!order) throw new Error("Order not found.");
      order.payment_status = "succeeded";
      order.order_status = "paid";
      for (const item of order.items) {
        const plan = findPlan(store, item.plan_id);
        if (plan) {
          plan.sales_count += 1;
          const architect = store.architects.find((entry) => entry.id === plan.architect_id);
          if (architect) architect.sales_count = (architect.sales_count ?? 0) + 1;
          for (const file of plan.files ?? []) {
            const already = store.downloads.some(
              (download) =>
                download.order_id === order.id && download.file_id === file.id && download.buyer_id === order.buyer_id,
            );
            if (!already) {
              store.downloads.push({
                id: crypto.randomUUID(),
                buyer_id: order.buyer_id,
                plan_id: plan.id,
                order_id: order.id,
                file_id: file.id,
                downloaded_at: new Date().toISOString(),
                file_name: file.file_name,
                plan_title: plan.title,
              });
            }
          }
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
