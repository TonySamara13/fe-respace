import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Укажите email")
  .email("Некорректный email")
  .max(320, "Email не длиннее 320 символов");

export const purchaseSchema = z.object({
  email: emailSchema,
  offerConsent: z.boolean().refine((value) => value, {
    message: "Нужно согласие с офертой и обработкой персональных данных",
  }),
});

export type PurchaseValues = z.infer<typeof purchaseSchema>;
