import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/account";
import { createAccount, findAccountByEmail, updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signUpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      return NextResponse.json({ useClient: true });
    }

    const role = parsed.data.intent === "architect" ? "architect" : "homeowner";
    const account = await updateStore((store) => {
      if (findAccountByEmail(store, parsed.data.email)) {
        throw new Error("An account with that email already exists.");
      }
      const created = createAccount({
        email: parsed.data.email,
        password: parsed.data.password,
        fullName: parsed.data.fullName,
        role,
      });
      store.accounts.push(created);
      return created;
    });

    await setSessionCookie(account.id);
    return NextResponse.json({
      ok: true,
      next: role === "architect" ? "/become-an-architect/apply" : "/dashboard",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
