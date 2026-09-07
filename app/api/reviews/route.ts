import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { findPlan, getArchitectForUser, updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { reviewSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the review fields." }, { status: 400 });
    }

    const profile = await getSessionAccount();
    if (!profile) return NextResponse.json({ error: "Sign in to leave a review." }, { status: 401 });

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: purchased } = await supabase
        .from("order_items")
        .select("id, orders!inner(buyer_id, payment_status)")
        .eq("plan_id", parsed.data.planId)
        .eq("orders.buyer_id", profile.id)
        .eq("orders.payment_status", "succeeded")
        .maybeSingle();
      if (!purchased) {
        return NextResponse.json({ error: "Only verified purchasers can review a plan." }, { status: 403 });
      }
      const { error } = await supabase.from("reviews").insert({
        buyer_id: profile.id,
        plan_id: parsed.data.planId,
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
        verified_purchase: true,
      });
      if (error) return NextResponse.json({ error: "Unable to save this review." }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    await updateStore((store) => {
      const architect = getArchitectForUser(store, profile.id);
      const plan = findPlan(store, parsed.data.planId);
      if (!plan) throw new Error("This house plan is no longer available.");
      if (architect?.id === plan.architect_id) {
        throw new Error("Architects cannot review their own plans.");
      }
      const purchased = store.orders.some(
        (order) =>
          order.buyer_id === profile.id &&
          order.payment_status === "succeeded" &&
          order.items.some((item) => item.plan_id === plan.id),
      );
      if (!purchased) throw new Error("Only verified purchasers can review a plan.");
      if (store.reviews.some((review) => review.buyer_id === profile.id && review.plan_id === plan.id)) {
        throw new Error("You have already reviewed this plan.");
      }
      store.reviews.unshift({
        id: crypto.randomUUID(),
        buyer_id: profile.id,
        plan_id: plan.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
        verified_purchase: true,
        architect_response: null,
        architect_responded_at: null,
        created_at: new Date().toISOString(),
        buyer_name: profile.full_name ?? "Homeowner",
        buyer_avatar: profile.avatar_url,
        plan_title: plan.title,
      });
      const planReviews = store.reviews.filter((review) => review.plan_id === plan.id);
      plan.review_count = planReviews.length;
      plan.average_rating =
        Math.round((planReviews.reduce((sum, review) => sum + review.rating, 0) / planReviews.length) * 10) / 10;
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
