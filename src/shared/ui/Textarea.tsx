import type { Ref, TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: Ref<HTMLTextAreaElement>;
};

export function Textarea({ className, ref, ...props }: TextareaProps) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-lg border border-line bg-surface px-4 py-3 text-base text-ink transition-colors duration-150 placeholder:text-ink-tertiary focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none aria-invalid:border-error md:text-body",
        className,
      )}
      {...props}
    />
  );
}
