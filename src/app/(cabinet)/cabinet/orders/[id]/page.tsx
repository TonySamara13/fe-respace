import { OrderScreen } from "@/features/order";

export const metadata = { title: "Заказ" };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string; returned?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return <OrderScreen orderId={id} requestedStep={query.step} returned={query.returned === "1"} />;
}
