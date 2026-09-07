import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { getArchitectForUser, updateStore } from "@/lib/data/store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getSessionAccount();
  if (!profile) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { response } = (await request.json()) as { response?: string };
  if (!response?.trim()) return NextResponse.json({ error: "Write a response first." }, { status: 400 });

  try {
    await updateStore((store) => {
      const review = store.reviews.find((item) => item.id === id);
      if (!review) throw new Error("Review not found.");
      const architect = getArchitectForUser(store, profile.id);
      const plan = store.plans.find((item) => item.id === review.plan_id);
      if (!architect || plan?.architect_id !== architect.id) {
        throw new Error("You can only respond to reviews on your own plans.");
      }
      review.architect_response = response.trim();
      review.architect_responded_at = new Date().toISOString();
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
