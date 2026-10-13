"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import type { OrderDtoRs } from "@/shared/api/generated/model";
import { PhotoStatus } from "@/shared/api/generated/model";
import { getGetOrderQueryKey } from "@/shared/api/generated/orders/orders";
import { useAddPhoto, useCompletePhoto, useDeletePhoto } from "@/shared/api/generated/photos/photos";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/Button";
import { Dropzone } from "@/shared/ui/Dropzone";
import { PhotoThumb } from "@/shared/ui/PhotoThumb";
import { TipList } from "@/shared/ui/TipList";
import { WizardProgress } from "@/shared/ui/WizardProgress";

import { MAX_PARALLEL_UPLOADS, preparePhoto, putPhoto } from "../lib/preparePhoto";
import { WizardFrame } from "./WizardFrame";

type LocalPhoto = {
  key: string;
  progress: number;
  error?: string;
};

type PhotosStepProps = {
  order: OrderDtoRs;
};

export function PhotosStep({ order }: PhotosStepProps) {
  const [local, setLocal] = useState<LocalPhoto[]>([]);
  const pending = useRef<File[]>([]);
  const inflight = useRef(0);
  const addPhoto = useAddPhoto();
  const completePhoto = useCompletePhoto();
  const deletePhoto = useDeletePhoto();
  const queryClient = useQueryClient();
  const router = useRouter();
  const uploaded = order.photos.filter((photo) => photo.status === PhotoStatus.UPLOADED);

  function remember(result: { data: OrderDtoRs }) {
    queryClient.setQueryData(getGetOrderQueryKey(order.id), result);
  }

  async function uploadOne(file: File) {
    const key = `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`;
    setLocal((items) => [...items, { key, progress: 0 }]);
    try {
      const prepared = await preparePhoto(file);
      const started = await addPhoto.mutateAsync({
        id: order.id,
        data: { contentType: prepared.contentType, sizeBytes: prepared.blob.size },
      });
      await putPhoto(started.data.upload.url, started.data.upload.headers, prepared.blob, (progress) => {
        setLocal((items) => items.map((item) => (item.key === key ? { ...item, progress } : item)));
      });
      const completed = await completePhoto.mutateAsync({ id: order.id, photoId: started.data.photoId });
      remember(completed);
      setLocal((items) => items.filter((item) => item.key !== key));
    } catch (error) {
      const message =
        error instanceof Error && error.message === "unsupported_content_type"
          ? "Нужен JPEG, PNG, WebP или HEIC"
          : isApiError(error)
            ? error.detail
            : "Не удалось загрузить фото";
      setLocal((items) =>
        items.map((item) => (item.key === key ? { ...item, error: message, progress: 1 } : item)),
      );
    }
  }

  function pump() {
    while (inflight.current < MAX_PARALLEL_UPLOADS && pending.current.length > 0) {
      const file = pending.current.shift();
      if (!file) return;
      inflight.current += 1;
      void uploadOne(file).finally(() => {
        inflight.current -= 1;
        pump();
      });
    }
  }

  function enqueue(files: File[]) {
    const busy = local.filter((item) => !item.error).length + pending.current.length + inflight.current;
    const room = order.maxPhotos - uploaded.length - busy;
    const next = files.slice(0, Math.max(0, room));
    if (next.length < files.length) {
      setLocal((items) => [
        ...items,
        {
          key: `limit-${crypto.randomUUID()}`,
          progress: 1,
          error: `Можно загрузить не больше ${order.maxPhotos} фото`,
        },
      ]);
    }
    pending.current.push(...next);
    pump();
  }

  async function remove(photoId: string) {
    const result = await deletePhoto.mutateAsync({ id: order.id, photoId });
    remember(result);
  }

  return (
    <WizardFrame
      progress={<WizardProgress activeIndex={1} />}
      title="Загрузите фото комнаты"
      lead={`От 1 до ${order.maxPhotos} снимков одной комнаты · JPEG, PNG, WebP, HEIC`}
      asideStart={
        <div>
          <p className="mb-4 text-label font-medium tracking-wide text-ink-tertiary uppercase">Как снимать</p>
          <TipList
            items={[
              "Снимайте из углов комнаты — так видно больше пространства",
              "2–3 разных ракурса дают лучший результат",
              "Тёмные фото подойдут, но дневной свет — лучше",
              "Беспорядок и люди в кадре не помешают — людей уберём",
            ]}
          />
        </div>
      }
      asideEnd={
        <p className="text-caption text-ink-secondary">
          Фото проверим после отправки на генерацию. Если ракурсов не хватит — попросим догрузить.
        </p>
      }
    >
      <Dropzone disabled={uploaded.length >= order.maxPhotos} onFiles={enqueue} />
      <div className="flex flex-wrap gap-3">
        {uploaded.map((photo, index) => (
          <PhotoThumb
            key={photo.id}
            src={photo.url}
            alt={`Фото комнаты ${index + 1}`}
            onRemove={() => void remove(photo.id)}
          />
        ))}
        {local.map((item) => (
          <PhotoThumb
            key={item.key}
            alt="Загрузка фото"
            progress={item.progress}
            error={item.error}
            onRemove={
              item.error
                ? () => setLocal((items) => items.filter((entry) => entry.key !== item.key))
                : undefined
            }
          />
        ))}
      </div>
      <p className="mt-4 text-caption text-ink-tertiary">
        Загружено {uploaded.length} из {order.maxPhotos}
      </p>
      {uploaded.length === 0 ? (
        <p className="mt-2 text-caption text-ink-secondary">Нужно хотя бы одно фото</p>
      ) : null}
      <div className="mt-8 flex items-center justify-between gap-3">
        <Link href={`${routes.order(order.id)}?step=brief`} className="text-small text-ink-secondary underline">
          Назад
        </Link>
        <Button
          disabled={uploaded.length < 1}
          onClick={() => router.push(`${routes.order(order.id)}?step=submit`)}
        >
          Далее
        </Button>
      </div>
    </WizardFrame>
  );
}
