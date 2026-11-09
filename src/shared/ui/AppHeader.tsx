"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { routes } from "@/shared/config/routes";
import type { SessionUser } from "@/shared/config/session";
import { cn } from "@/shared/lib/cn";

import { TokenChip } from "./TokenChip";

const LANDING_LINKS = [
  { href: "/#ideas", label: "Идеи" },
  { href: "/#how", label: "Как это работает" },
  { href: "/#packs", label: "Тарифы" },
] as const;

const PILL =
  "inline-flex min-h-12 items-center rounded-full border border-cream/50 bg-night/60 px-4 text-small font-medium text-cream focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none";
const CREAM_CTA =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-cream px-6 text-small font-medium text-night focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none";

type AppHeaderProps = {
  user: SessionUser | null;
};

export function AppHeader({ user }: AppHeaderProps) {
  const [open, setOpen] = useState(false);
  const home = usePathname() === routes.home;
  const balance = useGetTokenBalance({
    query: { enabled: Boolean(user) },
  });

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    window.location.assign(routes.home);
  }

  return (
    <header className={cn("relative z-30 w-full", home && "absolute inset-x-0 top-0")}>
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4",
          home ? "px-4 py-4 lg:px-8" : "max-w-content px-4 py-4 lg:px-8",
        )}
      >
        <Link
          href={routes.home}
          className="font-display text-title font-medium text-cream"
        >
          Целла
        </Link>
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Основное меню">
          {user ? (
            <>
              <Link href={routes.orders} className={PILL}>
                Мои заказы
              </Link>
              {balance.data ? (
                <TokenChip
                  balance={balance.data.data.balance}
                  generationCost={balance.data.data.generationCost}
                />
              ) : null}
              <div className="border-cream/50 bg-night/60 flex h-12 max-w-72 items-center rounded-full border pr-2 pl-4">
                <span className="text-caption text-cream-dim min-w-0 truncate" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  className="text-small ml-2 inline-flex h-8 shrink-0 items-center rounded-full px-4 font-medium text-cream hover:bg-cream/10"
                  onClick={() => void logout()}
                >
                  Выйти
                </button>
              </div>
              <Link href={routes.newOrder} className={CREAM_CTA}>
                Новая комната
              </Link>
            </>
          ) : (
            <>
              {LANDING_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className={PILL}>
                  {item.label}
                </Link>
              ))}
              <Link href={routes.login} className={PILL}>
                Войти
              </Link>
              <Link href={routes.newOrder} className={CREAM_CTA}>
                Создать проект
              </Link>
            </>
          )}
        </nav>
        <button
          type="button"
          className="border-cream/50 text-cream focus-visible:ring-cream inline-flex size-12 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:outline-none lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
        </button>
      </div>
      {open ? (
        <div className="border-night-line bg-night text-cream absolute inset-x-4 top-full z-20 rounded-2xl border p-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <p className="text-caption text-cream-dim truncate">{user.email}</p>
                {balance.data ? (
                  <TokenChip
                    balance={balance.data.data.balance}
                    generationCost={balance.data.data.generationCost}
                  />
                ) : null}
                <Link href={routes.orders} className="inline-flex min-h-12 items-center" onClick={() => setOpen(false)}>
                  Мои заказы
                </Link>
                <button type="button" className="min-h-12 text-left" onClick={() => void logout()}>
                  Выйти
                </button>
                <Link href={routes.newOrder} className={cn(CREAM_CTA, "w-full")} onClick={() => setOpen(false)}>
                  Новая комната
                </Link>
              </>
            ) : (
              <>
                {LANDING_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-12 items-center"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href={routes.login} className="inline-flex min-h-12 items-center" onClick={() => setOpen(false)}>
                  Войти
                </Link>
                <Link href={routes.newOrder} className={cn(CREAM_CTA, "w-full")} onClick={() => setOpen(false)}>
                  Создать проект
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
