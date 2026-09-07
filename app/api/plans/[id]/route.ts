import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { findPlan, getArchitectForUser, readStore, updateStore } from "@/lib/data/store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await readStore();
  const plan = findPlan(store, id);
  if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  return NextResponse.json({ plan });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getSessionAccount();
  if (!profile) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const body = (await request.json()) as { status?: string; featured?: boolean; review_notes?: string };
  const store = await readStore();
  const plan = findPlan(store, id);
  if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

  const architect = getArchitectForUser(store, profile.id);
  const isOwner = architect?.id === plan.architect_id;
  const isAdmin = profile.role === "admin";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "You can only edit your own listings." }, { status: 403 });
  }

  await updateStore((next) => {
    const target = findPlan(next, id);
    if (!target) return;
    if (isAdmin) {
      if (body.status) target.status = body.status as typeof target.status;
      if (typeof body.featured === "boolean") target.featured = body.featured;
      if (body.review_notes != null) target.review_notes = body.review_notes;
    } else if (isOwner && body.status === "pending_review") {
      target.status = "pending_review";
    }
    target.updated_at = new Date().toISOString();
  });

  return NextResponse.json({ ok: true });
}
