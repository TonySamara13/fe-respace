import { cn } from "@/shared/lib/cn";

type BadgeProps = {
  tone?: "neutral" | "green" | "error";
  children: string;
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-label",
        tone === "green" && "bg-accent-soft text-accent",
        tone === "error" && "bg-error-bg text-error",
        tone === "neutral" && "bg-canvas text-ink-secondary",
      )}
    >
      {children}
    </span>
  );
}
