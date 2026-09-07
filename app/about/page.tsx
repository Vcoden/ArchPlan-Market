import { createMetadata } from "@/lib/seo";
import { brand } from "@/lib/brand";

export const metadata = createMetadata({
  title: `About | ${brand.name}`,
  description: brand.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl">About {brand.name}</h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">{brand.description}</p>
      <p className="mt-4 leading-relaxed">
        Architects upload finished house plans. Editors review listings. Homeowners compare designs,
        purchase a digital package, and download files after payment. The platform records commission
        and architect earnings on every sale.
      </p>
    </article>
  );
}
