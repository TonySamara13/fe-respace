"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { legalEntity } from "@/shared/config/legalEntity";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";

export function SiteFooter() {
  const home = usePathname() === routes.home;

  return (
    <footer
      className={cn(
        "w-full px-4 py-8 text-caption text-ink-tertiary lg:px-8",
        home ? "max-w-none" : "mx-auto max-w-content",
      )}
    >
      <p className="mb-4">
        {legalEntity.ipShortName} · ИНН {legalEntity.inn} · ОГРНИП {legalEntity.ogrnip} ·{" "}
        <a href={`mailto:${legalEntity.email}`} className="underline-offset-2 hover:underline">
          {legalEntity.email}
        </a>
      </p>
      <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Юридическая информация">
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
