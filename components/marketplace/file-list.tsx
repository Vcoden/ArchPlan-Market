import { Check } from "lucide-react";
import { PLAN_FILE_TYPES } from "@/lib/constants";
import type { PlanFileType } from "@/types";

export function FileList({
  items,
  formats,
}: {
  items: string[];
  formats?: PlanFileType[];
}) {
  return (
    <div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 text-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {formats?.length ? (
        <p className="mt-4 text-sm text-muted-foreground">
          File formats:{" "}
          {formats
            .map((format) => PLAN_FILE_TYPES.find((item) => item.value === format)?.label ?? format)
            .join(", ")}
        </p>
      ) : null}
    </div>
  );
}
