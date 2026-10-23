import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { routes } from "@/shared/config/routes";
import { DEFAULT_PACK_CODE, packPresentation } from "@/shared/lib/packPresentation";
import { PackCard } from "@/shared/ui/PackCard";

type PackageSectionProps = {
  packages: TokenPackageDtoRs[];
};

export function PackageSection({ packages }: PackageSectionProps) {
  return (
    <section id="packs" className="bg-canvas py-10 lg:py-16">
      <div className="max-w-content mx-auto px-5 lg:px-8">
        <h2 className="font-display text-display-s lg:text-display-lg text-center font-medium">
          Пакеты токенов
        </h2>
        <p className="text-body-lg text-ink-secondary mx-auto mt-3 max-w-xl text-center">
          Одна комната — 30 токенов · 3 фотореалистичных варианта
        </p>
        <div className="max-w-content mx-auto mt-10 grid gap-4 md:grid-cols-3">
          {packages.map((item) => (
            <PackCard
              key={item.code}
              tokens={item.tokens}
              price={item.price}
              presentation={packPresentation(item.code, false)}
              showDetails={false}
              emphasized={item.code === DEFAULT_PACK_CODE}
              actionLabel="Выбрать"
              href={routes.tokens}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
