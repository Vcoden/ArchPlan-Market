"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ planId }: { planId: string }) {
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          rating: Number(formData.get("rating")),
          title: formData.get("title"),
          content: formData.get("content"),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      toast.success("Review published.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="mt-6 grid gap-3 rounded-xl border bg-card p-5">
      <h3 className="font-display text-2xl">Write a review</h3>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="title">Review title</Label>
        <Input id="title" name="title" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="content">Review</Label>
        <Textarea id="content" name="content" required minLength={20} className="mt-2" />
      </div>
      <Button type="submit" disabled={pending}>
        Submit review
      </Button>
    </form>
  );
}
