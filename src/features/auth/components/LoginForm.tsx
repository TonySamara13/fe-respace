"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { routes, safeNextPath } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Toast } from "@/shared/ui/Toast";

import { loginSchema, type LoginValues } from "../schema";
import { GoogleButton } from "./GoogleButton";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [rootError, setRootError] = useState<string>();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setRootError(undefined);
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "login", ...values }),
    });
    const body = (await response.json()) as { detail?: string };
    if (!response.ok) {
      setRootError(body.detail ?? "Не удалось войти");
      return;
    }
    window.location.assign(safeNextPath(nextPath));
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
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          {...form.register("email")}
        />
      </Field>
      <Field label="Пароль" htmlFor="password" error={passwordError}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "password-error" : undefined}
          {...form.register("password")}
        />
      </Field>
      <Button type="submit" block loading={form.formState.isSubmitting}>
        Войти
      </Button>
      <p className="py-3 text-center text-caption text-ink-tertiary">или</p>
      <GoogleButton nextPath={nextPath} />
      <p className="pt-4 text-center text-small text-ink-secondary">
        Нет аккаунта?{" "}
        <Link href={routes.register} className="text-accent underline">
          Регистрация
        </Link>
      </p>
      <p className="text-center text-caption">
        <Link href={routes.forgotPassword} className="text-ink-tertiary underline">
          Забыли пароль?
        </Link>
      </p>
    </form>
  );
}
