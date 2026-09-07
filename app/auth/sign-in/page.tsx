import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Sign in | ArchPlan Market",
  description: "Sign in to purchase plans or manage your architect listings.",
  path: "/auth/sign-in",
});

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Sign in</h1>
      {error === "suspended" ? (
        <p className="mt-3 text-sm text-destructive">This account has been suspended.</p>
      ) : null}
      <div className="mt-8">
        <AuthForm mode="sign-in" nextPath={next ?? "/dashboard"} />
      </div>
    </div>
  );
}
