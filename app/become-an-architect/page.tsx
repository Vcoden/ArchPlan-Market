import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Become an Architect | ArchPlan Market",
  description: "Turn your architectural designs into income by selling house plans.",
  path: "/become-an-architect",
});

const benefits = [
  "Sell digital house plans",
  "Reach homeowners",
  "Build your professional profile",
  "Track sales",
  "Manage your digital products",
  "Earn from every sale",
];

export default function BecomeArchitectPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">For architects</p>
      <h1 className="mt-3 font-display text-5xl">Turn your architectural designs into income.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Publish finished house plans, set your price, and earn on every download. Listings are
        reviewed before they go live so buyers can trust the marketplace.
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <div key={benefit} className="rounded-xl border bg-card px-5 py-4">
            {benefit}
          </div>
        ))}
      </div>
      <Button asChild size="lg" className="mt-10">
        <Link href="/become-an-architect/apply">Start Selling</Link>
      </Button>
    </div>
  );
}
