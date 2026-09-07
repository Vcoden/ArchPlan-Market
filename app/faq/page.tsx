import { brand } from "@/lib/brand";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `FAQ | ${brand.name}`,
  description: "Answers about buying and selling house plans.",
  path: "/faq",
});

const faqs = [
  {
    q: "Can I download files before paying?",
    a: "No. Preview images may be watermarked. Original CAD and PDF files are private until payment succeeds.",
  },
  {
    q: "Are these construction documents for every city?",
    a: brand.disclaimer,
  },
  {
    q: "Who can review a plan?",
    a: "Only verified purchasers. Architects cannot review their own listings.",
  },
  {
    q: "How do architects get paid?",
    a: "Each sale stores price, commission percentage, platform commission, and architect earnings. Sellers request payouts from their dashboard.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-5xl">FAQ</h1>
      <div className="mt-10 space-y-8">
        {faqs.map((item) => (
          <div key={item.q} className="border-t pt-5">
            <h2 className="font-display text-2xl">{item.q}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
