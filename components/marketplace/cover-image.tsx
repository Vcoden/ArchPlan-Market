"use client";

import Image from "next/image";
import { useState } from "react";

export function CoverImage({
  src,
  alt,
  sizes,
  priority,
  className = "object-cover",
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
        Preview coming soon
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
