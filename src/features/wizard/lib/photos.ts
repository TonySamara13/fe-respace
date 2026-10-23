import { PhotoRole, PhotoStatus, type OrderDtoRs, type PhotoDtoRs } from "@/shared/api/generated/model";

export function photosOf(order: OrderDtoRs, role: PhotoRole, status: PhotoStatus = PhotoStatus.UPLOADED): PhotoDtoRs[] {
  return order.photos.filter((photo) => photo.role === role && photo.status === status);
}

export function firstPhoto(order: OrderDtoRs, role: PhotoRole): PhotoDtoRs | undefined {
  return photosOf(order, role)[0];
}
