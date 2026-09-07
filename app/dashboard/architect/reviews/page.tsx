import { ReviewResponseForm } from "@/components/architect/review-response-form";
import { ReviewCard } from "@/components/marketplace/review-card";
import { EmptyState } from "@/components/marketplace/empty-state";
import { getCurrentArchitect } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";

export default async function ArchitectReviewsPage() {
  const architect = await getCurrentArchitect();
  const store = await readStore();
  const planIds = new Set(
    architect ? store.plans.filter((plan) => plan.architect_id === architect.id).map((plan) => plan.id) : [],
  );
  const reviews = store.reviews.filter((review) => planIds.has(review.plan_id));

  return (
    <div>
      <h1 className="font-display text-4xl">Reviews</h1>
      <div className="mt-8 space-y-6">
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <ReviewCard review={review} />
              {!review.architect_response ? <ReviewResponseForm reviewId={review.id} /> : null}
            </div>
          ))
        ) : (
          <EmptyState title="No reviews on your plans yet." />
        )}
      </div>
    </div>
  );
}
