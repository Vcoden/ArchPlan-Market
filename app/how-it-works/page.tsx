import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "How It Works | ArchPlan Market",
  description: "How homeowners buy house plans and how architects sell them.",
  path: "/how-it-works",
});

const steps = [
  {
    title: "Browse professionally designed plans",
    text: "Filter by style, bedrooms, floor area, and lot size. Open a listing to review rooms, inclusions, and the architect behind the work.",
  },
  {
    title: "Purchase a digital package",
    text: "Checkout is built for one-time digital products. After payment, the plan is added to your library and original files stay private to you.",
  },
  {
    title: "Download and adapt",
    text: "Use the drawings with a local architect or engineer. Site conditions, codes, and permits always require professional review.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl">How it works</h1>
      <div className="mt-12 space-y-10">
        {steps.map((step, index) => (
          <div key={step.title} className="border-t pt-6">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Step 0{index + 1}</p>
            <h2 className="mt-2 font-display text-3xl">{step.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex gap-3">
        <Button asChild>
          <Link href="/plans">Explore House Plans</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/become-an-architect">Sell Your Plan</Link>
        </Button>
      </div>
    </div>
  );
}
