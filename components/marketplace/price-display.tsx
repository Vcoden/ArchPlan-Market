import { cn, formatCurrency } from "@/lib/utils";

export function PriceDisplay({
  amount,
  className,
  size = "md",
}: {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "font-medium tracking-tight",
        size === "sm" && "text-sm",
        size === "md" && "text-lg",
        size === "lg" && "font-display text-4xl",
        className,
      )}
    >
      {formatCurrency(amount)}
    </span>
  );
}
