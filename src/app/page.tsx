import { LandingView } from "@/features/landing";
import { getTokenPackages } from "@/shared/api/generated/tokens/tokens";
import type { TokenPackageDtoRs } from "@/shared/api/generated/model";

export const metadata = {
  title: "Воплотите интерьер своей мечты",
  description:
    "Загрузите снимки своей комнаты и скажите, что изменить: свет, мебель, пол или стены. Планировка останется вашей.",
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
  return <LandingView packages={packages} />;
}
