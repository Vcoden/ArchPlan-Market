import { ArchitectCard } from "@/components/marketplace/architect-card";
import { createMetadata } from "@/lib/seo";
import { listArchitects } from "@/services/architects";

export const metadata = createMetadata({
  title: "Architects | ArchPlan Market",
  description: "Meet the architects publishing house plans on ArchPlan Market.",
  path: "/architects",
});

export default async function ArchitectsPage() {
  const architects = await listArchitects();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">Architects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Independent practices from around the world. Every seller is reviewed before they can publish.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {architects.map((architect) => (
          <ArchitectCard key={architect.id} architect={architect} />
        ))}
      </div>
    </div>
  );
}
