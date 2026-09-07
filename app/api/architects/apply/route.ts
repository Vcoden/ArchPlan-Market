import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { getArchitectForUser, updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { slugify } from "@/lib/utils";
import { architectApplicationSchema } from "@/lib/validations/auth";
import type { ArchitectProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const parsed = architectApplicationSchema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
    }

    const profile = await getSessionAccount();
    if (!profile) {
      return NextResponse.json({ error: "Sign in before submitting an architect application." }, { status: 401 });
    }

    const values = parsed.data;
    const specializations = values.specializations.split(",").map((item) => item.trim()).filter(Boolean);

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.from("architect_profiles").upsert({
        user_id: profile.id,
        professional_name: values.professionalName,
        slug: slugify(values.professionalName),
        title: values.title,
        biography: values.biography,
        location: values.location,
        country: values.country,
        years_experience: values.yearsExperience,
        website: values.website || null,
        portfolio_url: values.portfolioUrl || null,
        instagram: values.instagram || null,
        linkedin: values.linkedin || null,
        behance: values.behance || null,
        specializations,
        approval_status: "pending",
      });
      if (error) return NextResponse.json({ error: "Unable to save your application." }, { status: 400 });
      await supabase.from("profiles").update({ role: "architect", full_name: values.fullName }).eq("id", profile.id);
      return NextResponse.json({ ok: true });
    }

    await updateStore((store) => {
      const existing = getArchitectForUser(store, profile.id);
      const now = new Date().toISOString();
      const record: ArchitectProfile = {
        id: existing?.id ?? crypto.randomUUID(),
        user_id: profile.id,
        professional_name: values.professionalName,
        slug: slugify(values.professionalName),
        title: values.title,
        biography: values.biography,
        location: values.location,
        country: values.country,
        years_experience: values.yearsExperience,
        website: values.website || null,
        portfolio_url: values.portfolioUrl || null,
        instagram: values.instagram || null,
        linkedin: values.linkedin || null,
        behance: values.behance || null,
        approval_status: existing?.approval_status === "approved" ? ("approved" as const) : ("pending" as const),
        rejection_reason: null,
        specializations,
        created_at: existing?.created_at ?? now,
        updated_at: now,
        avatar_url: profile.avatar_url,
        rating: existing?.rating ?? 0,
        plan_count: existing?.plan_count ?? 0,
        sales_count: existing?.sales_count ?? 0,
      };
      if (existing) {
        Object.assign(existing, record);
      } else {
        store.architects.push(record);
      }
      const account = store.accounts.find((item) => item.id === profile.id);
      if (account) {
        account.role = "architect";
        account.full_name = values.fullName;
        account.country = values.country;
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
