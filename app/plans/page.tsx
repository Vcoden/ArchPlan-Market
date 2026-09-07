import { Suspense } from "react";
import { FilterDrawer } from "@/components/marketplace/filter-drawer";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { PlanGridSkeleton } from "@/components/marketplace/loading-skeleton";
import { Pagination } from "@/components/marketplace/pagination";
import { PlanGrid } from "@/components/marketplace/plan-grid";
import { SearchBar } from "@/components/marketplace/search-bar";
import { EmptyState } from "@/components/marketplace/empty-state";
import { createMetadata } from "@/lib/seo";
import { filtersFromSearchParams } from "@/lib/search-params";
import { listPlans } from "@/services/plans";

export const metadata = createMetadata({
  title: "Explore House Plans | ArchPlan Market",
  description:
    "Browse professionally designed house plans by style, size, bedrooms, and price. Compare layouts before you buy.",
  path: "/plans",
});

export default async function PlansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = filtersFromSearchParams(params);
  const result = await listPlans(filters);
  const query = typeof params.q === "string" ? params.q : "";
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, value]) => typeof value === "string")
        .map(([key, value]) => [key, String(value)]),
    ),
  );
  qs.delete("page");
  const basePath = `/plans${qs.toString() ? `?${qs}` : ""}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Marketplace</p>
      <h1 className="mt-2 font-display text-5xl">Explore House Plans</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Search by plan name, style, architect, or keyword. Filter by size, lot, and price to find a
        house you will actually want to build.
      </p>
      <div className="mt-8 max-w-3xl">
        <SearchBar defaultValue={query} />
      </div>
      <div className="mt-6 lg:hidden">
        <Suspense>
          <FilterDrawer />
        </Suspense>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <Suspense>
            <FilterSidebar />
          </Suspense>
        </div>
        <div>
          <p className="mb-6 text-sm text-muted-foreground">{result.total} plans</p>
          <Suspense fallback={<PlanGridSkeleton />}>
            {result.data.length ? (
              <PlanGrid plans={result.data} />
            ) : (
              <EmptyState
                title="No house plans match these filters."
                description="Try a broader search or clear a few constraints."
              />
            )}
          </Suspense>
          <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} />
        </div>
      </div>
    </div>
  );
}
