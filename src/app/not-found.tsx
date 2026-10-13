import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Deco } from "@/shared/ui/Deco";

export default function NotFound() {
  return (
    <section className="relative mx-auto max-w-form px-5 py-16 text-center">
      <Deco variant="lamp" className="absolute top-0 right-0 w-16" />
      <div className="relative z-10 rounded-card border border-line bg-surface px-8 py-12 shadow-card">
        <h1 className="font-display text-display-s font-medium lg:text-heading">Страница не найдена</h1>
        <p className="mt-3 text-ink-secondary">Такого адреса нет. Вернитесь на главную.</p>
        <Link
          href={routes.home}
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white"
        >
          На главную
        </Link>
      </div>
    </section>
  );
}
