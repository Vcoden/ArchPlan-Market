import Link from "next/link";
import { ArchitectAvatar } from "@/components/marketplace/architect-avatar";
import { CoverImage } from "@/components/marketplace/cover-image";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { PriceDisplay } from "@/components/marketplace/price-display";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlanImage } from "@/lib/data/query";
import { ARCHITECTURAL_STYLES } from "@/lib/constants";
import { formatArea } from "@/lib/utils";
import type { Plan } from "@/types";

export function PlanCard({ plan }: { plan: Plan }) {
  const style = ARCHITECTURAL_STYLES.find((item) => item.value === plan.architectural_style)?.label;
  const image = getPlanImage(plan);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-[var(--shadow)]">
      <Link href={`/plans/${plan.slug}`} className="image-frame relative aspect-[4/3] block">
        <CoverImage src={image} alt={plan.title} sizes="(max-width: 768px) 100vw, 33vw" />
        <FavoriteButton planId={plan.id} className="absolute top-3 right-3" />
        {style ? <Badge className="absolute bottom-3 left-3 bg-card/95">{style}</Badge> : null}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <Link href={`/plans/${plan.slug}`} className="font-display text-2xl leading-tight hover:text-accent">
            {plan.title}
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            {plan.bedrooms} Beds · {plan.bathrooms} Baths · {plan.floors} {plan.floors === 1 ? "Floor" : "Floors"}
          </p>
          <p className="text-sm text-muted-foreground">{formatArea(plan.floor_area)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <PriceDisplay amount={plan.price} />
          <RatingStars rating={plan.average_rating} count={plan.review_count} />
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <Link href={`/architects/${plan.architect?.slug ?? ""}`} className="flex items-center gap-2">
            <ArchitectAvatar name={plan.architect?.professional_name ?? "Architect"} src={plan.architect?.avatar_url} />
            <span className="text-sm">{plan.architect?.professional_name ?? "Architect"}</span>
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link href={`/plans/${plan.slug}`}>View Plan</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
