import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const icon = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div className={cn("flex items-center gap-1.5 text-muted-foreground", className)}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              icon,
              index < Math.round(rating) ? "fill-accent text-accent" : "text-border",
            )}
          />
        ))}
      </div>
      <span className="text-xs">
        {rating.toFixed(1)}
        {count != null ? ` (${count})` : ""}
      </span>
    </div>
  );
}
