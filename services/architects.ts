import { publishedPlans, readStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ArchitectProfile, Plan } from "@/types";

async function getServerClient() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function listArchitects() {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.architects.filter((architect) => architect.approval_status === "approved");
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("architect_profiles")
      .select("*, profiles(avatar_url)")
      .eq("approval_status", "approved")
      .order("professional_name");
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...(row as ArchitectProfile),
      avatar_url:
        (row as { profiles?: { avatar_url?: string } }).profiles?.avatar_url ??
        (row as ArchitectProfile).avatar_url,
    }));
  } catch {
    const store = await readStore();
    return store.architects.filter((architect) => architect.approval_status === "approved");
  }
}

export async function getArchitectBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.architects.find((architect) => architect.slug === slug) ?? null;
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("architect_profiles")
      .select("*, profiles(avatar_url, full_name)")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const store = await readStore();
      return store.architects.find((architect) => architect.slug === slug) ?? null;
    }
    return {
      ...(data as ArchitectProfile),
      avatar_url: (data as { profiles?: { avatar_url?: string } }).profiles?.avatar_url,
    };
  } catch {
    const store = await readStore();
    return store.architects.find((architect) => architect.slug === slug) ?? null;
  }
}

export async function getArchitectPlans(architectId: string): Promise<Plan[]> {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return publishedPlans(store).filter((plan) => plan.architect_id === architectId);
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*, plan_media(*), architect_profiles(*)")
      .eq("architect_id", architectId)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...(row as Plan),
      media: (row as { plan_media?: Plan["media"] }).plan_media,
      architect: (row as { architect_profiles?: Plan["architect"] }).architect_profiles,
      main_image: (row as { plan_media?: { file_path: string; is_primary: boolean }[] }).plan_media?.find(
        (item) => item.is_primary,
      )?.file_path,
    }));
  } catch {
    const store = await readStore();
    return publishedPlans(store).filter((plan) => plan.architect_id === architectId);
  }
}
