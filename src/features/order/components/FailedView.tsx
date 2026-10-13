import Link from "next/link";

import type { OrderDtoRs } from "@/shared/api/generated/model";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/Badge";
import { Toast } from "@/shared/ui/Toast";

type FailedViewProps = {
  order: OrderDtoRs;
};

export function FailedView({ order }: FailedViewProps) {
  return (
    <section className="mx-auto max-w-form rounded-card border border-line bg-surface px-6 py-10 text-center shadow-card">
      <Badge tone="error">Ошибка</Badge>
      <h1 className="mt-6 font-display text-display-s font-medium lg:text-heading">
        Не удалось завершить генерацию
      </h1>
      <div className="mx-auto mt-6 max-w-md text-left">
        <Toast variant="error">{order.cabinetMessage}</Toast>
        <p className="mt-4 text-small text-ink-secondary">Токены за комнату вернули на баланс</p>
      </div>
      <Link
        href={routes.newOrder}
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white"
      >
        Новая комната
      </Link>
    </section>
  );
}
