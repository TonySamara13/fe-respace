import type { ReactNode } from "react";

type LegalProseProps = {
  children: ReactNode;
};

export function LegalProse({ children }: LegalProseProps) {
  return (
    <article className="mx-auto max-w-form px-4 py-8 pb-16">
      <div className="space-y-6 text-body text-ink-secondary [&_h1]:font-display [&_h1]:text-display-s [&_h1]:font-medium [&_h1]:text-ink [&_h1]:lg:text-heading [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-title [&_h2]:font-medium [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:text-body [&_h3]:font-medium [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ol]:space-y-2 [&_ol]:pl-0 [&_p]:leading-relaxed [&_section+section]:mt-8 [&_ul]:space-y-2 [&_ul]:pl-0">
        {children}
      </div>
    </article>
  );
}
