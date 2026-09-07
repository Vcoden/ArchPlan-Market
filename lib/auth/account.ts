import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import {
  findAccount,
  getArchitectForUser,
  readStore,
  toProfile,
} from "@/lib/data/store";
import type { ArchitectProfile, Profile } from "@/types";

export async function getSessionAccount() {
  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    return (data as Profile | null)
      ? { ...(data as Profile), email: user.email ?? (data as Profile).email }
      : {
          id: user.id,
          full_name: user.user_metadata?.full_name ?? null,
          email: user.email ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          role: (user.user_metadata?.role as Profile["role"]) ?? "homeowner",
          country: null,
          bio: null,
          phone: null,
          is_suspended: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
  }

  const jar = await cookies();
  const userId = jar.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  const store = await readStore();
  const account = findAccount(store, userId);
  return account && !account.is_suspended ? toProfile({ ...account }) : null;
}

export async function getSessionArchitect(): Promise<ArchitectProfile | null> {
  const profile = await getSessionAccount();
  if (!profile) return null;

  if (isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("architect_profiles")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle();
    return (data as ArchitectProfile | null) ?? null;
  }

  const store = await readStore();
  return getArchitectForUser(store, profile.id);
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
