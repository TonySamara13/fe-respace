import { Check } from "lucide-react";

import { cn } from "@/shared/lib/cn";

const REDESIGN_STEPS = ["Бриф", "Фото", "Генерация"] as const;

type WizardProgressProps = {
  activeIndex: number;
  steps?: readonly string[];
};

export function WizardProgress({ activeIndex, steps = REDESIGN_STEPS }: WizardProgressProps) {
  return (
    <p className="mb-6 text-small text-ink-tertiary">
      {steps.map((step, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <span key={step}>
            {index > 0 ? " → " : null}
            <span className={cn(active && "font-medium text-accent", done && "text-accent")}>
              {step}
              {done ? (
                <Check className="ml-1 inline size-4" strokeWidth={1.5} aria-hidden />
              ) : null}
            </span>
          </span>
        );
      })}
    </p>
  );
}
