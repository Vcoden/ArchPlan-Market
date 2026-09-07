"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ArchitectApplyForm() {
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      const response = await fetch("/api/architects/apply", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to submit application.");
      toast.success("Application received. An editor will review your profile.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="fullName" label="Full name" required />
        <Field name="professionalName" label="Professional name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="country" label="Country" required />
        <Field name="location" label="Location" required />
        <Field name="title" label="Professional title" required />
        <Field name="yearsExperience" label="Years of experience" type="number" required />
        <Field name="specializations" label="Areas of expertise" placeholder="Modern, Luxury, Duplex" required />
      </div>
      <div>
        <Label htmlFor="biography">Biography</Label>
        <Textarea id="biography" name="biography" required minLength={40} className="mt-2" />
      </div>
      <Field name="website" label="Website" />
      <Field name="portfolioUrl" label="Portfolio" />
      <Field name="instagram" label="Instagram" />
      <Field name="linkedin" label="LinkedIn" />
      <div>
        <Label htmlFor="avatar">Profile image</Label>
        <Input id="avatar" name="avatar" type="file" accept="image/*" className="mt-2" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} className="mt-2" />
    </div>
  );
}
