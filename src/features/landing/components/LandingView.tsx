import { PackageSection } from "@/features/tokens";
import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
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
        <div className="mx-auto max-w-form px-4 py-10">
          <Notice variant="error" title="Не удалось загрузить тарифы">
            Обновите страницу чуть позже.
          </Notice>
        </div>
      )}
    </div>
  );
}
