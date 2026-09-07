import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Seller Guide | ArchPlan Market",
  description: "How to prepare and publish house plans.",
  path: "/seller-guide",
});

export default function SellerGuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 leading-relaxed">
      <h1 className="font-display text-5xl">Seller guide</h1>
      <ol className="mt-8 list-decimal space-y-4 pl-5">
        <li>Apply as an architect and wait for approval.</li>
        <li>Upload watermarked previews and private CAD/PDF files.</li>
        <li>Submit the listing for review. Only published plans appear in search.</li>
        <li>After a sale, the buyer receives signed download links and you earn the stored amount.</li>
      </ol>
    </article>
  );
}
