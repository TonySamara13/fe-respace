import { EditArea } from "@/shared/api/generated/model";

export const EDIT_AREA_OPTIONS: { value: EditArea; label: string }[] = [
  { value: EditArea.FLOOR, label: "Пол" },
  { value: EditArea.WALLS, label: "Стены" },
  { value: EditArea.FURNITURE, label: "Мебель" },
  { value: EditArea.LIGHTING, label: "Свет" },
  { value: EditArea.WINDOWS, label: "Окна и шторы" },
  { value: EditArea.DECOR, label: "Декор" },
  { value: EditArea.OTHER, label: "Другое" },
];

export function editAreaLabel(area: EditArea): string {
  return EDIT_AREA_OPTIONS.find((item) => item.value === area)?.label ?? area;
}
