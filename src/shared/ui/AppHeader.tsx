"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { routes } from "@/shared/config/routes";
import { readSessionUser } from "@/shared/lib/sessionUser";

import { Button } from "./Button";
import { TokenChip } from "./TokenChip";

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [user] = useState(() => readSessionUser());
  const balance = useGetTokenBalance({
    query: { enabled: Boolean(user) },
  });

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    window.location.assign(routes.home);
  }

  return (
    <header className="relative mx-auto flex w-full max-w-content items-center justify-between gap-4 px-5 py-5 lg:px-8">
      <Link href={routes.home} className="font-display text-title font-semibold text-ink">
        Interior Studio
      </Link>
      <nav className="hidden items-center gap-4 lg:flex" aria-label="Основное меню">
        {user ? (
          <>
            <Link href={routes.orders} className="text-body text-ink-secondary hover:text-ink">
              Мои заказы
            </Link>
            <span className="text-caption text-ink-tertiary">{user.email}</span>
            {balance.data ? (
              <TokenChip balance={balance.data.data.balance} generationCost={balance.data.data.generationCost} />
            ) : null}
            <Button variant="ghost" onClick={() => void logout()}>
              Выйти
            </Button>
            <Link
              href={routes.newOrder}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white hover:bg-accent-hover"
            >
              Новая комната
            </Link>
          </>
        ) : (
          <>
            <Link href={routes.login} className="text-body text-ink-secondary hover:text-ink">
              Войти
            </Link>
            <Link
              href={routes.newOrder}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white hover:bg-accent-hover"
            >
              Начать проект
            </Link>
          </>
        )}
      </nav>
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none lg:hidden"
        aria-expanded={open}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-20 z-20 mx-5 rounded-card border border-line bg-surface p-4 shadow-panel lg:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                {balance.data ? (
                  <TokenChip
                    balance={balance.data.data.balance}
                    generationCost={balance.data.data.generationCost}
                  />
                ) : null}
                <Link href={routes.orders} onClick={() => setOpen(false)}>
                  Мои заказы
                </Link>
                <Link href={routes.newOrder} onClick={() => setOpen(false)}>
                  Новая комната
                </Link>
                <button type="button" className="text-left" onClick={() => void logout()}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href={routes.login} onClick={() => setOpen(false)}>
                  Войти
                </Link>
                <Link href={routes.newOrder} onClick={() => setOpen(false)}>
                  Начать проект
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
