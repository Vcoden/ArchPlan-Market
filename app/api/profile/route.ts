import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    const profile = await getSessionAccount();
    if (!profile) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });

    const body = (await request.json()) as {
      fullName?: string;
      country?: string;
      bio?: string;
      phone?: string;
    };

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: body.fullName,
          country: body.country,
          bio: body.bio,
          phone: body.phone,
        })
        .eq("id", profile.id);
      if (error) return NextResponse.json({ error: "Unable to save your profile." }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    await updateStore((store) => {
      const account = store.accounts.find((item) => item.id === profile.id);
      if (!account) throw new Error("Account not found.");
      account.full_name = body.fullName ?? account.full_name;
      account.country = body.country ?? account.country;
      account.bio = body.bio ?? account.bio;
      account.phone = body.phone ?? account.phone;
      account.updated_at = new Date().toISOString();
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
