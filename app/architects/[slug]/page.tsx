import { notFound } from "next/navigation";
import { ArchitectAvatar } from "@/components/marketplace/architect-avatar";
import { PlanGrid } from "@/components/marketplace/plan-grid";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { Badge } from "@/components/ui/badge";
import { brand } from "@/lib/brand";
import { createMetadata } from "@/lib/seo";
import { getArchitectBySlug, getArchitectPlans } from "@/services/architects";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const architect = await getArchitectBySlug(slug);
  return createMetadata({
    title: architect ? `${architect.professional_name} | ${brand.name}` : "Architect",
    description: architect?.biography ?? "Architect profile",
    path: `/architects/${slug}`,
  });
}

export default async function ArchitectProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const architect = await getArchitectBySlug(slug);
  if (!architect) notFound();
  const plans = await getArchitectPlans(architect.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border bg-card p-6">
          <ArchitectAvatar name={architect.professional_name} src={architect.avatar_url} size="lg" />
          <h1 className="mt-4 font-display text-3xl">{architect.professional_name}</h1>
          <p className="text-muted-foreground">{architect.title}</p>
          <p className="mt-2 text-sm">{architect.location}</p>
          <div className="mt-4">
            <RatingStars rating={architect.rating ?? 0} />
          </div>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Experience</dt>
              <dd>{architect.years_experience} years</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plans</dt>
              <dd>{architect.plan_count ?? plans.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sales</dt>
              <dd>{architect.sales_count ?? 0}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {architect.specializations.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-sm">
            {architect.website ? (
              <a href={architect.website} className="block text-accent">
                Website
              </a>
            ) : null}
            {architect.instagram ? (
              <a href={architect.instagram} className="block text-accent">
                Instagram
              </a>
            ) : null}
          </div>
        </aside>
        <div>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">{architect.biography}</p>
          <h2 className="mt-12 font-display text-4xl">House Plans by this Architect</h2>
          <div className="mt-8">
            {plans.length ? (
              <PlanGrid plans={plans} />
            ) : (
              <p className="text-muted-foreground">This architect has not published any plans yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
