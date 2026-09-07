import { PAGE_SIZE } from "@/lib/constants";
import {
  filterPlans,
  getSeedRelatedPlans,
  paginate,
  sortPlans,
} from "@/lib/data/query";
import { seedArchitects, seedCategories } from "@/lib/data/seed";
import { findPlan, publishedPlans, readStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ArchitectProfile, Category, Plan, PlanFilters, Review } from "@/types";

async function getServerClient() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function mapPlan(row: Plan & { architect_profiles?: ArchitectProfile; categories?: Category }) {
  return {
    ...row,
    architect: row.architect ?? row.architect_profiles,
    category: row.category ?? row.categories,
    main_image:
      row.main_image ??
      row.media?.find((item) => item.is_primary)?.file_path ??
      row.media?.[0]?.file_path,
  } as Plan;
}

export async function listPlans(filters: PlanFilters = {}) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return paginate(
      sortPlans(filterPlans(publishedPlans(store), filters), filters.sort),
      filters.page,
      filters.pageSize ?? PAGE_SIZE,
    );
  }

  try {
    const supabase = await getServerClient();
    let query = supabase
      .from("plans")
      .select(
        "*, architect_profiles(*), categories(*), plan_media(*)",
        { count: "exact" },
      )
      .eq("status", "published");

    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
      );
    }
    if (filters.style) {
      const styles = Array.isArray(filters.style) ? filters.style : [filters.style];
      query = query.in("architectural_style", styles);
    }
    if (filters.propertyType) {
      const types = Array.isArray(filters.propertyType)
        ? filters.propertyType
        : [filters.propertyType];
      query = query.in("property_type", types);
    }
    if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
    if (filters.bedrooms != null) query = query.gte("bedrooms", filters.bedrooms);
    if (filters.bathrooms != null) query = query.gte("bathrooms", filters.bathrooms);
    if (filters.floors != null) query = query.eq("floors", filters.floors);
    if (filters.minArea != null) query = query.gte("floor_area", filters.minArea);
    if (filters.maxArea != null) query = query.lte("floor_area", filters.maxArea);
    if (filters.garage) query = query.gte("garage_spaces", 1);
    if (filters.featured) query = query.eq("featured", true);
    if (filters.category) {
      const category = seedCategories.find((item) => item.slug === filters.category);
      if (category) query = query.eq("category_id", category.id);
    }

    switch (filters.sort) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "best_rated":
        query = query.order("average_rating", { ascending: false });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        query = query.order("sales_count", { ascending: false });
    }

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? PAGE_SIZE;
    const from = (page - 1) * pageSize;
    const { data, count, error } = await query.range(from, from + pageSize - 1);

    if (error) throw error;

    return {
      data: (data ?? []).map((row) =>
        mapPlan({
          ...(row as Plan),
          media: (row as { plan_media?: Plan["media"] }).plan_media,
        }),
      ),
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  } catch {
    const store = await readStore();
    return paginate(
      sortPlans(filterPlans(publishedPlans(store), filters), filters.sort),
      filters.page,
      filters.pageSize ?? PAGE_SIZE,
    );
  }
}

export async function getFeaturedPlans(limit = 6) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return sortPlans(
      publishedPlans(store).filter((plan) => plan.featured),
      "popularity",
    ).slice(0, limit);
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*, architect_profiles(*), plan_media(*)")
      .eq("status", "published")
      .eq("featured", true)
      .order("sales_count", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) =>
      mapPlan({
        ...(row as Plan),
        media: (row as { plan_media?: Plan["media"] }).plan_media,
      }),
    );
  } catch {
    const store = await readStore();
    return sortPlans(
      publishedPlans(store).filter((plan) => plan.featured),
      "popularity",
    ).slice(0, limit);
  }
}

export async function getPlanBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return findPlan(store, slug);
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*, architect_profiles(*), categories(*), plan_media(*), plan_rooms(*)")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const store = await readStore();
      return findPlan(store, slug);
    }
    return mapPlan({
      ...(data as Plan),
      media: (data as { plan_media?: Plan["media"] }).plan_media,
      rooms: (data as { plan_rooms?: Plan["rooms"] }).plan_rooms,
    });
  } catch {
    const store = await readStore();
    return findPlan(store, slug);
  }
}

export async function getRelatedPlans(plan: Plan, limit = 3) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return publishedPlans(store)
      .filter(
        (item) =>
          item.id !== plan.id &&
          (item.architectural_style === plan.architectural_style || item.architect_id === plan.architect_id),
      )
      .slice(0, limit);
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*, architect_profiles(*), plan_media(*)")
      .eq("status", "published")
      .neq("id", plan.id)
      .eq("architectural_style", plan.architectural_style)
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) =>
      mapPlan({
        ...(row as Plan),
        media: (row as { plan_media?: Plan["media"] }).plan_media,
      }),
    );
  } catch {
    return getSeedRelatedPlans(plan, limit);
  }
}

export async function getPlanReviews(planId: string): Promise<Review[]> {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.reviews.filter((review) => review.plan_id === planId);
  }

  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(full_name, avatar_url)")
      .eq("plan_id", planId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...(row as Review),
      buyer_name: (row as { profiles?: { full_name?: string } }).profiles?.full_name,
      buyer_avatar: (row as { profiles?: { avatar_url?: string } }).profiles?.avatar_url,
    }));
  } catch {
    const store = await readStore();
    return store.reviews.filter((review) => review.plan_id === planId);
  }
}

export function findSeedArchitect(id: string) {
  return seedArchitects.find((architect) => architect.id === id) ?? null;
}
