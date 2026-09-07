import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { architectEarnings, getArchitectForUser, readStore, updateStore } from "@/lib/data/store";

export async function POST(request: Request) {
  try {
    const profile = await getSessionAccount();
    if (!profile) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    const { amount, method } = (await request.json()) as { amount?: number; method?: string };
    const value = Number(amount);
    if (!value || value < 50) {
      return NextResponse.json({ error: "Minimum payout is $50." }, { status: 400 });
    }

    await updateStore((store) => {
      const architect = getArchitectForUser(store, profile.id);
      if (!architect) throw new Error("Only architects can request payouts.");
      const earnings = architectEarnings(store, architect.id);
      if (value > earnings.available) throw new Error("That amount exceeds your available balance.");
      store.payouts.unshift({
        id: crypto.randomUUID(),
        architect_id: architect.id,
        amount: value,
        status: "pending",
        payout_method: method || "bank_transfer",
        notes: null,
        requested_at: new Date().toISOString(),
        processed_at: null,
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}

export async function GET() {
  const profile = await getSessionAccount();
  if (!profile) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const store = await readStore();
  const architect = getArchitectForUser(store, profile.id);
  const payouts = architect
    ? store.payouts.filter((item) => item.architect_id === architect.id)
    : profile.role === "admin"
      ? store.payouts
      : [];
  return NextResponse.json({ payouts });
}
