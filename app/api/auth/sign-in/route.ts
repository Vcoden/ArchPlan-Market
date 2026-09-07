import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/account";
import { findAccountByEmail, readStore, verifyPassword } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signInSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      return NextResponse.json({ useClient: true });
    }

    const store = await readStore();
    const account = findAccountByEmail(store, parsed.data.email);
    if (!account || !verifyPassword(parsed.data.password, account.password_hash)) {
      return NextResponse.json({ error: "Those credentials are incorrect." }, { status: 401 });
    }
    if (account.is_suspended) {
      return NextResponse.json({ error: "This account has been suspended." }, { status: 403 });
    }

    await setSessionCookie(account.id);
    return NextResponse.json({
      ok: true,
      next: account.role === "admin" ? "/admin" : "/dashboard",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
