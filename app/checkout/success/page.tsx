import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Purchase complete | ArchPlan Market",
  description: "Your house plan is ready to download.",
  path: "/checkout/success",
});

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reference?: string }>;
}) {
  const { order, reference } = await searchParams;

  if (order) {
    const { confirmLocalOrder } = await import("@/lib/checkout/confirm-order");
    await confirmLocalOrder(order, reference ?? `mock_${order}`).catch(() => undefined);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Order confirmed</p>
      <h1 className="mt-3 font-display text-5xl">Your plans are ready.</h1>
      <p className="mt-4 text-muted-foreground">
        Payment was recorded and file access has been granted for the purchased plans. Open your
        library to download the original files.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/downloads">Download files</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/orders">View order history</Link>
        </Button>
      </div>
    </div>
  );
}
