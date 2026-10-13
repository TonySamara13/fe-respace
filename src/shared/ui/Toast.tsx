import { cn } from "@/shared/lib/cn";

type ToastProps = {
  variant?: "error" | "info";
  children: string;
};

export function Toast({ variant = "info", children }: ToastProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl px-4 py-3 text-small",
        variant === "error" ? "bg-error-bg text-error" : "border border-line bg-surface text-ink",
      )}
    >
      {children}
    </p>
  );
}
