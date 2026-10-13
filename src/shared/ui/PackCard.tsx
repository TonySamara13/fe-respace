import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { formatRub } from "@/shared/lib/format";
import type { PackPresentation } from "@/shared/lib/packPresentation";

type PackCardProps = {
  tokens: number;
  price: number | string;
  presentation: PackPresentation;
  selected?: boolean;
  actionLabel: string;
  onSelect?: () => void;
  href?: string;
};

export function PackCard({
  tokens,
  price,
  presentation,
  selected = false,
  actionLabel,
  onSelect,
  href,
}: PackCardProps) {
  const actionClass = cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full px-7 py-3 text-body font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
    selected
      ? "bg-accent text-white hover:bg-accent-hover"
      : "border border-line-strong text-ink hover:bg-canvas",
  );

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-card border bg-surface px-6 py-7 shadow-card md:px-8 md:pt-9 md:pb-8",
        selected ? "border-2 border-accent" : "border-line",
      )}
    >
      {presentation.ribbon ? (
        <span
          className={cn(
            "absolute top-0 left-6 -translate-y-1/2 rounded-full px-3 py-1 text-micro tracking-wide uppercase",
            presentation.ribbon.tone === "ink" ? "bg-ink text-white" : "bg-accent text-white",
          )}
        >
          {presentation.ribbon.label}
        </span>
      ) : null}
      <div className="flex items-end justify-between gap-4 md:block">
        <p className="font-display text-display-xl leading-none font-semibold lining-nums text-ink">
          {tokens}
          <span className="ml-2 font-sans text-body font-normal">токенов</span>
        </p>
        <p className="text-price font-semibold text-ink tabular-nums md:mt-3">{formatRub(price)}</p>
      </div>
      <p className="mt-1 text-caption text-ink-tertiary">{presentation.perRoom}</p>
      <ul className="my-5 space-y-2 text-small text-ink-secondary">
        {presentation.points.map((point) => (
          <li key={point} className="before:mr-2 before:text-accent before:content-['—']">
            {point}
          </li>
        ))}
      </ul>
      {href ? (
        <Link href={href} className={cn(actionClass, "mt-auto")}>
          {actionLabel}
        </Link>
      ) : (
        <button type="button" onClick={onSelect} className={cn(actionClass, "mt-auto")}>
          {actionLabel}
        </button>
      )}
    </article>
  );
}
