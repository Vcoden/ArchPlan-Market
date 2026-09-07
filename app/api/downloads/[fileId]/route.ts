import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { readStore, updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPlanFileSignedUrl } from "@/lib/storage/signed-url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  const profile = await getSessionAccount();
  if (!profile) {
    return NextResponse.json({ error: "Sign in to download purchased files." }, { status: 401 });
  }

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: file } = await supabase
        .from("plan_files")
        .select("id, file_path, plan_id, file_name")
        .eq("id", fileId)
        .maybeSingle();
      if (!file) {
        return NextResponse.json({ error: "You don't have permission to access this file." }, { status: 403 });
      }
      const { data: purchase } = await supabase
        .from("order_items")
        .select("order_id, orders!inner(buyer_id, payment_status)")
        .eq("plan_id", file.plan_id)
        .eq("orders.buyer_id", profile.id)
        .eq("orders.payment_status", "succeeded")
        .maybeSingle();
      if (!purchase) {
        return NextResponse.json({ error: "You don't have permission to access this file." }, { status: 403 });
      }
      const url = await createPlanFileSignedUrl(file.file_path);
      await supabase.from("downloads").insert({
        buyer_id: profile.id,
        plan_id: file.plan_id,
        order_id: purchase.order_id,
        file_id: file.id,
      });
      return NextResponse.redirect(url);
    } catch {
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  const store = await readStore();
  const plan = store.plans.find((item) => item.files?.some((file) => file.id === fileId));
  const file = plan?.files?.find((item) => item.id === fileId);
  if (!plan || !file) {
    return NextResponse.json({ error: "You don't have permission to access this file." }, { status: 403 });
  }

  const purchase = store.orders.find(
    (order) =>
      order.buyer_id === profile.id &&
      order.payment_status === "succeeded" &&
      order.items.some((item) => item.plan_id === plan.id),
  );
  if (!purchase) {
    return NextResponse.json({ error: "You don't have permission to access this file." }, { status: 403 });
  }

  await updateStore((next) => {
    next.downloads.unshift({
      id: crypto.randomUUID(),
      buyer_id: profile.id,
      plan_id: plan.id,
      order_id: purchase.id,
      file_id: file.id,
      downloaded_at: new Date().toISOString(),
      file_name: file.file_name,
      plan_title: plan.title,
    });
  });

  const body = [
    `ArchPlan Market licensed file`,
    `Plan: ${plan.title}`,
    `File: ${file.file_name}`,
    `Buyer: ${profile.email ?? profile.full_name}`,
    `Order: ${purchase.id}`,
    ``,
    `This is the purchased digital package placeholder for local development.`,
    `When Supabase Storage is connected, the original CAD/PDF file is streamed from a signed URL.`,
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file.file_name.replace(/\.[^.]+$/, "")}.txt"`,
    },
  });
}
