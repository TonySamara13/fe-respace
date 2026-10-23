"use client";

import { Eraser, Paintbrush, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

const BRUSH_SIZES = [18, 36, 56] as const;

type Tool = "brush" | "eraser";

export type MaskCanvasHandle = {
  exportPng: () => Promise<Blob | null>;
  /** Пользователь сбросил маску и не рисовал заново — удалить загруженную. */
  didClear: () => boolean;
};

type MaskCanvasProps = {
  imageUrl: string;
  alt: string;
  /** Уже сохранённая маска. Если браузер может её прочитать — рисуем на холст и дополняем штрихами. */
  maskUrl?: string | null;
  ref?: React.Ref<MaskCanvasHandle>;
};

export function MaskCanvas({ imageUrl, alt, maskUrl, ref }: MaskCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [sizeIndex, setSizeIndex] = useState(1);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [hideSavedMask, setHideSavedMask] = useState(false);
  const [maskLoaded, setMaskLoaded] = useState(false);
  const clearedRef = useRef(false);
  const pendingMask = useRef<ImageBitmap | null>(null);
  const toolRef = useRef(tool);
  const sizeRef = useRef(BRUSH_SIZES[sizeIndex]);
  const canDraw = !maskUrl || hideSavedMask || maskLoaded;

  useEffect(() => {
    toolRef.current = tool;
    sizeRef.current = BRUSH_SIZES[sizeIndex];
  }, [tool, sizeIndex]);

  const paintSavedMask = useCallback(() => {
    const canvas = canvasRef.current;
    const bitmap = pendingMask.current;
    if (!canvas || !bitmap || canvas.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "rgba(107, 143, 113, 0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    setMaskLoaded(true);
    setHideSavedMask(true);
  }, []);

  useEffect(() => {
    if (!maskUrl) return;
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(maskUrl);
        if (!response.ok) return;
        const bitmap = await createImageBitmap(await response.blob());
        if (cancelled) return;
        pendingMask.current = bitmap;
        paintSavedMask();
      } catch {
        pendingMask.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [maskUrl, paintSavedMask]);

  const paintAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = sizeRef.current * scaleX;
    if (toolRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(107, 143, 113, 0.55)";
    }
    ctx.beginPath();
    const from = last.current ?? { x, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
  }, []);

  useImperativeHandle(ref, () => ({
    exportPng: () => exportMask(canvasRef.current),
    didClear: () => clearedRef.current,
  }));

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-xl bg-muted"
        onPointerDown={(event) => {
          if (!canDraw) return;
          (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
          drawing.current = true;
          last.current = null;
          clearedRef.current = false;
          setHideSavedMask(true);
          paintAt(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          const rect = wrapRef.current?.getBoundingClientRect();
          if (rect) setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          if (drawing.current) paintAt(event.clientX, event.clientY);
        }}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
        }}
        onPointerLeave={() => {
          drawing.current = false;
          last.current = null;
          setCursor(null);
        }}
      >
        {/* presigned URL произвольного хоста */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          className="block w-full select-none"
          draggable={false}
          onLoad={(event) => {
            const image = event.currentTarget;
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            paintSavedMask();
          }}
        />
        {maskUrl && !hideSavedMask ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={maskUrl} alt="" className="pointer-events-none absolute inset-0 size-full opacity-50" />
        ) : null}
        <canvas ref={canvasRef} className="absolute inset-0 size-full touch-none" />
        {cursor ? (
          <span
            className="pointer-events-none absolute rounded-full border border-white"
            style={{
              width: BRUSH_SIZES[sizeIndex],
              height: BRUSH_SIZES[sizeIndex],
              left: cursor.x,
              top: cursor.y,
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden
          />
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-full border border-line bg-canvas px-3 py-2">
        <ToolButton active={tool === "brush"} onClick={() => setTool("brush")} label="Кисть">
          <Paintbrush size={16} strokeWidth={1.5} aria-hidden />
        </ToolButton>
        <ToolButton active={tool === "eraser"} onClick={() => setTool("eraser")} label="Ластик">
          <Eraser size={16} strokeWidth={1.5} aria-hidden />
        </ToolButton>
        <span className="mx-1 h-6 w-px bg-line" aria-hidden />
        {BRUSH_SIZES.map((size, index) => (
          <button
            key={size}
            type="button"
            aria-label={`Размер кисти ${index + 1}`}
            aria-pressed={sizeIndex === index}
            onClick={() => setSizeIndex(index)}
            className="flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <span
              className={cn(
                "rounded-full",
                sizeIndex === index ? "bg-accent" : "bg-line-strong",
              )}
              style={{ width: 6 + index * 4, height: 6 + index * 4 }}
            />
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-line" aria-hidden />
        <ToolButton
          onClick={() => {
            const canvas = canvasRef.current;
            canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
            pendingMask.current = null;
            clearedRef.current = true;
            setMaskLoaded(false);
            setHideSavedMask(true);
          }}
          label="Сбросить"
        >
          <RotateCcw size={16} strokeWidth={1.5} aria-hidden />
        </ToolButton>
      </div>
      {maskUrl && !canDraw ? (
        <p className="mt-2 text-caption text-ink-tertiary">
          Область уже сохранена. «Сбросить» — нарисовать заново.
        </p>
      ) : null}
    </div>
  );
}

function ToolButton({
  active = false,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-small focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        active ? "bg-accent text-white" : "text-ink hover:bg-muted",
      )}
    >
      {children}
      {label}
    </button>
  );
}

async function exportMask(canvas: HTMLCanvasElement | null): Promise<Blob | null> {
  if (!canvas || canvas.width === 0) return null;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const { width, height } = canvas;
  const source = ctx.getImageData(0, 0, width, height);
  const out = ctx.createImageData(width, height);
  let painted = 0;
  for (let i = 0; i < source.data.length; i += 4) {
    if (source.data[i + 3] < 16) continue;
    out.data[i] = 255;
    out.data[i + 1] = 255;
    out.data[i + 2] = 255;
    out.data[i + 3] = 255;
    painted += 1;
  }
  if (painted === 0) return null;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = width;
  exportCanvas.height = height;
  exportCanvas.getContext("2d")?.putImageData(out, 0, 0);
  return new Promise((resolve) => {
    exportCanvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
