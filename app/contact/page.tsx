import { ContactForm } from "@/components/forms/contact-form";
import { brand } from "@/lib/brand";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `Contact | ${brand.name}`,
  description: "Contact ArchPlan Market support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-5xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">Write to {brand.supportEmail} or use the form below.</p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
