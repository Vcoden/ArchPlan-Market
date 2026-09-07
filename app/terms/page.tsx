import { brand } from "@/lib/brand";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `Terms | ${brand.name}`,
  description: "Marketplace terms for buyers and architects.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 leading-relaxed">
      <h1 className="font-display text-5xl">Terms</h1>
      <p className="mt-6 text-muted-foreground">{brand.disclaimer}</p>
      <p className="mt-4">
        Buyers receive a license to use purchased digital files for a single project unless a listing
        states otherwise. Architects retain copyright in their drawings. The marketplace charges a
        commission that is recorded on each order and is not recalculated later.
      </p>
    </article>
  );
}
