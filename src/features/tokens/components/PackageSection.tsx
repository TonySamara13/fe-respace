import Image from "next/image";
import Link from "next/link";

import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { formatRub } from "@/shared/lib/format";
import { DEFAULT_PACK_CODE, packTitle } from "@/shared/lib/packPresentation";

const TARIFF_FRAMES: Record<string, string> = {
  PACK_2000: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  PACK_5000: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  PACK_11000: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
};

type PackageSectionProps = {
  packages: TokenPackageDtoRs[];
};

export function PackageSection({ packages }: PackageSectionProps) {
  return (
    <section id="packs" className="px-5 py-10 lg:px-12 lg:py-16">
      <h2 className="font-display text-display-s text-cream font-medium lg:text-display-lg">Тарифы</h2>
      <p className="text-body text-cream-dim mt-3 max-w-md">Для новых комнат и точечных правок.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch lg:pt-3">
        {packages.map((item) => {
          const featured = item.code === DEFAULT_PACK_CODE;
          const frame = TARIFF_FRAMES[item.code];
          return (
            <Link
              key={item.code}
              href={routes.tokens}
              className={cn(
                "focus-visible:ring-cream flex flex-col overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:outline-none",
                featured ? "bg-cream text-night lg:-translate-y-3" : "bg-night-raised text-cream",
              )}
            >
              {frame ? (
                <div className="relative h-40 lg:h-48">
                  <Image src={frame} alt="" fill className="object-cover" sizes="400px" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-1 px-5 py-5">
                <p className={cn("text-small", featured ? "text-ink-secondary" : "text-cream-dim")}>
                  {packTitle(item.code)}
                </p>
                <p className="font-display text-display-lg leading-none font-medium lining-nums">
                  {new Intl.NumberFormat("ru-RU").format(item.tokens)}
                </p>
                <p className={cn("text-small", featured ? "text-ink-secondary" : "text-cream-dim")}>
                  токенов
                </p>
                <p className="mt-auto pt-4 text-title font-semibold tabular-nums">{formatRub(item.price)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
