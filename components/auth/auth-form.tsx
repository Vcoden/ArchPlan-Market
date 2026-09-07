"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function AuthForm({
  mode,
  nextPath = "/dashboard",
}: {
  mode: "sign-in" | "sign-up";
  nextPath?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      if (isSupabaseConfigured()) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        if (mode === "sign-in") {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          router.push(nextPath);
          router.refresh();
          return;
        }
        const fullName = String(formData.get("fullName") ?? "");
        const intent = String(formData.get("intent") ?? "homeowner");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: intent === "architect" ? "architect" : "homeowner" },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
        router.push(intent === "architect" ? "/become-an-architect/apply" : nextPath);
        return;
      }

      const response = await fetch(mode === "sign-in" ? "/api/auth/sign-in" : "/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: formData.get("fullName"),
          intent: formData.get("intent") ?? "homeowner",
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      toast.success(mode === "sign-in" ? "Signed in." : "Account created.");
      router.push(payload.next ?? nextPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="grid gap-4">
      {mode === "sign-up" ? (
        <>
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required className="mt-2" />
          </div>
          <fieldset className="grid gap-3 rounded-xl border p-4">
            <legend className="px-1 text-sm">I am here to</legend>
            <label className="flex items-start gap-3 text-sm">
              <input type="radio" name="intent" value="homeowner" defaultChecked />
              <span>
                <strong>I&apos;m looking for a house plan</strong>
                <br />
                Browse, save, and purchase designs.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input type="radio" name="intent" value="architect" />
              <span>
                <strong>I&apos;m an architect and want to sell plans</strong>
                <br />
                Your profile still requires admin approval before publishing.
              </span>
            </label>
          </fieldset>
        </>
      ) : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} className="mt-2" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
      </Button>
      {mode === "sign-in" ? (
        <p className="text-center text-xs text-muted-foreground">
          Local admin: admin@archplan.market / Admin1234!
        </p>
      ) : null}
      <p className="text-center text-sm text-muted-foreground">
        {mode === "sign-in" ? (
          <>
            No account? <Link href="/auth/sign-up" className="text-foreground underline">Sign up</Link>
            {" · "}
            <Link href="/auth/forgot-password" className="underline">Forgot password</Link>
          </>
        ) : (
          <>
            Already registered? <Link href="/auth/sign-in" className="text-foreground underline">Sign in</Link>
          </>
        )}
      </p>
    </form>
  );
}
