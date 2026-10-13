import { AuthShell, VerifyEmailForm } from "@/features/auth";

export const metadata = { title: "Подтвердите email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthShell
      title="Подтвердите email"
      lead="Введите 4-значный код из письма."
      trust={["Проверьте «Спам»", "Код действует 15 минут"]}
    >
      <VerifyEmailForm token={token} />
    </AuthShell>
  );
}
