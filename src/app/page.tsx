import Link from "next/link";

import { PackageSection } from "@/features/tokens";
import { getTokenPackages } from "@/shared/api/generated/tokens/tokens";
import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { routes } from "@/shared/config/routes";
import { Notice } from "@/shared/ui/Notice";

export const metadata = {
  title: "Новый интерьер по вашим фото",
  description: "Загрузите снимки комнаты — получите 3 photoreal варианта за 15 минут. Одна комната — 30 токенов.",
};

async function loadPackages(): Promise<TokenPackageDtoRs[] | null> {
  try {
    const response = await getTokenPackages({
      next: { revalidate: 300 },
    } as NonNullable<Parameters<typeof getTokenPackages>[0]>);
    return response.data;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const packages = await loadPackages();

  return (
    <>
      <section className="mx-auto grid max-w-content items-center gap-8 px-5 py-10 lg:grid-cols-2 lg:px-8 lg:py-16">
        <div>
          <h1 className="font-display text-display-m font-medium text-ink lg:text-display-xl">
            Новый интерьер по вашим фото
          </h1>
          <p className="mt-4 max-w-md text-body text-ink-secondary lg:text-body-lg">
            Загрузите снимки комнаты — получите 3 photoreal варианта за 15 минут. Одна комната — 30 токенов, от 315 ₽.
          </p>
          <p className="mt-4 text-caption text-accent">3 JPEG · до 15 мин · хранение 90 дней</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={routes.newOrder}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-body font-medium text-white hover:bg-accent-hover"
            >
              Создать проект
            </Link>
            <a
              href="#how"
              className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-7 py-3 text-body font-medium"
            >
              Примеры
            </a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
          alt="Пример интерьера после генерации"
          className="aspect-[4/3] w-full rounded-card object-cover"
        />
      </section>
      <section id="how" className="bg-surface py-10 lg:py-16">
        <div className="mx-auto max-w-content px-5 text-center lg:px-8">
          <h2 className="font-display text-display-s font-medium lg:text-display-lg">Как это работает</h2>
          <ol className="mx-auto mt-8 grid max-w-3xl gap-6 md:grid-cols-3">
            <li>
              <strong>1. Бриф</strong>
              <p className="mt-2 text-caption text-ink-secondary">Комната и стиль</p>
            </li>
            <li>
              <strong>2. Фото</strong>
              <p className="mt-2 text-caption text-ink-secondary">1–7 снимков</p>
            </li>
            <li>
              <strong>3. Генерация</strong>
              <p className="mt-2 text-caption text-ink-secondary">30 токенов с баланса</p>
            </li>
          </ol>
        </div>
      </section>
      {packages ? (
        <PackageSection packages={packages} />
      ) : (
        <div className="mx-auto max-w-form px-5 py-10">
          <Notice variant="error" title="Не удалось загрузить пакеты токенов">
            Обновите страницу чуть позже.
          </Notice>
        </div>
      )}
    </>
  );
}
