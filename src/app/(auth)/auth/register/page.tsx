import { AuthShell, RegisterForm } from "@/features/auth";

export const metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Регистрация"
      lead="Подтвердите email — без этого заказ не создать"
      showPolaroids
      trust={[
        "Несколько вариантов вашего дизайна",
        "Референсы в один клик",
        "Результат в вашем кабинете!",
      ]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
