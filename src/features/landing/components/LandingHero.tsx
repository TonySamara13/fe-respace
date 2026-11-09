import Image from "next/image";
import Link from "next/link";

import { routes } from "@/shared/config/routes";

import { HERO_FRAME } from "../pins";

export function LandingHero() {
  return (
    <section>
      <div className="relative h-[52vh] min-h-72 lg:h-[64vh] lg:min-h-96">
        <Image
          src={HERO_FRAME.src}
          alt={HERO_FRAME.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="from-night to-night pointer-events-none absolute inset-0 bg-linear-to-b via-transparent" />
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 pt-2 pb-8 lg:px-12 lg:pb-10">
        <h1 className="font-display text-display-hero text-cream max-w-4xl font-medium lg:text-display-cinema">
          Воплотите интерьер своей мечты вместе с Целлой
        </h1>
        <p className="text-body text-cream-dim mt-4 max-w-xl lg:text-body-lg">
          Загрузите снимки своей комнаты и скажите, что изменить: свет, мебель, пол или стены.
          Планировка останется вашей — комната станет другой.
        </p>
        <Link
          href={routes.newOrder}
          className="bg-cream text-night shadow-panel focus-visible:ring-cream mt-8 inline-flex min-h-12 items-center rounded-full px-8 text-body font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          Создать проект
        </Link>
      </div>
    </section>
  );
}
