import Link from "next/link";
import { notFound } from "next/navigation";
import { FileList } from "@/components/marketplace/file-list";
import { ImageGallery } from "@/components/marketplace/image-gallery";
import { PlanGrid } from "@/components/marketplace/plan-grid";
import { PlanPurchase } from "@/components/marketplace/plan-purchase";
import { PriceDisplay } from "@/components/marketplace/price-display";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { ReviewCard } from "@/components/marketplace/review-card";
import { ReviewForm } from "@/components/marketplace/review-form";
import { ArchitectAvatar } from "@/components/marketplace/architect-avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ARCHITECTURAL_STYLES, PROPERTY_TYPES } from "@/lib/constants";
import { brand } from "@/lib/brand";
import { createMetadata, productJsonLd } from "@/lib/seo";
import { formatArea } from "@/lib/utils";
import { getPlanBySlug, getPlanReviews, getRelatedPlans } from "@/services/plans";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) return createMetadata({ title: "Plan not found", description: brand.description, path: `/plans/${slug}` });
  return createMetadata({
    title: `${plan.title} | ${brand.name}`,
    description: plan.overview ?? plan.description,
    path: `/plans/${plan.slug}`,
    image: plan.main_image,
  });
}

export default async function PlanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan || (plan.status !== "published" && plan.status !== "suspended")) notFound();
  if (plan.status === "suspended") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">This house plan is no longer available.</h1>
      </div>
    );
  }

  const [reviews, related] = await Promise.all([getPlanReviews(plan.id), getRelatedPlans(plan)]);
  const style = ARCHITECTURAL_STYLES.find((item) => item.value === plan.architectural_style)?.label;
  const type = PROPERTY_TYPES.find((item) => item.value === plan.property_type)?.label;
  const jsonLd = productJsonLd({
    name: plan.title,
    description: plan.description,
    image: plan.main_image,
    price: plan.price,
    rating: plan.average_rating,
    reviewCount: plan.review_count,
    url: `${brand.url}/plans/${plan.slug}`,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <ImageGallery media={plan.media ?? []} title={plan.title} />
        <div>
          <div className="flex flex-wrap gap-2">
            {style ? <Badge>{style}</Badge> : null}
            {type ? <Badge variant="muted">{type}</Badge> : null}
          </div>
          <h1 className="mt-4 font-display text-5xl">{plan.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link href={`/architects/${plan.architect?.slug}`} className="flex items-center gap-2">
              <ArchitectAvatar
                name={plan.architect?.professional_name ?? "Architect"}
                src={plan.architect?.avatar_url}
              />
              <span>{plan.architect?.professional_name}</span>
            </Link>
            <RatingStars rating={plan.average_rating} count={plan.review_count} />
          </div>
          <div className="mt-6">
            <PriceDisplay amount={plan.price} size="lg" />
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            {[
              ["Bedrooms", plan.bedrooms],
              ["Bathrooms", plan.bathrooms],
              ["Floors", plan.floors],
              ["Total area", formatArea(plan.floor_area)],
              ["Lot", plan.lot_width && plan.lot_depth ? `${plan.lot_width}' × ${plan.lot_depth}'` : "—"],
              ["Garage", plan.garage_spaces ? `${plan.garage_spaces} spaces` : "None"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border bg-card p-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <PlanPurchase plan={plan} />
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{brand.disclaimer}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-16">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="rooms">Room dimensions</TabsTrigger>
          <TabsTrigger value="included">What&apos;s included</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="max-w-3xl leading-relaxed text-muted-foreground">{plan.overview ?? plan.description}</p>
          <p className="mt-4 max-w-3xl leading-relaxed">{plan.description}</p>
        </TabsContent>
        <TabsContent value="features">
          <ul className="grid gap-2 sm:grid-cols-2">
            {plan.features.map((feature) => (
              <li key={feature} className="border-b py-2">
                {feature}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="rooms">
          {plan.rooms?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2">Room</th>
                  <th>Width</th>
                  <th>Depth</th>
                  <th>Area</th>
                </tr>
              </thead>
              <tbody>
                {plan.rooms.map((room) => (
                  <tr key={room.id} className="border-b">
                    <td className="py-3">{room.name}</td>
                    <td>{room.width ? `${room.width}'` : "—"}</td>
                    <td>{room.depth ? `${room.depth}'` : "—"}</td>
                    <td>{room.area ? `${room.area} sq ft` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground">Room schedules are included in the purchased drawing set.</p>
          )}
        </TabsContent>
        <TabsContent value="included">
          <h2 className="font-display text-3xl">What&apos;s Included</h2>
          <div className="mt-4">
            <FileList items={plan.included_items} formats={plan.file_formats} />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Original files stay private until payment is complete. Downloads use time-limited signed URLs.
          </p>
        </TabsContent>
        <TabsContent value="notes">
          <p>{plan.delivery_information}</p>
          <p className="mt-4 text-muted-foreground">{plan.important_notes}</p>
        </TabsContent>
      </Tabs>

      <section className="mt-16">
        <h2 className="font-display text-4xl">Reviews</h2>
        <div className="mt-6 grid gap-4">
          {reviews.length ? reviews.map((review) => <ReviewCard key={review.id} review={review} />) : (
            <p className="text-muted-foreground">No reviews yet for this plan.</p>
          )}
        </div>
        <ReviewForm planId={plan.id} />
      </section>

      {related.length ? (
        <section className="mt-16">
          <h2 className="font-display text-4xl">Related plans</h2>
          <div className="mt-8">
            <PlanGrid plans={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
