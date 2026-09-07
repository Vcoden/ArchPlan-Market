import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/account";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST() {
  if (!isSupabaseConfigured()) {
    await clearSessionCookie();
  }
  return NextResponse.json({ ok: true });
}
