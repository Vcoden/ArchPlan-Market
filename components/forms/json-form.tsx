"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function JsonForm({
  action,
  children,
  success = "Saved.",
  redirectTo,
  extra,
  buttonLabel = "Save",
}: {
  action: string;
  children: React.ReactNode;
  success?: string;
  redirectTo?: string;
  extra?: Record<string, unknown>;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const form = new FormData(event.currentTarget);
      const payload = Object.fromEntries(form.entries());
      const response = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...extra }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      toast.success(success);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {children}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : buttonLabel}
      </Button>
    </form>
  );
}
