import { Check } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "@/shared/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({ label, className, id, ref, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("flex min-h-11 cursor-pointer items-start gap-3", className)}>
      <span className="relative mt-0.5 size-5 shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="peer size-5 appearance-none rounded-sm border border-line-strong bg-surface checked:border-accent checked:bg-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none"
          {...props}
        />
        <Check
          size={14}
          strokeWidth={2}
          aria-hidden
          className="pointer-events-none absolute top-0.5 left-0.5 hidden text-white peer-checked:block"
        />
      </span>
      <span className="text-caption text-ink-secondary [&_a]:text-accent [&_a]:underline">{label}</span>
    </label>
  );
}
