import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn("mb-4 flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-label font-medium text-ink-secondary">
        {label}
      </label>
      <div
        className="contents"
        {...(describedBy ? { "data-describedby": describedBy } : {})}
      >
        {children}
      </div>
      {error ? (
        <p id={`${htmlFor}-error`} className="text-caption text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-caption text-ink-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
