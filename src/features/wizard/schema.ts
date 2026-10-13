import { z } from "zod";

const cm = (min: number, max: number, minMessage: string, maxMessage: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d+$/.test(value), "Укажите целое число")
    .refine((value) => value === "" || Number(value) >= min, minMessage)
    .refine((value) => value === "" || Number(value) <= max, maxMessage);

export const briefSchema = z
  .object({
    roomTypeCode: z.string().min(1, "Укажите тип комнаты").max(32, "Код типа комнаты не длиннее 32 символов"),
    stylePresetCode: z.string().max(32, "Код стиля не длиннее 32 символов"),
    text: z.string().max(2000, "Описание не длиннее 2000 символов"),
    lengthCm: cm(50, 10_000, "Длина комнаты — от 50 см", "Длина комнаты — до 10 000 см"),
    widthCm: cm(50, 10_000, "Ширина комнаты — от 50 см", "Ширина комнаты — до 10 000 см"),
    heightCm: cm(150, 1_000, "Высота потолка — от 150 см", "Высота потолка — до 1 000 см"),
  })
  .superRefine((value, context) => {
    if (!value.stylePresetCode && !value.text.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "Выберите стиль или опишите желаемый интерьер",
      });
    }
  });

export type BriefValues = z.infer<typeof briefSchema>;

export function toBriefRequest(values: BriefValues) {
  const dimensions = {
    lengthCm: values.lengthCm ? Number(values.lengthCm) : undefined,
    widthCm: values.widthCm ? Number(values.widthCm) : undefined,
    heightCm: values.heightCm ? Number(values.heightCm) : undefined,
  };
  const hasDimensions = dimensions.lengthCm || dimensions.widthCm || dimensions.heightCm;
  return {
    roomTypeCode: values.roomTypeCode,
    stylePresetCode: values.stylePresetCode || undefined,
    text: values.text.trim() || undefined,
    dimensions: hasDimensions ? dimensions : undefined,
  };
}

export const submitSchema = z.object({
  personalDataConsent: z.boolean().refine((value) => value, {
    message: "Нужно согласие на обработку персональных данных",
  }),
});

export type SubmitValues = z.infer<typeof submitSchema>;
