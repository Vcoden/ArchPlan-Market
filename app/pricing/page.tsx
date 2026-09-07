import { brand } from "@/lib/brand";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Seller pricing | ArchPlan Market",
  description: "Commission and payout information for architects.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-5xl">Seller pricing</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Listing is free. {brand.name} takes a {brand.defaultCommissionPercent}% commission on each
        successful sale. Architects keep the remainder after any payment processing fee.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6">
        <p>Example sale at $150</p>
        <p className="mt-2 text-muted-foreground">
          Platform commission: $22.50 · Architect earnings: $127.50
        </p>
      </div>
    </div>
  );
}
