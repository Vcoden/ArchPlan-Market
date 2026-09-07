import { SignOutButton } from "@/components/auth/sign-out-button";

export default function ArchitectSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Seller settings</h1>
      <p className="mt-3 text-muted-foreground">Payout method and notification preferences.</p>
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
