import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl">This house plan is no longer available.</h1>
      <p className="mt-4 text-muted-foreground">
        The page may have moved, or the listing was removed from the marketplace.
      </p>
      <Button asChild className="mt-8">
        <Link href="/plans">Explore Plans</Link>
      </Button>
    </div>
  );
}
