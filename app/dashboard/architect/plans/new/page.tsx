import { PlanEditorForm } from "@/components/architect/plan-editor-form";

export default function NewPlanPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Add house plan</h1>
      <p className="mt-2 text-muted-foreground">
        Preview images can be watermarked. Downloadable CAD and PDF files are stored privately.
      </p>
      <div className="mt-8">
        <PlanEditorForm />
      </div>
    </div>
  );
}
