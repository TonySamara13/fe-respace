"use client";

import { useState } from "react";

import { useResendVerification } from "@/shared/api/generated/account/account";
import { isApiError } from "@/shared/api/errors";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Toast } from "@/shared/ui/Toast";

export function EmailNotVerified() {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const resend = useResendVerification();

  async function onResend() {
    setError(undefined);
    try {
      await resend.mutateAsync();
      setMessage("Письмо отправлено. Код действует 15 минут.");
    } catch (caught) {
      setError(isApiError(caught) ? caught.detail : "Не удалось отправить письмо");
    }
  }

  return (
    <Card className="mx-auto max-w-form">
      <h1 className="font-display text-display-s font-medium lg:text-heading">Подтвердите email</h1>
      <p className="mt-3 text-ink-secondary">
        Создание заказа доступно после подтверждения email. Откройте письмо и введите код по ссылке.
      </p>
      <div className="mt-6 space-y-3">
        {message ? <Toast>{message}</Toast> : null}
        {error ? <Toast variant="error">{error}</Toast> : null}
        <Button loading={resend.isPending} onClick={() => void onResend()}>
          Отправить снова
        </Button>
      </div>
    </Card>
  );
}
