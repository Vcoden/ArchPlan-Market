import { CheckoutView } from "@/components/marketplace/checkout-view";
import { readStore } from "@/lib/data/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Checkout | ArchPlan Market",
  description: "Complete your house plan purchase.",
  path: "/checkout",
});

export default async function CheckoutPage() {
  const store = await readStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">Checkout</h1>
      <CheckoutView catalog={store.plans} />
    </div>
  );
}
