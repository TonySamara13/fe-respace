"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useResetPassword } from "@/shared/api/generated/auth/auth";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Toast } from "@/shared/ui/Toast";

import { resetSchema, type ResetValues } from "../schema";

type ResetPasswordFormProps = {
  token?: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [rootError, setRootError] = useState<string>();
  const reset = useResetPassword();
  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  async function onSubmit(values: ResetValues) {
    if (!token) {
      setRootError("Откройте ссылку из письма");
      return;
    }
    setRootError(undefined);
    try {
      await reset.mutateAsync({ data: { token, code: values.code, newPassword: values.newPassword } });
      window.location.assign(routes.login);
    } catch (error) {
      setRootError(isApiError(error) ? error.detail : "Не удалось сохранить пароль");
    }
  }

  const codeError = form.formState.errors.code?.message;
  const passwordError = form.formState.errors.newPassword?.message;

  return (
    <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {rootError ? <Toast variant="error">{rootError}</Toast> : null}
      <Field label="Код из письма" htmlFor="code" error={codeError}>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-invalid={Boolean(codeError)}
          aria-describedby={codeError ? "code-error" : undefined}
          {...form.register("code")}
        />
      </Field>
      <Field label="Новый пароль" htmlFor="newPassword" error={passwordError}>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="от 8 символов"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "newPassword-error" : undefined}
          {...form.register("newPassword")}
        />
      </Field>
      <Button type="submit" block loading={form.formState.isSubmitting}>
        Сохранить пароль
      </Button>
      <p className="pt-4 text-center text-caption">
        <Link href={routes.login} className="text-ink-tertiary underline">
          Вернуться ко входу
        </Link>
      </p>
    </form>
  );
}
