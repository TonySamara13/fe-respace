"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Toast } from "@/shared/ui/Toast";

import { registerSchema, type RegisterValues } from "../schema";
import { GoogleButton } from "./GoogleButton";

export function RegisterForm() {
  const [rootError, setRootError] = useState<string>();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setRootError(undefined);
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "register", ...values }),
    });
    const body = (await response.json()) as { detail?: string; emailVerified?: boolean };
    if (!response.ok) {
      setRootError(body.detail ?? "Не удалось зарегистрироваться");
      return;
    }
    window.location.assign(body.emailVerified ? routes.orders : routes.verifyEmail);
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {rootError ? <Toast variant="error">{rootError}</Toast> : null}
      <Field label="Email" htmlFor="email" error={emailError}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          {...form.register("email")}
        />
      </Field>
      <Field label="Пароль" htmlFor="password" error={passwordError} hint="от 8 символов">
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "password-error" : "password-hint"}
          {...form.register("password")}
        />
      </Field>
      <Button type="submit" block loading={form.formState.isSubmitting}>
        Зарегистрироваться
      </Button>
      <p className="py-3 text-center text-caption text-ink-tertiary">или</p>
      <GoogleButton />
      <p className="pt-4 text-center text-small text-ink-secondary">
        Уже есть аккаунт?{" "}
        <Link href={routes.login} className="text-accent underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
