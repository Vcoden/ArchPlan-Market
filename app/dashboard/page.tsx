import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/marketplace/empty-state";
import { PlanGrid } from "@/components/marketplace/plan-grid";
import { getCurrentProfile } from "@/lib/auth/session";
import { buyerOrders, findPlan, readStore } from "@/lib/data/store";

export default async function HomeownerDashboardPage() {
  const profile = await getCurrentProfile();
  const store = await readStore();
  const orders = profile ? buyerOrders(store, profile.id).filter((order) => order.payment_status === "succeeded") : [];
  const reviews = profile ? store.reviews.filter((review) => review.buyer_id === profile.id) : [];
  const downloads = profile ? store.downloads.filter((item) => item.buyer_id === profile.id) : [];
  const purchased = orders.flatMap((order) =>
    order.items.map((item) => findPlan(store, item.plan_id)).filter((plan): plan is NonNullable<typeof plan> => Boolean(plan)),
  );

  return (
    <div>
      <h1 className="font-display text-4xl">Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
      <p className="mt-2 text-muted-foreground">Your purchases, downloads, and saved plans live here.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Purchased plans" value={String(purchased.length)} />
        <StatCard label="Downloads" value={String(downloads.length)} />
        <StatCard label="Reviews written" value={String(reviews.length)} />
      </div>
      <div className="mt-10">
        {purchased.length ? (
          <PlanGrid plans={purchased} />
        ) : (
          <EmptyState
            title="Your purchased plans will appear here."
            description="Complete checkout to unlock downloads."
          />
        )}
      </div>
      <p className="mt-6 text-sm">
        Architects can open the{" "}
        <Link href="/dashboard/architect" className="underline">
          seller dashboard
        </Link>
        .
      </p>
    </div>
  );
}
