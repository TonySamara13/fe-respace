import Image from "next/image";
import Link from "next/link";

import { PackageSection } from "@/features/tokens";
import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { Notice } from "@/shared/ui/Notice";

import { HERO_PINS, IDEA_PINS, type Pin, type PinRatio } from "../pins";

const RATIO_CLASS: Record<PinRatio, string> = {
  tall: "aspect-3/4",
  wide: "aspect-4/3",
  square: "aspect-square",
};

const STEPS = [
  {
    title: "Бриф",
    text: "Выберите тип комнаты и стиль из подсказок или опишите желаемый интерьер своими словами.",
  },
  {
    title: "Фото",
    text: "Загрузите снимки комнаты. Если нужно поменять одну деталь — отметьте её на фото и напишите, что сделать.",
  },
  {
    title: "Генерация",
    text: "Целла собирает интерьер по вашим фото: планировка, окна и двери остаются, меняется настроение комнаты.",
  },
  {
    title: "Результат",
    text: "Три фотореалистичных варианта одной и той же комнаты. Сравните их и оставьте тот, который хотите воплотить.",
  },
] as const;

const DETAILS = [
  {
    title: "Ваши фото",
    text: "Берём реальную планировку, свет из окон и то, что уже стоит в комнате. Это не картинка чужой квартиры.",
  },
  {
    title: "Целиком или одна деталь",
    text: "Новый дизайн всей комнаты или точечная правка: пол, стены, мебель, свет. Остальное на фото остаётся как есть.",
  },
  {
    title: "Стиль или свои слова",
    text: "Выберите готовое направление или напишите, чего хотите: меньше мебели, светлый дуб, льняные шторы.",
  },
  {
    title: "Три прочтения",
    text: "В ответе не один случайный кадр, а три фотореалистичных варианта одной комнаты — чтобы было из чего выбрать.",
  },
] as const;

type LandingViewProps = {
  packages: TokenPackageDtoRs[] | null;
};

export function LandingView({ packages }: LandingViewProps) {
  return (
    <>
      <section className="max-w-content mx-auto grid items-center gap-8 px-5 py-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <h1 className="font-display text-display-m text-ink lg:text-display-xl font-medium">
            Воплотите интерьер своей мечты вместе с Целлой!
          </h1>
          <p className="text-body-lg text-ink-secondary mt-4 max-w-md">
            Загрузите снимки комнаты, выберите стиль или опишите его своими словами — и получите 3
            фотореалистичных варианта именно вашей комнаты.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={routes.newOrder}
              className="bg-accent text-body hover:bg-accent-hover inline-flex min-h-11 items-center rounded-full px-7 py-3 font-medium text-white"
            >
              Создать проект
            </Link>
            <a
              href="#ideas"
              className="border-line-strong text-body inline-flex min-h-11 items-center rounded-full border px-7 py-3 font-medium"
            >
              Смотреть идеи
            </a>
          </div>
        </div>
        <PinBoard pins={HERO_PINS} />
      </section>

      <section id="how" className="bg-surface py-10 lg:py-16">
        <div className="max-w-content mx-auto px-5 lg:px-8">
          <SectionHeading
            title="Как это работает"
            lead="От снимков вашей комнаты до трёх вариантов, которые можно сравнить и выбрать."
          />
          <ol className="mt-8 grid gap-4 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-card border-line bg-canvas border p-6 lg:p-8">
                <p className="font-display text-heading text-accent font-medium">{index + 1}</p>
                <h3 className="text-body-lg mt-3 font-semibold">{step.title}</h3>
                <p className="text-small text-ink-secondary mt-2">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ideas" className="py-10 lg:py-16">
        <div className="max-w-content mx-auto px-5 lg:px-8">
          <SectionHeading
            title="Идеи, которые можно примерить"
            lead="Не чужие комнаты из каталога, а направления. Целла переносит такое настроение на ваши фото."
          />
          <div className="mt-6 lg:mt-8">
            <PinBoard pins={IDEA_PINS} wide />
          </div>
        </div>
      </section>

      <section className="bg-surface py-10 lg:py-16">
        <div className="max-w-content mx-auto px-5 lg:px-8">
          <SectionHeading
            title="Ваша комната, только иначе"
            lead="Целла смотрит на ваши фото и предлагает, как эта же комната может выглядеть в другом настроении."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {DETAILS.map((item) => (
              <li key={item.title} className="rounded-card bg-canvas p-6 lg:p-8">
                <h3 className="text-body-lg font-semibold">{item.title}</h3>
                <p className="text-small text-ink-secondary mt-2">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {packages ? (
        <PackageSection packages={packages} />
      ) : (
        <div id="packs" className="max-w-form mx-auto px-5 py-10">
          <Notice variant="error" title="Не удалось загрузить пакеты токенов">
            Обновите страницу чуть позже.
          </Notice>
        </div>
      )}
    </>
  );
}

function SectionHeading({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="text-center">
      <h2 className="font-display text-display-s lg:text-display-lg font-medium">{title}</h2>
      <p className="text-body-lg text-ink-secondary mx-auto mt-3 max-w-xl">{lead}</p>
    </div>
  );
}

function PinBoard({ pins, wide = false }: { pins: Pin[]; wide?: boolean }) {
  return (
    <div className={cn("columns-2 gap-3", wide && "lg:columns-4")}>
      {pins.map((pin) => (
        <figure
          key={pin.src}
          className="border-line bg-surface mb-3 break-inside-avoid overflow-hidden rounded-2xl border"
        >
          <div className={cn("relative", RATIO_CLASS[pin.ratio])}>
            <Image
              src={pin.src}
              alt={pin.alt}
              fill
              className="object-cover"
              sizes={wide ? "25vw" : "40vw"}
            />
          </div>
          <figcaption className="text-caption text-ink px-4 pt-4 pb-5">
            <span className="text-micro text-accent mb-2 block font-semibold tracking-wide uppercase">
              {pin.kicker}
            </span>
            {pin.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
