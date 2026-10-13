import { AuthShell, LoginForm } from "@/features/auth";
import { safeNextPath } from "@/shared/config/routes";

export const metadata = { title: "Вход" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthShell
      title="Вход"
      lead="Нужен аккаунт для создания заказа"
      showPolaroids
      trust={["3 варианта", "до 15 минут", "хранение 90 дней"]}
    >
      <LoginForm nextPath={safeNextPath(next)} />
    </AuthShell>
  );
}
