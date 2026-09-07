import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? `${basePath}${basePath.includes("?") ? "&" : "?"}page=${page - 1}` : null;
  const next = page < totalPages ? `${basePath}${basePath.includes("?") ? "&" : "?"}page=${page + 1}` : null;

  return (
    <div className="mt-10 flex items-center justify-between">
      <Button asChild variant="outline" disabled={!prev}>
        {prev ? <Link href={prev}>Previous</Link> : <span>Previous</span>}
      </Button>
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <Button asChild variant="outline" disabled={!next}>
        {next ? <Link href={next}>Next</Link> : <span>Next</span>}
      </Button>
    </div>
  );
}
