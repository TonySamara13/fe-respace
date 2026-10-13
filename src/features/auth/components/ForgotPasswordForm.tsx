"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useForgotPassword } from "@/shared/api/generated/auth/auth";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Toast } from "@/shared/ui/Toast";

import { forgotSchema, type ForgotValues } from "../schema";

export function ForgotPasswordForm() {
  const [rootError, setRootError] = useState<string>();
  const [sent, setSent] = useState(false);
  const forgot = useForgotPassword();
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotValues) {
    setRootError(undefined);
    try {
      await forgot.mutateAsync({ data: values });
      setSent(true);
    } catch (error) {
      setRootError(isApiError(error) ? error.detail : "Не удалось отправить письмо");
    }
  }

  const emailError = form.formState.errors.email?.message;

  return (
    <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {sent ? <Toast>Если аккаунт есть, мы отправили письмо со ссылкой для сброса пароля.</Toast> : null}
      {rootError ? <Toast variant="error">{rootError}</Toast> : null}
      <Field label="Email" htmlFor="email" error={emailError}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          {...form.register("email")}
        />
      </Field>
      <Button type="submit" block loading={form.formState.isSubmitting}>
        Отправить ссылку
      </Button>
      <p className="pt-4 text-center text-caption">
        <Link href={routes.login} className="text-ink-tertiary underline">
          Вернуться ко входу
        </Link>
      </p>
    </form>
  );
}
