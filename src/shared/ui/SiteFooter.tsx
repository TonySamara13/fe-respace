import Link from "next/link";

import { routes } from "@/shared/config/routes";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-content px-5 py-8 text-caption text-ink-tertiary lg:px-8">
      <nav className="flex flex-wrap gap-x-3 gap-y-2" aria-label="Юридическая информация">
        <Link href={routes.offer} className="underline-offset-2 hover:underline">
          Оферта
        </Link>
        <span aria-hidden>·</span>
        <Link href={routes.privacy} className="underline-offset-2 hover:underline">
          Политика ПДн
        </Link>
        <span aria-hidden>·</span>
        <Link href={routes.requisites} className="underline-offset-2 hover:underline">
          Реквизиты ИП
        </Link>
      </nav>
    </footer>
  );
}
