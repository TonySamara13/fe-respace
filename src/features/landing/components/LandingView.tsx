import Link from "next/link";

import { PackageSection } from "@/features/tokens";
import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { legalEntity } from "@/shared/config/legalEntity";
import { routes } from "@/shared/config/routes";
import { Notice } from "@/shared/ui/Notice";

import { LandingHero } from "./LandingHero";
import { LandingReel } from "./LandingReel";
import { LandingSteps } from "./LandingSteps";

type LandingViewProps = {
  packages: TokenPackageDtoRs[] | null;
};

export function LandingView({ packages }: LandingViewProps) {
  return (
    <div className="bg-night text-cream">
      <LandingHero />
      <LandingReel />
      <LandingSteps />
      {packages ? (
        <PackageSection packages={packages} />
      ) : (
        <div className="mx-auto max-w-form px-5 py-10">
          <Notice variant="error" title="Не удалось загрузить тарифы">
            Обновите страницу чуть позже.
          </Notice>
        </div>
      )}
      <footer className="text-caption text-cream-dim px-5 py-8 lg:px-12">
        <p>
          {legalEntity.ipShortName} · ИНН {legalEntity.inn} · ОГРНИП {legalEntity.ogrnip}
        </p>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Юридическая информация">
          <Link href={routes.offer} className="underline-offset-2 hover:underline">
            Оферта
          </Link>
          <Link href={routes.privacy} className="underline-offset-2 hover:underline">
            Политика ПДн
          </Link>
          <Link href={routes.requisites} className="underline-offset-2 hover:underline">
            Реквизиты ИП
          </Link>
        </nav>
      </footer>
    </div>
  );
}
