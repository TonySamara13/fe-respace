import type { OrderDtoRs } from "@/shared/api/generated/model";
import { Badge } from "@/shared/ui/Badge";
import { OrderProgress } from "@/shared/ui/OrderProgress";

type GeneratingViewProps = {
  order: OrderDtoRs;
};

export function GeneratingView({ order }: GeneratingViewProps) {
  const done = order.progress?.done ?? 0;
  const total = order.progress?.total ?? 3;
  return (
    <section className="mx-auto max-w-form rounded-card border border-line bg-surface px-6 py-10 text-center shadow-card lg:px-12">
      <Badge tone="green">Генерация</Badge>
      <h1 className="mt-6 font-display text-display-s font-medium lg:text-heading">Генерируем интерьер</h1>
      <div className="mx-auto mt-6 max-w-md text-left">
        <OrderProgress message={order.cabinetMessage} done={done} total={total} />
      </div>
      <p className="mt-8 text-caption text-ink-tertiary">Страница обновляется автоматически</p>
    </section>
  );
}
