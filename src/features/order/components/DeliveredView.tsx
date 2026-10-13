"use client";

import Link from "next/link";

import type { OrderDtoRs } from "@/shared/api/generated/model";
import { ResultKind } from "@/shared/api/generated/model";
import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { routes } from "@/shared/config/routes";
import { plural, tokensLabel } from "@/shared/lib/plural";
import { Badge } from "@/shared/ui/Badge";

type DeliveredViewProps = {
  order: OrderDtoRs;
};

export function DeliveredView({ order }: DeliveredViewProps) {
  const balance = useGetTokenBalance();
  const wallet = balance.data?.data;
  const roomsLeft =
    wallet && wallet.generationCost > 0 ? Math.floor(wallet.balance / wallet.generationCost) : 0;
  const title = [order.brief?.roomTypeName, order.brief?.stylePresetName].filter(Boolean).join(" · ");

  return (
    <section className="mx-auto max-w-content px-5 pb-16 lg:px-8">
      <Badge tone="green">Готово</Badge>
      <h1 className="mt-4 font-display text-display-s font-medium lg:text-heading">Ваш новый интерьер</h1>
      <p className="mt-2 text-caption text-ink-secondary">
        {title ? `${title} · ` : null}
        хранение 90 дней
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {order.results.map((result) => (
          <figure key={`${result.kind}-${result.position}`} className="overflow-hidden rounded-xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt={
                result.kind === ResultKind.PANORAMA
                  ? `Панорама ${result.position + 1}`
                  : `Вариант интерьера ${result.position + 1}`
              }
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="flex items-center justify-between px-1 py-2 text-caption">
              <span>{result.kind === ResultKind.PANORAMA ? "Панорама" : `Вариант ${result.position + 1}`}</span>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                Скачать
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Ещё одна комната?</p>
          {wallet ? (
            <p className="text-caption text-ink-secondary">
              На балансе {tokensLabel(wallet.balance)} — хватит на{" "}
              {roomsLeft} {plural(roomsLeft, { one: "комнату", few: "комнаты", many: "комнат" })}
            </p>
          ) : null}
        </div>
        <Link
          href={routes.newOrder}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white hover:bg-accent-hover"
        >
          Новая комната
        </Link>
      </div>
    </section>
  );
}
