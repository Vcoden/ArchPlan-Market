import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ArchitectAvatar({
  name,
  src,
  size = "sm",
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Avatar
      className={cn(
        size === "sm" && "size-7",
        size === "md" && "size-10",
        size === "lg" && "size-16",
      )}
    >
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback name={name} />
    </Avatar>
  );
}
