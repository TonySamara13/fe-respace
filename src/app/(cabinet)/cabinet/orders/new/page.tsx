import { redirect } from "next/navigation";

import { EmailNotVerified } from "@/features/auth";
import { createOrder } from "@/shared/api/generated/orders/orders";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";

export const metadata = { title: "Новая комната" };

export default async function NewOrderPage() {
  try {
    const created = await createOrder();
    redirect(routes.order(created.data.id));
  } catch (error) {
    if (isApiError(error, "email_not_verified")) return <EmailNotVerified />;
    throw error;
  }
}
