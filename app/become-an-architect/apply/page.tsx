import { ArchitectApplyForm } from "@/components/architect/apply-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Architect Application | ArchPlan Market",
  description: "Apply to sell house plans on ArchPlan Market.",
  path: "/become-an-architect/apply",
});

export default function ArchitectApplyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl">Architect application</h1>
      <p className="mt-3 text-muted-foreground">
        Admin approval is required before you can publish plans. You can create an account first if
        you do not have one.
      </p>
      <div className="mt-8">
        <ArchitectApplyForm />
      </div>
    </div>
  );
}
