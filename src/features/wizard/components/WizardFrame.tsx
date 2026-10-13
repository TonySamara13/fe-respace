import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type WizardFrameProps = {
  progress: ReactNode;
  title: string;
  lead: string;
  asideStart?: ReactNode;
  asideEnd?: ReactNode;
  wide?: boolean;
  children: ReactNode;
};

export function WizardFrame({
  progress,
  title,
  lead,
  asideStart,
  asideEnd,
  wide = false,
  children,
}: WizardFrameProps) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-wizard gap-8 px-5 pb-28 xl:items-start xl:gap-12 xl:px-8",
        wide
          ? "xl:grid-cols-[240px_minmax(0,880px)]"
          : "xl:grid-cols-[240px_minmax(0,640px)_240px]",
      )}
    >
      {asideStart ? (
        <aside className="hidden xl:block">
          {asideStart}
        </aside>
      ) : null}
      <section className="relative z-10 rounded-card border border-line bg-surface px-6 py-7 shadow-card lg:px-12 lg:pt-10 lg:pb-11">
        {progress}
        <h1 className="font-display text-display-s font-medium text-ink lg:text-heading">{title}</h1>
        <p className="mt-2 mb-6 text-caption text-ink-secondary">{lead}</p>
        {children}
      </section>
      {asideEnd ? <aside className="hidden xl:block">{asideEnd}</aside> : null}
      {asideStart ? (
        <details className="rounded-2xl border border-line bg-surface px-4 py-3 xl:hidden">
          <summary className="cursor-pointer text-small font-medium">Подсказки</summary>
          <div className="pt-4">{asideStart}</div>
        </details>
      ) : null}
    </div>
  );
}
