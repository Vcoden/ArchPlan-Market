"use client";

import { useState } from "react";
import { CoverImage } from "@/components/marketplace/cover-image";
import { cn } from "@/lib/utils";
import type { PlanMedia } from "@/types";

export function ImageGallery({ media, title }: { media: PlanMedia[]; title: string }) {
  const items = media.length
    ? media
    : [
        {
          id: "placeholder",
          plan_id: "",
          file_path: "",
          media_type: "main" as const,
          is_primary: true,
          alt: title,
          created_at: "",
        },
      ];
  const [active, setActive] = useState(items[0]);

  return (
    <div>
      <div className="image-frame relative aspect-[4/3] rounded-xl">
        <CoverImage
          src={active.file_path}
          alt={active.alt ?? title}
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
      {items.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className={cn(
                "image-frame relative aspect-[4/3] overflow-hidden rounded-lg border",
                active.id === item.id && "ring-2 ring-accent",
              )}
            >
              <CoverImage src={item.file_path} alt={item.alt ?? title} sizes="20vw" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
