import type { ReactNode } from "react";

import { Deco } from "@/shared/ui/Deco";
import { Polaroid } from "@/shared/ui/Polaroid";
import { TrustStrip } from "@/shared/ui/TrustStrip";

type AuthShellProps = {
  title: string;
  lead: ReactNode;
  children: ReactNode;
  trust?: string[];
  showPolaroids?: boolean;
};

export function AuthShell({ title, lead, children, trust, showPolaroids = false }: AuthShellProps) {
  return (
    <section className="relative mx-auto flex w-full max-w-content flex-col items-center px-5 pb-16 lg:px-8">
      <Deco variant="lamp" className="absolute top-0 right-[12%] w-16" />
      <Deco variant="plant" className="absolute bottom-8 left-[6%] w-28" />
      <div className="relative flex w-full items-center justify-center gap-10">
        {showPolaroids ? (
          <Polaroid
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80"
            tag="До"
            caption="Ваше фото"
            rotate="left"
          />
        ) : null}
        <div className="relative z-10 w-full max-w-auth rounded-card border border-line bg-surface px-6 py-8 shadow-panel lg:px-8">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-accent-soft font-display text-title font-semibold text-accent">
            I
          </div>
          <h1 className="mb-2 font-display text-display-s font-medium text-ink lg:text-heading">{title}</h1>
          <p className="mb-6 text-caption text-ink-secondary">{lead}</p>
          {children}
        </div>
        {showPolaroids ? (
          <Polaroid
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80"
            tag="После"
            caption="Сканди"
            rotate="right"
          />
        ) : null}
      </div>
      {trust ? <TrustStrip items={trust} /> : null}
    </section>
  );
}
