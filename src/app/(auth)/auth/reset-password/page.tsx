import { AuthShell, ResetPasswordForm } from "@/features/auth";

export const metadata = { title: "Новый пароль" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthShell title="Новый пароль" lead="Код из письма и новый пароль" trust={["Заказы и результаты сохранятся"]}>
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
