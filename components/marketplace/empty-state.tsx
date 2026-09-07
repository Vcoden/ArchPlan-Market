import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionLabel = "Explore Plans",
  actionHref = "/plans",
  className,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-dashed bg-card px-6 py-16 text-center", className)}>
      <h2 className="font-display text-3xl">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-md text-muted-foreground">{description}</p> : null}
      <Button asChild className="mt-6">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
