"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { useGetCatalog } from "@/shared/api/generated/catalog/catalog";
import type { OrderDtoRs } from "@/shared/api/generated/model";
import { getGetOrderQueryKey, useUpdateBrief } from "@/shared/api/generated/orders/orders";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { MiniStat } from "@/shared/ui/MiniStat";
import { Polaroid } from "@/shared/ui/Polaroid";
import { StyleCard } from "@/shared/ui/StyleCard";
import { Textarea } from "@/shared/ui/Textarea";
import { TipList } from "@/shared/ui/TipList";
import { Toast } from "@/shared/ui/Toast";
import { WizardProgress } from "@/shared/ui/WizardProgress";

import { briefSchema, toBriefRequest, type BriefValues } from "../schema";
import { WizardFrame } from "./WizardFrame";

type BriefStepProps = {
  order: OrderDtoRs;
};

export function BriefStep({ order }: BriefStepProps) {
  const catalog = useGetCatalog();
  const update = useUpdateBrief();
  const queryClient = useQueryClient();
  const router = useRouter();
  const brief = order.brief;
  const form = useForm<BriefValues>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      roomTypeCode: brief?.roomTypeCode ?? "",
      stylePresetCode: brief?.stylePresetCode ?? "",
      text: brief?.text ?? "",
      lengthCm: brief?.dimensions?.lengthCm ? String(brief.dimensions.lengthCm) : "",
      widthCm: brief?.dimensions?.widthCm ? String(brief.dimensions.widthCm) : "",
      heightCm: brief?.dimensions?.heightCm ? String(brief.dimensions.heightCm) : "",
    },
  });

  async function onSubmit(values: BriefValues) {
    try {
      const result = await update.mutateAsync({ id: order.id, data: toBriefRequest(values) });
      queryClient.setQueryData(getGetOrderQueryKey(order.id), result);
      router.push(`${routes.order(order.id)}?step=photos`);
    } catch (error) {
      form.setError("root", { message: isApiError(error) ? error.detail : "Не удалось сохранить бриф" });
    }
  }

  const room = useWatch({ control: form.control, name: "roomTypeCode" });
  const style = useWatch({ control: form.control, name: "stylePresetCode" });
  const textError = form.formState.errors.text?.message;
  const roomError = form.formState.errors.roomTypeCode?.message;

  return (
    <WizardFrame
      progress={<WizardProgress activeIndex={0} />}
      title="Расскажите о комнате"
      lead="Шаг 1 из 3"
      asideStart={
        <div>
          <p className="mb-4 text-label font-medium tracking-wide text-ink-tertiary uppercase">Подсказки</p>
          <TipList
            items={[
              "Тип комнаты влияет на мебель и планировку результата",
              "Стиль можно не выбирать — достаточно описания своими словами",
              "Размеры помогают точнее подобрать масштаб мебели",
            ]}
          />
          <p className="mt-6 text-caption text-ink-tertiary">Бриф и фото можно менять до отправки на генерацию</p>
        </div>
      }
      asideEnd={
        <div>
          <p className="mb-4 text-label font-medium tracking-wide text-ink-tertiary uppercase">Пример результата</p>
          <Polaroid
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80"
            tag="Сканди"
            caption="Гостиная"
          />
          <div className="mt-6 space-y-4">
            <MiniStat value="3" label="варианта дизайна" />
            <MiniStat value="~15" label="минут на генерацию" />
            <MiniStat value="90" label="дней храним результат" />
          </div>
        </div>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {form.formState.errors.root?.message ? (
          <div className="mb-4">
            <Toast variant="error">{form.formState.errors.root.message}</Toast>
          </div>
        ) : null}
        <Field label="Тип комнаты" htmlFor="roomTypeCode" error={roomError}>
          <div className="flex flex-wrap gap-2" id="roomTypeCode">
            {(catalog.data?.data.roomTypes ?? []).map((item) => (
              <Chip
                key={item.code}
                selected={room === item.code}
                onClick={() => form.setValue("roomTypeCode", item.code, { shouldValidate: true })}
              >
                {item.name}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Пресет стиля" htmlFor="stylePresetCode">
          <div className="grid gap-3 sm:grid-cols-2" id="stylePresetCode">
            {(catalog.data?.data.stylePresets ?? []).map((item) => (
              <StyleCard
                key={item.code}
                title={item.name}
                description={item.description}
                selected={style === item.code}
                onClick={() =>
                  form.setValue("stylePresetCode", style === item.code ? "" : item.code, { shouldValidate: true })
                }
              />
            ))}
          </div>
        </Field>
        <Field label="Описание своими словами (опционально)" htmlFor="text" error={textError}>
          <Textarea
            id="text"
            aria-invalid={Boolean(textError)}
            aria-describedby={textError ? "text-error" : undefined}
            {...form.register("text")}
          />
        </Field>
        <details className="mb-6" open>
          <summary className="cursor-pointer text-small font-medium text-ink-secondary">
            Размеры комнаты (опционально)
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Длина, см" htmlFor="lengthCm" error={form.formState.errors.lengthCm?.message}>
              <Input id="lengthCm" inputMode="numeric" {...form.register("lengthCm")} />
            </Field>
            <Field label="Ширина, см" htmlFor="widthCm" error={form.formState.errors.widthCm?.message}>
              <Input id="widthCm" inputMode="numeric" {...form.register("widthCm")} />
            </Field>
            <Field label="Потолок, см" htmlFor="heightCm" error={form.formState.errors.heightCm?.message}>
              <Input id="heightCm" inputMode="numeric" {...form.register("heightCm")} />
            </Field>
          </div>
        </details>
        <div className="sticky bottom-0 -mx-6 flex justify-end border-t border-line bg-canvas px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
          <Button type="submit" loading={update.isPending}>
            Далее — фото
          </Button>
        </div>
      </form>
    </WizardFrame>
  );
}
