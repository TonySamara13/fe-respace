import { AuthShell, ForgotPasswordForm } from "@/features/auth";

export const metadata = { title: "Сброс пароля" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Сброс пароля" lead="Укажите email — отправим ссылку и код">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
