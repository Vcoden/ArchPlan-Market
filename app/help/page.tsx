import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Help Center | ArchPlan Market",
  description: "Help for homeowners and architects.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-5xl">Help Center</h1>
      <ul className="mt-8 space-y-3 text-lg">
        <li>
          <Link href="/faq" className="underline">
            Frequently asked questions
          </Link>
        </li>
        <li>
          <Link href="/contact" className="underline">
            Contact support
          </Link>
        </li>
        <li>
          <Link href="/how-it-works" className="underline">
            How buying works
          </Link>
        </li>
        <li>
          <Link href="/seller-guide" className="underline">
            Seller guide
          </Link>
        </li>
      </ul>
    </div>
  );
}
