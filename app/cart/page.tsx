import { CartView } from "@/components/marketplace/cart-view";
import { readStore } from "@/lib/data/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cart | ArchPlan Market",
  description: "Review house plans before checkout.",
  path: "/cart",
});

export default async function CartPage() {
  const store = await readStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">Cart</h1>
      <p className="mt-2 text-muted-foreground">House plans are digital products. Quantity is always one per plan.</p>
      <div className="mt-8">
        <CartView catalog={store.plans} />
      </div>
    </div>
  );
}
