"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

function AvatarFallback({
  name,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { name?: string }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn("flex size-full items-center justify-center bg-secondary text-xs font-medium", className)}
      {...props}
    >
      {name ? getInitials(name) : props.children}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
