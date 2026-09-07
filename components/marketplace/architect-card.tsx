import Link from "next/link";
import { ArchitectAvatar } from "@/components/marketplace/architect-avatar";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { Badge } from "@/components/ui/badge";
import type { ArchitectProfile } from "@/types";

export function ArchitectCard({ architect }: { architect: ArchitectProfile }) {
  return (
    <Link
      href={`/architects/${architect.slug}`}
      className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-[var(--shadow)] transition-colors hover:border-accent/40"
    >
      <div className="flex items-center gap-3">
        <ArchitectAvatar name={architect.professional_name} src={architect.avatar_url} size="md" />
        <div>
          <h3 className="font-display text-2xl leading-tight">{architect.professional_name}</h3>
          <p className="text-sm text-muted-foreground">{architect.title}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {architect.biography}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {architect.specializations.slice(0, 3).map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-5 text-sm text-muted-foreground">
        <span>{architect.location}</span>
        <RatingStars rating={architect.rating ?? 0} />
      </div>
    </Link>
  );
}
