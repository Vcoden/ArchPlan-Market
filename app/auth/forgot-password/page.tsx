"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      if (!isSupabaseConfigured()) throw new Error("Connect Supabase to reset passwords.");
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const email = String(formData.get("email") ?? "");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success("If that email exists, a reset link is on the way.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Reset password</h1>
      <form action={onSubmit} className="mt-8 grid gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-2" />
        </div>
        <Button type="submit" disabled={pending}>
          Send reset link
        </Button>
      </form>
    </div>
  );
}
