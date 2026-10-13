import { AlertCircle, Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type NoticeProps = {
  variant?: "warning" | "error" | "info";
  title: string;
  children?: ReactNode;
};

export function Notice({ variant = "warning", title, children }: NoticeProps) {
  const Icon = variant === "info" ? Info : AlertCircle;
  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl border px-6 py-4",
        variant === "warning" && "border-warning-border bg-warning-bg",
        variant === "error" && "border-error bg-error-bg",
        variant === "info" && "border-line bg-surface",
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink">
        <Icon strokeWidth={1.5} size={20} aria-hidden />
      </span>
      <div>
        <p className="text-body font-medium text-ink">{title}</p>
        {children ? <div className="mt-1 text-small text-ink-secondary">{children}</div> : null}
      </div>
    </div>
  );
}
