import { EmptyState } from "@/components/marketplace/empty-state";
import { ReviewCard } from "@/components/marketplace/review-card";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";

export default async function DashboardReviewsPage() {
  const profile = await getCurrentProfile();
  const store = await readStore();
  const reviews = profile ? store.reviews.filter((review) => review.buyer_id === profile.id) : [];

  return (
    <div>
      <h1 className="font-display text-4xl">Reviews</h1>
      <p className="mt-2 text-muted-foreground">Only verified purchasers can review a plan.</p>
      <div className="mt-8 space-y-4">
        {reviews.length ? (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <EmptyState title="You have not reviewed a plan yet." />
        )}
      </div>
    </div>
  );
}
