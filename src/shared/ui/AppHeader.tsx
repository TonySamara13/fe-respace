"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { routes } from "@/shared/config/routes";
import type { SessionUser } from "@/shared/config/session";
import { cn } from "@/shared/lib/cn";

import { Button } from "./Button";
import { TokenChip } from "./TokenChip";

const LANDING_LINKS = [
  { href: "/#ideas", label: "Идеи" },
  { href: "/#how", label: "Как это работает" },
  { href: "/#packs", label: "Тарифы" },
] as const;

const PILL =
  "inline-flex min-h-11 items-center rounded-full border border-cream/50 bg-night/60 px-4 text-small font-semibold text-cream focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none";
const CREAM_CTA =
  "inline-flex min-h-11 items-center rounded-full bg-cream px-5 text-small font-semibold text-night focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none";

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
          home ? "px-5 py-4 lg:px-8" : "max-w-content px-5 py-5 lg:px-8",
        )}
      >
        <Link
          href={routes.home}
          className={cn(
            "font-display text-title font-semibold",
            home ? "text-cream drop-shadow-md" : "text-ink",
          )}
        >
          Целла
        </Link>
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Основное меню">
          {user ? (
            <>
              <Link href={routes.orders} className={home ? PILL : "text-body text-ink-secondary hover:text-ink"}>
                Мои заказы
              </Link>
              <span className={cn("text-caption", home ? "text-cream-dim" : "text-ink-tertiary")}>{user.email}</span>
              {balance.data ? (
                <TokenChip
                  balance={balance.data.data.balance}
                  generationCost={balance.data.data.generationCost}
                />
              ) : null}
              {home ? (
                <button type="button" className={PILL} onClick={() => void logout()}>
                  Выйти
                </button>
              ) : (
                <Button variant="ghost" onClick={() => void logout()}>
                  Выйти
                </Button>
              )}
              <Link href={routes.newOrder} className={home ? CREAM_CTA : "bg-accent text-body hover:bg-accent-hover inline-flex min-h-11 items-center rounded-full px-7 py-3 font-medium text-white"}>
                Новая комната
              </Link>
            </>
          ) : (
            <>
              {LANDING_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className={home ? PILL : "text-body text-ink-secondary hover:text-ink"}>
                  {item.label}
                </Link>
              ))}
              <Link href={routes.login} className={home ? PILL : "text-body text-ink-secondary hover:text-ink"}>
                Войти
              </Link>
              <Link
                href={routes.newOrder}
                className={
                  home
                    ? CREAM_CTA
                    : "bg-accent text-body hover:bg-accent-hover inline-flex min-h-11 items-center rounded-full px-7 py-3 font-medium text-white"
                }
              >
                Создать проект
              </Link>
            </>
          )}
        </nav>
        <button
          type="button"
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none lg:hidden",
            home
              ? "border-cream/50 text-cream focus-visible:ring-cream border"
              : "text-ink focus-visible:ring-accent",
          )}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
        </button>
      </div>
      {!user && !home ? (
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 px-5 lg:hidden" aria-label="Разделы страницы">
          {LANDING_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-small text-ink-secondary">
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
      {open ? (
        <div
          className={cn(
            "absolute inset-x-5 top-full z-20 rounded-2xl border p-4 lg:hidden",
            home ? "border-night-line bg-night text-cream" : "border-line bg-surface shadow-panel",
          )}
        >
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                {balance.data ? (
                  <TokenChip
                    balance={balance.data.data.balance}
                    generationCost={balance.data.data.generationCost}
                  />
                ) : null}
                <Link href={routes.orders} className="min-h-11 inline-flex items-center" onClick={() => setOpen(false)}>
                  Мои заказы
                </Link>
                <Link href={routes.newOrder} className="min-h-11 inline-flex items-center" onClick={() => setOpen(false)}>
                  Новая комната
                </Link>
                <button type="button" className="min-h-11 text-left" onClick={() => void logout()}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                {home
                  ? LANDING_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex min-h-11 items-center"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))
                  : null}
                <Link href={routes.login} className="inline-flex min-h-11 items-center" onClick={() => setOpen(false)}>
                  Войти
                </Link>
                <Link href={routes.newOrder} className={cn("inline-flex min-h-11 items-center", home && CREAM_CTA)} onClick={() => setOpen(false)}>
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
