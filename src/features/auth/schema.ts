import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Укажите email")
  .email("Некорректный email")
  .max(320, "Email не длиннее 320 символов");

export const passwordSchema = z
  .string()
  .min(8, "Пароль от 8 до 128 символов")
  .max(128, "Пароль от 8 до 128 символов");

export const codeSchema = z.string().regex(/^\d{4}$/, "Код — 4 цифры");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Укажите пароль"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotSchema = z.object({
  email: emailSchema,
});

export const verifySchema = z.object({
  code: codeSchema,
});

export const resetSchema = z.object({
  code: codeSchema,
  newPassword: passwordSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotValues = z.infer<typeof forgotSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
export type ResetValues = z.infer<typeof resetSchema>;
