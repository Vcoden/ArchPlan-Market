"use client";

import { JsonForm } from "@/components/forms/json-form";
import { Textarea } from "@/components/ui/textarea";

export function ReviewResponseForm({ reviewId }: { reviewId: string }) {
  return (
    <JsonForm
      action={`/api/reviews/${reviewId}/respond`}
      success="Response published."
      buttonLabel="Send response"
    >
      <Textarea name="response" placeholder="Respond to this review" required />
    </JsonForm>
  );
}
