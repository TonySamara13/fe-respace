import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { tokensLabel } from "@/shared/lib/plural";

type TokenChipProps = {
  balance: number;
  generationCost: number;
};

export function TokenChip({ balance, generationCost }: TokenChipProps) {
  const low = balance < generationCost;
  return (
    <Link
      href={routes.tokens}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border bg-surface px-3 text-small font-medium text-ink transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
        low ? "border-warning-border bg-warning-bg" : "border-line",
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-label font-semibold text-white",
          low ? "bg-warning" : "bg-accent",
        )}
        aria-hidden
      >
        T
      </span>
      <span className="tabular-nums">{tokensLabel(balance)}</span>
    </Link>
  );
}
