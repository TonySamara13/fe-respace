"use client";

import Link from "next/link";
import { useState } from "react";

import { useListOrders } from "@/shared/api/generated/history/history";
import { routes } from "@/shared/config/routes";
import { formatDate } from "@/shared/lib/date";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { statusBadge } from "@/features/order";

const PAGE_SIZE = 20;

export function OrderHistory() {
  const [page, setPage] = useState(0);
  const query = useListOrders({ page, size: PAGE_SIZE });
  const data = query.data?.data;

  if (query.isLoading) {
    return <div className="mx-auto h-64 max-w-form animate-pulse rounded-card bg-muted" />;
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="mx-auto max-w-form px-5 py-8 text-center">
        <h1 className="font-display text-display-s font-medium lg:text-heading">Мои заказы</h1>
        <p className="mt-3 text-ink-secondary">Пока нет заказов. Создайте первую комнату.</p>
        <Link
          href={routes.newOrder}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white"
        >
          Новая комната
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-form px-5 py-8">
      <h1 className="font-display text-display-s font-medium lg:text-heading">Мои заказы</h1>
      <ul className="mt-8 rounded-card border border-line bg-surface px-6">
        {data.items.map((item) => {
          const badge = statusBadge(item.status);
          return (
            <li key={item.id} className="border-b border-line py-4 last:border-b-0">
              <Link href={routes.order(item.id)} className="flex items-center justify-between gap-4">
                <span>
                  <span className="block font-medium">{item.message}</span>
                  <span className="text-caption text-ink-tertiary">{formatDate(item.createdAt)}</span>
                </span>
                <Badge tone={badge.tone}>{badge.label}</Badge>
              </Link>
            </li>
          );
        })}
      </ul>
      {data.totalPages > 1 ? (
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
            Назад
          </Button>
          <Button variant="ghost" disabled={page + 1 >= data.totalPages} onClick={() => setPage((value) => value + 1)}>
            Дальше
          </Button>
        </div>
      ) : null}
    </div>
  );
}
