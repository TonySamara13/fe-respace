import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { routes } from "@/shared/config/routes";
import { packPresentation } from "@/shared/lib/packPresentation";
import { PackCard } from "@/shared/ui/PackCard";

type PackageSectionProps = {
  packages: TokenPackageDtoRs[];
};

export function PackageSection({ packages }: PackageSectionProps) {
  return (
    <section className="bg-canvas py-10 lg:py-16">
      <div className="mx-auto max-w-content px-5 lg:px-8">
        <h2 className="text-center font-display text-display-s font-medium lg:text-display-lg">Пакеты токенов</h2>
        <p className="mt-2 mb-10 text-center text-ink-secondary">
          Одна комната — 30 токенов · 3 photoreal варианта
        </p>
        <div className="mx-auto grid max-w-content gap-4 md:grid-cols-3">
          {packages.map((item) => (
            <PackCard
              key={item.code}
              tokens={item.tokens}
              price={item.price}
              presentation={packPresentation(item.code, false)}
              actionLabel="Выбрать"
              href={routes.tokens}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
