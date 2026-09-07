import { SignOutButton } from "@/components/auth/sign-out-button";

export default function SettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-3 text-muted-foreground">
        Password resets are sent by email. Google OAuth can be added from the same Supabase project later.
      </p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
