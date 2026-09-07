"use client";

import { JsonForm } from "@/components/forms/json-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <JsonForm action="/api/contact" success="Message received. We will reply by email." buttonLabel="Send message">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required className="mt-2" />
      </div>
    </JsonForm>
  );
}
