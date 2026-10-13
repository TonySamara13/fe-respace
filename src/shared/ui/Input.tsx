import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/shared/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
};

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink transition-colors duration-150 placeholder:text-ink-tertiary focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none aria-invalid:border-error md:text-body",
        className,
      )}
      {...props}
    />
  );
}
