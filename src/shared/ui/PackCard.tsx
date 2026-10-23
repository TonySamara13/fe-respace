import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { formatRub } from "@/shared/lib/format";
import type { PackPresentation } from "@/shared/lib/packPresentation";

type PackCardProps = {
  tokens: number;
  price: number | string;
  presentation: PackPresentation;
  selected?: boolean;
  /** На лендинге карточка без цены за комнату и списка. */
  showDetails?: boolean;
  emphasized?: boolean;
  actionLabel: string;
  onSelect?: () => void;
  href?: string;
};

export function PackCard({
  tokens,
  price,
  presentation,
  selected = false,
  showDetails = true,
  emphasized = false,
  actionLabel,
  onSelect,
  href,
}: PackCardProps) {
  const actionClass = cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full px-7 py-3 text-body font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none",
    selected || emphasized
      ? "bg-accent text-white hover:bg-accent-hover"
      : "border border-line-strong text-ink hover:bg-canvas",
  );

  return (
    <article
      className={cn(
        "rounded-card bg-surface shadow-card relative flex flex-col border px-6 py-7 md:px-8 md:pt-9 md:pb-8",
        selected ? "border-accent border-2" : "border-line",
      )}
    >
      {presentation.ribbon ? (
        <span
          className={cn(
            "text-micro absolute top-0 left-6 -translate-y-1/2 rounded-full px-3 py-1 tracking-wide uppercase",
            presentation.ribbon.tone === "ink" ? "bg-ink text-white" : "bg-accent text-white",
          )}
        >
          {presentation.ribbon.label}
        </span>
      ) : null}
      <div className="flex items-end justify-between gap-4 md:block">
        <p className="font-display text-display-xl text-ink leading-none font-semibold lining-nums">
          {tokens}
          <span className="text-body ml-2 font-sans font-normal">токенов</span>
        </p>
        <p className="text-price text-ink font-semibold tabular-nums md:mt-3">{formatRub(price)}</p>
      </div>
      {showDetails ? (
        <>
          <p className="text-caption text-ink-tertiary mt-1">{presentation.perRoom}</p>
          <ul className="text-small text-ink-secondary my-5 space-y-2">
            {presentation.points.map((point) => (
              <li key={point} className="before:text-accent before:mr-2 before:content-['—']">
                {point}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {href ? (
        <Link href={href} className={cn(actionClass, showDetails ? "mt-auto" : "mt-6")}>
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className={cn(actionClass, showDetails ? "mt-auto" : "mt-6")}
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
}
