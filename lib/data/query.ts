import { PAGE_SIZE } from "@/lib/constants";
import { seedArchitects, seedCategories, seedPlans, seedReviews } from "@/lib/data/seed";
import type {
  ArchitectProfile,
  Category,
  PaginatedResult,
  Plan,
  PlanFilters,
  Review,
} from "@/types";

function asArray<T>(value?: T | T[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function getPlanImage(plan: Plan) {
  return (
    plan.main_image ??
    plan.media?.find((item) => item.is_primary)?.file_path ??
    plan.media?.[0]?.file_path ??
    ""
  );
}

export function filterPlans(plans: Plan[], filters: PlanFilters = {}) {
  const styles = asArray(filters.style);
  const types = asArray(filters.propertyType);
  const query = filters.query?.trim().toLowerCase();

  return plans.filter((plan) => {
    if (plan.status !== "published") return false;
    if (filters.featured && !plan.featured) return false;
    if (filters.architect && plan.architect?.slug !== filters.architect && plan.architect_id !== filters.architect) {
      return false;
    }
    if (filters.category) {
      const matchesCategory =
        plan.category?.slug === filters.category ||
        plan.architectural_style === filters.category ||
        (filters.category === "small-homes" && plan.floor_area < 1800) ||
        (filters.category === "family-homes" && plan.bedrooms >= 3) ||
        (filters.category === "multi-family" &&
          ["duplex", "townhouse", "multi_family"].includes(plan.property_type));
      if (!matchesCategory && plan.category_id !== filters.category) return false;
    }
    if (styles.length && !styles.includes(plan.architectural_style)) return false;
    if (types.length && !types.includes(plan.property_type)) return false;
    if (filters.minPrice != null && plan.price < filters.minPrice) return false;
    if (filters.maxPrice != null && plan.price > filters.maxPrice) return false;
    if (filters.bedrooms != null && plan.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms != null && plan.bathrooms < filters.bathrooms) return false;
    if (filters.floors != null && plan.floors !== filters.floors) return false;
    if (filters.minArea != null && plan.floor_area < filters.minArea) return false;
    if (filters.maxArea != null && plan.floor_area > filters.maxArea) return false;
    if (filters.minLotWidth != null && (plan.lot_width ?? 0) < filters.minLotWidth) return false;
    if (filters.minLotDepth != null && (plan.lot_depth ?? 0) < filters.minLotDepth) return false;
    if (filters.garage && plan.garage_spaces < 1) return false;
    if (query) {
      const haystack = [
        plan.title,
        plan.description,
        plan.overview ?? "",
        plan.architectural_style,
        plan.property_type,
        plan.architect?.professional_name ?? "",
        plan.category?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortPlans(plans: Plan[], sort: PlanFilters["sort"] = "popularity") {
  const copy = [...plans];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    case "best_rated":
      return copy.sort((a, b) => b.average_rating - a.average_rating || b.review_count - a.review_count);
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    default:
      return copy.sort((a, b) => b.sales_count - a.sales_count || b.average_rating - a.average_rating);
  }
}

export function paginate<T>(items: T[], page = 1, pageSize = PAGE_SIZE): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export function querySeedPlans(filters: PlanFilters = {}): PaginatedResult<Plan> {
  const filtered = sortPlans(filterPlans(seedPlans, filters), filters.sort);
  return paginate(filtered, filters.page, filters.pageSize ?? PAGE_SIZE);
}

export function getSeedPlanBySlug(slug: string) {
  return seedPlans.find((plan) => plan.slug === slug) ?? null;
}

export function getSeedFeaturedPlans(limit = 6) {
  return sortPlans(
    seedPlans.filter((plan) => plan.featured && plan.status === "published"),
    "popularity",
  ).slice(0, limit);
}

export function getSeedRelatedPlans(plan: Plan, limit = 3) {
  return seedPlans
    .filter(
      (item) =>
        item.id !== plan.id &&
        item.status === "published" &&
        (item.architectural_style === plan.architectural_style ||
          item.architect_id === plan.architect_id),
    )
    .slice(0, limit);
}

export function getSeedArchitectBySlug(slug: string) {
  return seedArchitects.find((architect) => architect.slug === slug) ?? null;
}

export function getSeedArchitectPlans(architectId: string) {
  return seedPlans.filter((plan) => plan.architect_id === architectId && plan.status === "published");
}

export function getSeedCategories(): Category[] {
  return seedCategories;
}

export function getSeedCategory(slug: string) {
  return seedCategories.find((category) => category.slug === slug) ?? null;
}

export function getSeedReviews(planId: string): Review[] {
  return seedReviews.filter((review) => review.plan_id === planId);
}

export function getSeedSearchSuggestions(query: string, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return seedPlans
    .filter((plan) =>
      `${plan.title} ${plan.architectural_style} ${plan.architect?.professional_name}`.toLowerCase().includes(q),
    )
    .slice(0, limit)
    .map((plan) => ({
      title: plan.title,
      slug: plan.slug,
      style: plan.architectural_style,
      image: getPlanImage(plan),
    }));
}

export function getSeedArchitects(): ArchitectProfile[] {
  return seedArchitects;
}
