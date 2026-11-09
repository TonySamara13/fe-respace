"use client";

import { useId, useState } from "react";

type CompareSliderProps = {
  beforeUrl: string;
  afterUrl: string;
};

export function CompareSlider({ beforeUrl, afterUrl }: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        {/* presigned URL произвольного хоста */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeUrl} alt="До правки" className="block w-full" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterUrl} alt="" className="size-full object-contain" />
        </div>
        <span
          className="pointer-events-none absolute inset-y-0 w-px bg-white"
          style={{ left: `${position}%` }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-night shadow-card"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          ‹ ›
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-surface/90 px-2 py-2 text-caption">До</span>
        <span className="absolute right-4 bottom-4 rounded-full bg-surface/90 px-2 py-2 text-caption">После</span>
        <label className="sr-only" htmlFor={id}>
          Сравнение до и после
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 cursor-ew-resize opacity-0"
        />
      </div>
      <p className="mt-2 text-center text-caption text-ink-tertiary">Потяните ползунок, чтобы сравнить</p>
    </div>
  );
}
