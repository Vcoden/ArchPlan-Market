"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RowAction({
  action,
  body,
  label,
  variant = "outline",
  method = "POST",
}: {
  action: string;
  body: Record<string, unknown>;
  label: string;
  variant?: "outline" | "default" | "destructive";
  method?: "POST" | "PATCH";
}) {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant={variant}
      onClick={async () => {
        const response = await fetch(action, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const payload = await response.json();
        if (!response.ok) {
          toast.error(payload.error ?? "Something went wrong. Please try again.");
          return;
        }
        toast.success("Updated.");
        router.refresh();
      }}
    >
      {label}
    </Button>
  );
}
