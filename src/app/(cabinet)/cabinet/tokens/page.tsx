import { TokenShop } from "@/features/tokens";
import { getTokenPackages } from "@/shared/api/generated/tokens/tokens";

export const metadata = { title: "Пакеты токенов" };

export default async function TokensPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; returned?: string }>;
}) {
  const query = await searchParams;
  const packages = await getTokenPackages();
  return (
    <TokenShop packages={packages.data} orderId={query.orderId} returned={query.returned === "1"} />
  );
}
