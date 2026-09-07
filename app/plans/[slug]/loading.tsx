import { DetailSkeleton } from "@/components/marketplace/loading-skeleton";

export default function PlanDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <DetailSkeleton />
    </div>
  );
}
