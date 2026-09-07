import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { getArchitectForUser, updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    const profile = await getSessionAccount();
    if (!profile) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    const body = (await request.json()) as {
      professionalName?: string;
      title?: string;
      biography?: string;
      location?: string;
      website?: string;
    };

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase
        .from("architect_profiles")
        .update({
          professional_name: body.professionalName,
          title: body.title,
          biography: body.biography,
          location: body.location,
          website: body.website,
        })
        .eq("user_id", profile.id);
      if (error) return NextResponse.json({ error: "Unable to save the architect profile." }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    await updateStore((store) => {
      const architect = getArchitectForUser(store, profile.id);
      if (!architect) throw new Error("No architect profile found.");
      architect.professional_name = body.professionalName ?? architect.professional_name;
      architect.title = body.title ?? architect.title;
      architect.biography = body.biography ?? architect.biography;
      architect.location = body.location ?? architect.location;
      architect.website = body.website ?? architect.website;
      architect.updated_at = new Date().toISOString();
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
