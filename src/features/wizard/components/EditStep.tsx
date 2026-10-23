"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { PhotoRole, type OrderDtoRs } from "@/shared/api/generated/model";
import { getGetOrderQueryKey, useUpdateEditRequest } from "@/shared/api/generated/orders/orders";
import { useAddPhoto, useCompletePhoto, useDeletePhoto } from "@/shared/api/generated/photos/photos";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { Dropzone } from "@/shared/ui/Dropzone";
import { Field } from "@/shared/ui/Field";
import { PhotoThumb } from "@/shared/ui/PhotoThumb";
import { Textarea } from "@/shared/ui/Textarea";
import { TipList } from "@/shared/ui/TipList";
import { Toast } from "@/shared/ui/Toast";
import { WizardProgress } from "@/shared/ui/WizardProgress";

import { EDIT_AREA_OPTIONS } from "../lib/editAreas";
import { firstPhoto } from "../lib/photos";
import { uploadOrderPhoto } from "../lib/uploadOrderPhoto";
import { editRequestSchema, type EditRequestValues } from "../schema";
import { MaskCanvas, type MaskCanvasHandle } from "./MaskCanvas";
import { WizardFrame } from "./WizardFrame";

const EDIT_STEPS = ["Фото и правка", "Генерация"] as const;

type EditStepProps = {
  order: OrderDtoRs;
};

export function EditStep({ order }: EditStepProps) {
  const source = firstPhoto(order, PhotoRole.SOURCE);
  const mask = firstPhoto(order, PhotoRole.MASK);
  const reference = firstPhoto(order, PhotoRole.REFERENCE);
  const maskRef = useRef<MaskCanvasHandle>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const addPhoto = useAddPhoto();
  const completePhoto = useCompletePhoto();
  const deletePhoto = useDeletePhoto();
  const saveRequest = useUpdateEditRequest();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<EditRequestValues>({
    resolver: zodResolver(editRequestSchema),
    defaultValues: {
      area: order.editRequest?.area ?? "FLOOR",
      instruction: order.editRequest?.instruction ?? "",
    },
  });
  const instruction = useWatch({ control: form.control, name: "instruction" }) ?? "";
  const area = useWatch({ control: form.control, name: "area" });

  function remember(data: OrderDtoRs) {
    queryClient.setQueryData(getGetOrderQueryKey(order.id), { data, status: 200, headers: new Headers() });
  }

  async function upload(file: File, role: PhotoRole) {
    setUploadError(undefined);
    setBusy(true);
    try {
      const next = await uploadOrderPhoto({
        orderId: order.id,
        file,
        fileName: file.name,
        role,
        addPhoto: (vars) => addPhoto.mutateAsync(vars),
        completePhoto: (vars) => completePhoto.mutateAsync(vars),
        compress: role !== PhotoRole.MASK,
      });
      remember(next);
    } catch (error) {
      setUploadError(
        error instanceof Error && error.message === "unsupported_content_type"
          ? "Нужен JPEG, PNG, WebP или HEIC"
          : isApiError(error)
            ? error.detail
            : "Не удалось загрузить фото",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(photoId: string) {
    setBusy(true);
    setUploadError(undefined);
    try {
      remember((await deletePhoto.mutateAsync({ id: order.id, photoId })).data);
    } catch (error) {
      setUploadError(isApiError(error) ? error.detail : "Не удалось удалить фото");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(values: EditRequestValues) {
    if (!source) {
      form.setError("root", { message: "Загрузите фото комнаты" });
      return;
    }
    setBusy(true);
    try {
      const painted = await maskRef.current?.exportPng();
      if (painted) {
        remember(
          await uploadOrderPhoto({
            orderId: order.id,
            file: painted,
            fileName: "mask.png",
            role: PhotoRole.MASK,
            addPhoto: (vars) => addPhoto.mutateAsync(vars),
            completePhoto: (vars) => completePhoto.mutateAsync(vars),
            compress: false,
          }),
        );
      } else if (maskRef.current?.didClear() && mask) {
        remember((await deletePhoto.mutateAsync({ id: order.id, photoId: mask.id })).data);
      }
      const saved = await saveRequest.mutateAsync({
        id: order.id,
        data: { area: values.area, instruction: values.instruction },
      });
      queryClient.setQueryData(getGetOrderQueryKey(order.id), saved);
      router.push(`${routes.order(order.id)}?step=submit`);
    } catch (error) {
      form.setError("root", { message: isApiError(error) ? error.detail : "Не удалось сохранить правку" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <WizardFrame
      wide
      progress={<WizardProgress activeIndex={0} steps={EDIT_STEPS} />}
      title="Что поменять на фото?"
      lead="Шаг 1 из 2 · одно фото · меняем только выделенную область"
      asideStart={
        <div>
          <p className="mb-4 text-label font-medium tracking-wide text-ink-tertiary uppercase">Как описать правку</p>
          <TipList
            items={[
              "Закрасьте кистью только то, что меняем, — с небольшим запасом по краям",
              "Назовите материал и цвет: «светлый дуб», «матовая серая плитка»",
              "Для мебели — выделите место, где она должна стоять, и укажите размер",
            ]}
          />
        </div>
      }
    >
      <form
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
        noValidate
      >
        {form.formState.errors.root?.message || uploadError ? (
          <div className="mb-4">
            <Toast variant="error">{String(form.formState.errors.root?.message ?? uploadError)}</Toast>
          </div>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            {source?.url ? (
              <>
                <MaskCanvas
                  key={source.id}
                  ref={maskRef}
                  imageUrl={source.url}
                  maskUrl={mask?.url}
                  alt="Фото комнаты для правки"
                />
                <button
                  type="button"
                  className="mt-3 text-caption text-ink-secondary underline"
                  onClick={() => void remove(source.id)}
                >
                  Заменить фото · JPEG, PNG, WebP, HEIC
                </button>
              </>
            ) : (
              <Dropzone
                multiple={false}
                disabled={busy}
                title="Перетащите фото комнаты"
                hint="Одно фото · JPEG, PNG, WebP, HEIC"
                onFiles={(files) => {
                  const file = files[0];
                  if (file) void upload(file, PhotoRole.SOURCE);
                }}
              />
            )}
          </div>
          <div>
            <Field label="Что меняем" htmlFor="area" error={form.formState.errors.area?.message}>
              <div className="flex flex-wrap gap-2" id="area">
                {EDIT_AREA_OPTIONS.map((item) => (
                  <Chip
                    key={item.value}
                    selected={area === item.value}
                    onClick={() => form.setValue("area", item.value, { shouldValidate: true })}
                  >
                    {item.label}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field
              label="Опишите правку"
              htmlFor="instruction"
              error={form.formState.errors.instruction?.message}
              hint={`${instruction.length} / 500`}
            >
              <Textarea
                id="instruction"
                maxLength={500}
                aria-invalid={Boolean(form.formState.errors.instruction)}
                {...form.register("instruction")}
              />
            </Field>
            <Field label="Пример (необязательно)" htmlFor="reference">
              {reference?.url ? (
                <PhotoThumb
                  src={reference.url}
                  alt="Фото-пример"
                  onRemove={() => void remove(reference.id)}
                />
              ) : (
                <Dropzone
                  compact
                  multiple={false}
                  disabled={busy}
                  title="Фото материала или мебели"
                  hint="Покажите, что хотите видеть, — повторим максимально близко"
                  onFiles={(files) => {
                    const file = files[0];
                    if (file) void upload(file, PhotoRole.REFERENCE);
                  }}
                />
              )}
            </Field>
            <p className="mt-4 flex gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-caption text-ink">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
              Мебель, свет и ракурс вне выделения останутся как на исходном фото
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 -mx-6 mt-8 flex items-center justify-between gap-3 border-t border-line bg-canvas px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
          <button
            type="button"
            className="text-small text-ink-secondary underline"
            onClick={() => router.push(routes.newOrder)}
          >
            Назад
          </button>
          <Button type="submit" loading={busy} disabled={!source}>
            Далее — к отправке
          </Button>
        </div>
      </form>
    </WizardFrame>
  );
}
