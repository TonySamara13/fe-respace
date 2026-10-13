import { X } from "lucide-react";

type PhotoThumbProps = {
  src?: string | null;
  alt: string;
  progress?: number;
  error?: string;
  onRemove?: () => void;
};

export function PhotoThumb({ src, alt, progress, error, onRemove }: PhotoThumbProps) {
  return (
    <div className="w-30">
      <div className="relative size-30 overflow-hidden rounded-xl bg-muted">
        {src ? (
          // presigned URL произвольного хоста
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-caption text-ink-tertiary">
            Загрузка
          </span>
        )}
        {typeof progress === "number" && progress < 1 ? (
          <span className="absolute inset-x-0 bottom-0 h-1 bg-muted">
            <span className="block h-full bg-accent" style={{ width: `${Math.round(progress * 100)}%` }} />
          </span>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить фото"
            className="absolute top-1 right-1 flex size-11 items-center justify-center rounded-full bg-surface/90 text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <X size={16} strokeWidth={1.5} aria-hidden />
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-caption text-error">{error}</p> : null}
    </div>
  );
}
