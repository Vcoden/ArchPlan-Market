import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { updateStore } from "@/lib/data/store";

export async function POST(request: Request) {
  const profile = await getSessionAccount();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id, suspended } = (await request.json()) as { id?: string; suspended?: boolean };
  if (!id || typeof suspended !== "boolean") {
    return NextResponse.json({ error: "Missing user or status." }, { status: 400 });
  }

  await updateStore((store) => {
    const account = store.accounts.find((item) => item.id === id);
    if (!account) throw new Error("User not found.");
    if (account.role === "admin") throw new Error("Administrators cannot be suspended here.");
    account.is_suspended = suspended;
    account.updated_at = new Date().toISOString();
  });

  return NextResponse.json({ ok: true });
}
