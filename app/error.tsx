"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl">Something went wrong. Please try again.</h1>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
