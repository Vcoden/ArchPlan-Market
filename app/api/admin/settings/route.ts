import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { readStore, updateStore } from "@/lib/data/store";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({ commission: store.settings.platform_commission });
}

export async function POST(request: Request) {
  const profile = await getSessionAccount();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { commission } = (await request.json()) as { commission?: number };
  const value = Number(commission);
  if (!value || value < 0 || value > 50) {
    return NextResponse.json({ error: "Enter a commission between 0 and 50." }, { status: 400 });
  }
  await updateStore((store) => {
    store.settings.platform_commission = value;
  });
  return NextResponse.json({ ok: true });
}
