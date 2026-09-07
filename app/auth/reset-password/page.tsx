"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function ResetPasswordPage() {
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      if (!isSupabaseConfigured()) throw new Error("Connect Supabase to update passwords.");
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const password = String(formData.get("password") ?? "");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Set a new password</h1>
      <form action={onSubmit} className="mt-8 grid gap-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" minLength={8} required className="mt-2" />
        </div>
        <Button type="submit" disabled={pending}>
          Update password
        </Button>
      </form>
    </div>
  );
}
