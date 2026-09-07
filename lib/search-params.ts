import type { ArchitecturalStyle, PlanFilters, PropertyType, SortOption } from "@/types";

export function filtersFromSearchParams(params: Record<string, string | string[] | undefined>): PlanFilters {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const num = (key: string) => {
    const value = get(key);
    return value ? Number(value) : undefined;
  };

  return {
    query: get("q"),
    style: get("style") as ArchitecturalStyle | undefined,
    propertyType: get("type") as PropertyType | undefined,
    category: get("category"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    bedrooms: num("beds"),
    bathrooms: num("baths"),
    floors: num("floors"),
    minArea: num("minArea"),
    maxArea: num("maxArea"),
    minLotWidth: num("lotWidth"),
    minLotDepth: num("lotDepth"),
    garage: get("garage") === "1",
    featured: get("featured") === "1",
    architect: get("architect"),
    sort: (get("sort") as SortOption | undefined) ?? "popularity",
    page: num("page") ?? 1,
  };
}

export function searchParamsToQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
