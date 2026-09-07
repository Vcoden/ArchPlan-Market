import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create account | ArchPlan Market",
  description: "Create a homeowner or architect account.",
  path: "/auth/sign-up",
});

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Create an account</h1>
      <div className="mt-8">
        <AuthForm mode="sign-up" />
      </div>
    </div>
  );
}
