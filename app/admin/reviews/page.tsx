import { ReviewCard } from "@/components/marketplace/review-card";
import { getCurrentProfile } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";
import { redirect } from "next/navigation";

export default async function AdminReviewsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") redirect("/dashboard");
  const store = await readStore();

  return (
    <div>
      <h1 className="font-display text-4xl">Reviews</h1>
      <div className="mt-8 space-y-4">
        {store.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
