import type { OrderDtoRs, PhotoRole } from "@/shared/api/generated/model";
import type { addPhotoResponse } from "@/shared/api/generated/photos/photos";
import type { completePhotoResponse } from "@/shared/api/generated/photos/photos";

import { preparePhoto, putPhoto } from "./preparePhoto";

type UploadOrderPhotoArgs = {
  orderId: string;
  file: Blob;
  fileName: string;
  role: PhotoRole;
  addPhoto: (vars: {
    id: string;
    data: { contentType: string; sizeBytes: number; role: PhotoRole };
  }) => Promise<addPhotoResponse>;
  completePhoto: (vars: { id: string; photoId: string }) => Promise<completePhotoResponse>;
  onProgress?: (ratio: number) => void;
  /** Маска уже PNG с альфа-каналом — сжатие могло бы его потерять. */
  compress?: boolean;
};

export async function uploadOrderPhoto({
  orderId,
  file,
  fileName,
  role,
  addPhoto,
  completePhoto,
  onProgress,
  compress = true,
}: UploadOrderPhotoArgs): Promise<OrderDtoRs> {
  const prepared = compress
    ? await preparePhoto(new File([file], fileName, { type: file.type }))
    : { blob: file, contentType: file.type || "image/png" };
  const started = await addPhoto({
    id: orderId,
    data: { contentType: prepared.contentType, sizeBytes: prepared.blob.size, role },
  });
  await putPhoto(started.data.upload.url, started.data.upload.headers, prepared.blob, (progress) => {
    onProgress?.(progress);
  });
  const completed = await completePhoto({ id: orderId, photoId: started.data.photoId });
  return completed.data;
}
