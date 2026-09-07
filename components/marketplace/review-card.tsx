import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/marketplace/rating-stars";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{review.buyer_name ?? "Homeowner"}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {review.verified_purchase ? <Badge variant="accent">Verified Purchase</Badge> : null}
          <RatingStars rating={review.rating} />
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl">{review.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
      {review.architect_response ? (
        <div className="mt-4 rounded-lg bg-secondary p-4">
          <p className="text-xs font-medium tracking-wide uppercase">Architect response</p>
          <p className="mt-1 text-sm">{review.architect_response}</p>
        </div>
      ) : null}
    </article>
  );
}
