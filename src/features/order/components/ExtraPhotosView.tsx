"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import type { OrderDtoRs } from "@/shared/api/generated/model";
import { PhotoStatus } from "@/shared/api/generated/model";
import { getGetOrderQueryKey, useSubmitExtraPhotos } from "@/shared/api/generated/orders/orders";
import { useAddPhoto, useCompletePhoto } from "@/shared/api/generated/photos/photos";
import { isApiError } from "@/shared/api/errors";
import { formatDateTime } from "@/shared/lib/date";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Dropzone } from "@/shared/ui/Dropzone";
import { Notice } from "@/shared/ui/Notice";
import { PhotoThumb } from "@/shared/ui/PhotoThumb";
import { Toast } from "@/shared/ui/Toast";
import { MAX_PARALLEL_UPLOADS, preparePhoto, putPhoto } from "@/features/wizard";

type ExtraPhotosViewProps = {
  order: OrderDtoRs;
};

export function ExtraPhotosView({ order }: ExtraPhotosViewProps) {
  const [error, setError] = useState<string>();
  const pending = useRef<File[]>([]);
  const inflight = useRef(0);
  const addPhoto = useAddPhoto();
  const completePhoto = useCompletePhoto();
  const submit = useSubmitExtraPhotos();
  const queryClient = useQueryClient();
  const photos = order.photos.filter((photo) => photo.status === PhotoStatus.UPLOADED);

  function remember(result: { data: OrderDtoRs }) {
    queryClient.setQueryData(getGetOrderQueryKey(order.id), result);
  }

  async function uploadOne(file: File) {
    const prepared = await preparePhoto(file);
    const started = await addPhoto.mutateAsync({
      id: order.id,
      data: { contentType: prepared.contentType, sizeBytes: prepared.blob.size },
    });
    await putPhoto(started.data.upload.url, started.data.upload.headers, prepared.blob, () => undefined);
    const completed = await completePhoto.mutateAsync({ id: order.id, photoId: started.data.photoId });
    remember(completed);
  }

  function pump() {
    while (inflight.current < MAX_PARALLEL_UPLOADS && pending.current.length > 0) {
      const file = pending.current.shift();
      if (!file) return;
      inflight.current += 1;
      void uploadOne(file)
        .catch((caught) => setError(isApiError(caught) ? caught.detail : "Не удалось загрузить фото"))
        .finally(() => {
          inflight.current -= 1;
          pump();
        });
    }
  }

  async function onSubmit() {
    setError(undefined);
    try {
      const result = await submit.mutateAsync({ id: order.id });
      remember(result);
    } catch (caught) {
      setError(isApiError(caught) ? caught.detail : "Не удалось продолжить генерацию");
    }
  }

  return (
    <section className="mx-auto max-w-form rounded-card border border-line bg-surface px-6 py-8 shadow-card lg:px-12">
      <Badge>Нужны фото</Badge>
      <h1 className="mt-4 font-display text-display-s font-medium lg:text-heading">Нужны дополнительные фото</h1>
      <p className="mt-3 text-ink-secondary">{order.cabinetMessage}</p>
      {order.extraPhotosDeadline ? (
        <div className="mt-4">
          <Notice variant="info" title={`Ждём до ${formatDateTime(order.extraPhotosDeadline)}`}>
            Затем генерируем по имеющимся фото.
          </Notice>
        </div>
      ) : null}
      <div className="mt-6">
        <Dropzone
          onFiles={(files) => {
            pending.current.push(...files);
            pump();
          }}
        />
        <div className="mb-6 flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <PhotoThumb key={photo.id} src={photo.url} alt={`Фото комнаты ${index + 1}`} />
          ))}
        </div>
        {error ? (
          <div className="mb-4">
            <Toast variant="error">{error}</Toast>
          </div>
        ) : null}
        <Button loading={submit.isPending} onClick={() => void onSubmit()}>
          Готово — продолжить генерацию
        </Button>
      </div>
    </section>
  );
}
