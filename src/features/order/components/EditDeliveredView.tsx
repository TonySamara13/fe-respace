"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ResultKind, type OrderDtoRs } from "@/shared/api/generated/model";
import { useCreateOrder } from "@/shared/api/generated/orders/orders";
import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { tokensLabel } from "@/shared/lib/plural";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";

import { editAreaLabel } from "@/features/wizard";

import { CompareSlider } from "./CompareSlider";

type EditDeliveredViewProps = {
  order: OrderDtoRs;
};

export function EditDeliveredView({ order }: EditDeliveredViewProps) {
  const images = useMemo(
    () => order.results.filter((item) => item.kind === ResultKind.IMAGE).sort((a, b) => a.position - b.position),
    [order.results],
  );
  const original = order.results.find((item) => item.kind === ResultKind.ORIGINAL);
  const [selectedId, setSelectedId] = useState(images[0]?.id);
  const selected = images.find((item) => item.id === selectedId) ?? images[0];
  const balance = useGetTokenBalance();
  const create = useCreateOrder();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const wallet = balance.data?.data;
  const request = order.editRequest;

  async function startAnotherEdit() {
    if (!selected) return;
    setError(undefined);
    try {
      const created = await create.mutateAsync({
        data: { mode: "EDIT", sourceResultId: selected.id },
      });
      router.push(routes.order(created.data.id));
    } catch (cause) {
      setError(isApiError(cause) ? cause.detail : "Не удалось начать новую правку");
    }
  }

  return (
    <section className="mx-auto max-w-content px-5 pb-16 lg:px-8">
      <Link href={routes.orders} className="text-caption text-ink-secondary">
        ← Мои заказы
      </Link>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-s font-medium lg:text-heading">Правка готова</h1>
          <p className="mt-1.5 text-caption text-ink-secondary">Точечная правка · 3 варианта · храним 90 дней</p>
        </div>
        <Badge tone="green">Готово</Badge>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)]">
        <div>
          {selected && original ? (
            <CompareSlider beforeUrl={original.url} afterUrl={selected.url} />
          ) : selected ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.url} alt="Результат правки" className="w-full rounded-xl" />
          ) : null}
        </div>
        <div>
          {request ? (
            <blockquote className="rounded-2xl bg-canvas px-5 py-4">
              <p className="text-label font-medium tracking-wide text-ink-tertiary uppercase">
                Ваш запрос · {editAreaLabel(request.area).toLowerCase()}
              </p>
              <p className="mt-2 text-body">{request.instruction}</p>
            </blockquote>
          ) : null}
          <p className="mt-7 mb-3 text-label font-medium tracking-wide text-ink-tertiary uppercase">Варианты</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                  selected?.id === item.id ? "border-accent" : "border-transparent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={`Вариант ${index + 1}`} className="aspect-square w-full object-cover" />
                <span
                  className={cn(
                    "block py-1.5 text-center text-caption",
                    selected?.id === item.id ? "font-medium text-accent" : "text-ink-secondary",
                  )}
                >
                  Вариант {index + 1}
                </span>
              </button>
            ))}
          </div>
          {selected ? (
            <div className="mt-7 grid gap-3">
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white hover:bg-accent-hover"
              >
                Скачать вариант {(selected.position ?? 0) + 1} · JPEG
              </a>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {images.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-small text-ink-secondary underline"
                  >
                    Скачать вариант {index + 1}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-7 rounded-card border border-line bg-surface p-6">
            <p className="font-medium">Поправить что-то ещё?</p>
            <p className="mt-1 text-caption text-ink-secondary">
              Новая правка начнётся с выбранного варианта
              {wallet ? ` · ${tokensLabel(wallet.generationCost)}, на балансе ${wallet.balance}` : null}.
            </p>
            <Button
              variant="ghost"
              className="mt-4"
              loading={create.isPending}
              disabled={!selected}
              onClick={() => void startAnotherEdit()}
            >
              Ещё правка этого фото
            </Button>
            {error ? <p className="mt-2 text-caption text-error">{error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
