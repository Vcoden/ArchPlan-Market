import { PlanGridSkeleton } from "@/components/marketplace/loading-skeleton";

export default function PlansLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PlanGridSkeleton />
    </div>
  );
}
