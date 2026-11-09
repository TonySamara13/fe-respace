export type PinRatio = "tall" | "wide" | "square";

export type Pin = {
  src: string;
  alt: string;
  kicker: string;
  caption: string;
  ratio: PinRatio;
};

export const HERO_FRAME = {
  src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
  alt: "Комната в вечернем свете",
} as const;

export const REEL: Pin[] = [
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    alt: "Гостиная",
    kicker: "Гостиная",
    caption: "Мягкий свет",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
    alt: "Кухня",
    kicker: "Кухня",
    caption: "Другой характер",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
    alt: "Спальня",
    kicker: "Спальня",
    caption: "Тише",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&q=80",
    alt: "Диван в гостиной",
    kicker: "Деталь",
    caption: "Одна деталь, не вся комната",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
    alt: "Светлая кухня",
    kicker: "Кухня",
    caption: "Светлые фасады",
    ratio: "wide",
  },
];

export const STEP_FRAME = {
  src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1400&q=80",
  alt: "Гостиная, в которой меняется настроение",
} as const;
