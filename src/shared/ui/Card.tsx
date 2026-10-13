import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  featured?: boolean;
};

export function Card({ featured = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border bg-surface p-8 shadow-card",
        featured ? "border-accent" : "border-line",
        className,
      )}
      {...props}
    />
  );
}
