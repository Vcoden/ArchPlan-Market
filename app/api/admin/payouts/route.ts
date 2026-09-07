import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { updateStore } from "@/lib/data/store";

export async function POST(request: Request) {
  const profile = await getSessionAccount();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id, status } = (await request.json()) as { id?: string; status?: "completed" | "rejected" | "processing" };
  if (!id || !status) return NextResponse.json({ error: "Missing payout or status." }, { status: 400 });

  await updateStore((store) => {
    const payout = store.payouts.find((item) => item.id === id);
    if (!payout) throw new Error("Payout not found.");
    payout.status = status;
    payout.processed_at = status === "completed" || status === "rejected" ? new Date().toISOString() : payout.processed_at;
  });
  return NextResponse.json({ ok: true });
}
