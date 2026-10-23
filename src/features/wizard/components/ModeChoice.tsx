"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OrderMode } from "@/shared/api/generated/model";
import { useCreateOrder } from "@/shared/api/generated/orders/orders";
import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { tokensLabel } from "@/shared/lib/plural";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";
import { EmailNotVerified } from "@/features/auth";
import { Toast } from "@/shared/ui/Toast";

const EXAMPLES = [
  "Поменять пол",
  "Перекрасить стены",
  "Добавить диван или кресло",
  "Заменить шторы",
  "Убрать лишнюю мебель",
  "Повесить светильник",
  "Добавить растения",
];

export function ModeChoice() {
  const [mode, setMode] = useState<typeof OrderMode.REDESIGN | typeof OrderMode.EDIT>(OrderMode.EDIT);
  const [unverified, setUnverified] = useState(false);
  const [error, setError] = useState<string>();
  const create = useCreateOrder();
  const balance = useGetTokenBalance();
  const router = useRouter();
  const cost = balance.data?.data.generationCost;

  async function continueWithMode() {
    setError(undefined);
    try {
      const created = await create.mutateAsync({ data: { mode } });
      router.push(routes.order(created.data.id));
    } catch (cause) {
      if (isApiError(cause, "email_not_verified")) {
        setUnverified(true);
        return;
      }
      setError(isApiError(cause) ? cause.detail : "Не удалось создать заказ");
    }
  }

  if (unverified) return <EmailNotVerified />;

  return (
    <div className="mx-auto max-w-content px-5 pb-16 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-label font-medium tracking-wide text-accent uppercase">Новая комната</p>
        <h1 className="font-display text-display-s font-medium lg:text-heading">Что хотите сделать?</h1>
        <p className="mt-3 text-ink-secondary">Полностью переосмыслить интерьер или поменять одну деталь на фото</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ModeCard
          selected={mode === OrderMode.REDESIGN}
          onSelect={() => setMode(OrderMode.REDESIGN)}
          title="Новый дизайн комнаты"
          lead="Загрузите 1–7 фото — предложим интерьер целиком: мебель, отделку, свет."
          items={[
            "Тип комнаты, стиль и пожелания своими словами",
            "Сохраним планировку, окна и двери",
            "Подходит для ремонта с нуля",
          ]}
          pill="3 варианта в выбранном стиле"
          mediaClass="from-muted to-accent-soft"
          cost={cost}
        />
        <ModeCard
          selected={mode === OrderMode.EDIT}
          onSelect={() => setMode(OrderMode.EDIT)}
          title="Точечная правка"
          lead="Одно фото и одна задача: поменять пол, добавить кресло, перекрасить стены."
          items={[
            "Выделите кистью, что меняем, и опишите словами",
            "Всё остальное на фото останется как есть",
            "Можно приложить фото-пример материала или мебели",
          ]}
          pill="Пол → светлый дуб"
          mediaClass="from-muted to-warning-bg"
          overlay
          cost={cost}
        />
      </div>
      <div className="mt-10 text-center">
        <p className="mb-3 text-caption text-ink-tertiary">Например, точечно можно</p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((item) => (
            <span key={item} className="rounded-full bg-surface px-4 py-2 text-small text-ink">
              {item}
            </span>
          ))}
        </div>
      </div>
      {error ? (
        <div className="mx-auto mt-8 max-w-form">
          <Toast variant="error">{error}</Toast>
        </div>
      ) : null}
      <div className="mt-10 flex justify-center">
        <Button onClick={() => void continueWithMode()} loading={create.isPending}>
          {mode === OrderMode.EDIT ? "Продолжить — точечная правка" : "Продолжить — новый дизайн"}
        </Button>
      </div>
    </div>
  );
}

function ModeCard({
  selected,
  onSelect,
  title,
  lead,
  items,
  pill,
  mediaClass,
  overlay = false,
  cost,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  lead: string;
  items: string[];
  pill: string;
  mediaClass: string;
  overlay?: boolean;
  cost?: number;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-card border bg-surface text-left shadow-card transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        selected ? "border-accent" : "border-line hover:border-line-strong",
      )}
    >
      <span className={cn("relative block aspect-[16/10] overflow-hidden rounded-t-card bg-linear-to-br", mediaClass)}>
        {overlay ? (
          <span className="absolute inset-x-[10%] bottom-0 h-1/3 rounded-tl-3xl bg-accent/40" aria-hidden />
        ) : null}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-surface/90 px-3 py-1 text-caption">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          {pill}
        </span>
      </span>
      <span className="block px-6 py-5">
        <span className="flex items-start justify-between gap-3">
          <span className="font-display text-title font-medium">{title}</span>
          <span
            className={cn(
              "mt-1 size-5 shrink-0 rounded-full border",
              selected ? "border-accent bg-accent" : "border-line-strong",
            )}
            aria-hidden
          />
        </span>
        <span className="mt-2 block text-small text-ink-secondary">{lead}</span>
        <ul className="mt-4 space-y-1.5 text-caption text-ink-secondary">
          {items.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <span className="mt-5 flex flex-wrap gap-2">
          {cost !== undefined ? <Badge tone="green">{tokensLabel(cost)}</Badge> : null}
          <Badge>3 варианта</Badge>
          <Badge>~15 минут</Badge>
        </span>
      </span>
    </button>
  );
}
