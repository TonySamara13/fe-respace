import { ImagePlus } from "lucide-react";
import type { DragEvent } from "react";

type DropzoneProps = {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
};

export function Dropzone({ disabled = false, onFiles }: DropzoneProps) {
  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (disabled) return;
    onFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <label
      className="mb-4 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-line-strong bg-surface px-6 py-12 text-center"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <ImagePlus className="mb-3 text-accent" strokeWidth={1.5} size={40} aria-hidden />
      <span className="font-medium text-ink">Перетащите файлы сюда</span>
      <span className="mt-2 text-caption text-ink-secondary">или выберите с устройства</span>
      <span className="mt-4 inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-small">
        Выбрать файлы
      </span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        multiple
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </label>
  );
}
