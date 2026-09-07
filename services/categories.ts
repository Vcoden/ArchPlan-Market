import { readStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Category } from "@/types";

export async function listCategories() {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.categories;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  } catch {
    const store = await readStore();
    return store.categories;
  }
}

export async function getCategoryBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.categories.find((category) => category.slug === slug) ?? null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return data as Category;
    const store = await readStore();
    return store.categories.find((category) => category.slug === slug) ?? null;
  } catch {
    const store = await readStore();
    return store.categories.find((category) => category.slug === slug) ?? null;
  }
}
