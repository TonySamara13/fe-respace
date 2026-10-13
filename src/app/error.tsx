"use client";

import { Deco } from "@/shared/ui/Deco";
import { Button } from "@/shared/ui/Button";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="relative mx-auto max-w-form px-5 py-16 text-center">
      <Deco variant="plant" className="absolute bottom-0 left-0 w-24" />
      <div className="relative z-10 rounded-card border border-line bg-surface px-8 py-12 shadow-card">
        <h1 className="font-display text-display-s font-medium lg:text-heading">Что-то пошло не так</h1>
        <p className="mt-3 text-ink-secondary">Не удалось показать страницу. Попробуйте ещё раз.</p>
        <div className="mt-8 flex justify-center">
          <Button onClick={reset}>Повторить</Button>
        </div>
      </div>
    </section>
  );
}
