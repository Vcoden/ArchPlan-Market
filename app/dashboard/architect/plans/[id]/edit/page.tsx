import { PlanEditorForm } from "@/components/architect/plan-editor-form";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return (
    <div>
      <h1 className="font-display text-4xl">Edit plan</h1>
      <p className="mt-2 text-muted-foreground">You can only edit listings you own.</p>
      <div className="mt-8">
        <PlanEditorForm />
      </div>
    </div>
  );
}
