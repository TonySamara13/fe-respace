import { AuthShell, RegisterForm } from "@/features/auth";

export const metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Регистрация"
      lead="Подтвердите email — без этого заказ не создать"
      showPolaroids
      trust={["3 варианта", "до 15 минут", "хранение 90 дней"]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
