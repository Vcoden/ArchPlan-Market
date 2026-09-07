"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

export function AccountLinks() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.json())
      .then((payload) => setProfile(payload.profile ?? null))
      .catch(() => setProfile(null));
  }, []);

  if (profile === undefined) {
    return (
      <Button asChild variant="ghost" className="hidden sm:inline-flex">
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    );
  }

  if (!profile) {
    return (
      <Button asChild variant="ghost" className="hidden sm:inline-flex">
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" className="hidden sm:inline-flex">
      <Link href={profile.role === "admin" ? "/admin" : "/dashboard"}>
        {profile.full_name || "Account"}
      </Link>
    </Button>
  );
}
