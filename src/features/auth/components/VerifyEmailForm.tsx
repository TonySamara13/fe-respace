"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useResendVerification } from "@/shared/api/generated/account/account";
import { useVerifyEmail } from "@/shared/api/generated/auth/auth";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { readSessionUser } from "@/shared/lib/sessionUser";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Toast } from "@/shared/ui/Toast";

import { verifySchema, type VerifyValues } from "../schema";

type VerifyEmailFormProps = {
  token?: string;
};

export function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const [rootError, setRootError] = useState<string>();
  const [resent, setResent] = useState(false);
  const user = readSessionUser();
  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: VerifyValues) {
    if (!token) {
      setRootError("Откройте ссылку из письма: в ней есть token подтверждения");
      return;
    }
    setRootError(undefined);
    try {
      await verify.mutateAsync({ data: { token, code: values.code } });
      await fetch("/api/session", { method: "PATCH" });
      window.location.assign(routes.orders);
    } catch (error) {
      setRootError(isApiError(error) ? error.detail : "Не удалось подтвердить email");
    }
  }

  async function onResend() {
    setRootError(undefined);
    try {
      await resend.mutateAsync();
      setResent(true);
    } catch (error) {
      setRootError(isApiError(error) ? error.detail : "Не удалось отправить письмо");
    }
  }

  const codeError = form.formState.errors.code?.message;

  return (
    <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {user ? (
        <p className="mb-4 text-body text-ink-secondary">
          Мы отправили письмо на <strong className="text-ink">{user.email}</strong>. Введите 4-значный код из письма.
        </p>
      ) : null}
      {rootError ? <Toast variant="error">{rootError}</Toast> : null}
      {resent ? <Toast>Письмо отправлено ещё раз. Код действует 15 минут.</Toast> : null}
      <Field label="Код" htmlFor="code" error={codeError}>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-invalid={Boolean(codeError)}
          aria-describedby={codeError ? "code-error" : undefined}
          className="text-center tracking-[0.3em]"
          {...form.register("code")}
        />
      </Field>
      <Button type="submit" block loading={form.formState.isSubmitting || verify.isPending}>
        Подтвердить
      </Button>
      <p className="pt-4 text-center text-caption text-ink-secondary">
        Не пришло?{" "}
        <button type="button" className="text-accent underline" onClick={() => void onResend()}>
          Отправить снова
        </button>
      </p>
    </form>
  );
}
