import Image from "next/image";

import { STEP_FRAME } from "../pins";

const STEPS = [
  {
    title: "01 Бриф",
    text: "Тип комнаты и настроение: из подсказок или своими словами.",
  },
  {
    title: "02 Фото",
    text: "Снимки комнаты. Деталь можно отметить и написать, что сделать.",
  },
  {
    title: "03 Генерация",
    text: "Планировка, окна и двери остаются. Меняются свет, мебель, отделка.",
  },
  {
    title: "04 Результат",
    text: "Кадры той же комнаты. Сравните и оставьте то, что ближе.",
  },
] as const;

export function LandingSteps() {
  return (
    <section id="how" className="px-5 py-10 lg:px-12 lg:py-16">
      <h2 className="font-display text-display-s text-cream font-medium lg:text-display-lg">
        Как это работает
      </h2>
      <div className="mt-6 flex flex-col overflow-hidden rounded-xl lg:grid lg:min-h-96 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative order-1 h-52 lg:order-2 lg:h-full lg:min-h-96">
          <Image
            src={STEP_FRAME.src}
            alt={STEP_FRAME.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <ol className="bg-night/90 order-2 px-5 py-2 lg:order-1 lg:px-7">
          {STEPS.map((step) => (
            <li key={step.title} className="border-night-line border-t py-4 first:border-t-0">
              <p className="font-display text-title text-cream font-medium">{step.title}</p>
              <p className="text-small text-cream-dim mt-1">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
