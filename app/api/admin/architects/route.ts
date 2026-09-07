import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { updateStore } from "@/lib/data/store";

export async function POST(request: Request) {
  const profile = await getSessionAccount();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id, status, reason } = (await request.json()) as {
    id?: string;
    status?: "approved" | "rejected";
    reason?: string;
  };
  if (!id || !status) return NextResponse.json({ error: "Missing architect or status." }, { status: 400 });

  await updateStore((store) => {
    const architect = store.architects.find((item) => item.id === id);
    if (!architect) throw new Error("Architect not found.");
    architect.approval_status = status;
    architect.rejection_reason = status === "rejected" ? reason ?? "Application declined." : null;
    architect.updated_at = new Date().toISOString();
  });

  return NextResponse.json({ ok: true });
}
