import { brand } from "@/lib/brand";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `Privacy | ${brand.name}`,
  description: "How ArchPlan Market handles account and order data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 leading-relaxed">
      <h1 className="font-display text-5xl">Privacy</h1>
      <p className="mt-6">
        We store account details, orders, and download history so you can access files you purchased.
        Payment card data is handled by the configured payment provider. Preview images may be public;
        original plan files are private.
      </p>
    </article>
  );
}
