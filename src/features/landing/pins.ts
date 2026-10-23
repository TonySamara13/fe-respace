export type PinRatio = "tall" | "wide" | "square";

export type Pin = {
  src: string;
  alt: string;
  kicker: string;
  caption: string;
  ratio: PinRatio;
};

export const HERO_PINS: Pin[] = [
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80",
    alt: "Светлая гостиная с мягким текстилем",
    kicker: "Гостиная",
    caption: "Спокойный свет и лён",
    ratio: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80",
    alt: "Кухня с деревянными фасадами",
    kicker: "Кухня",
    caption: "Тёплый дуб",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80",
    alt: "Спальня в спокойных тонах",
    kicker: "Спальня",
    caption: "Тихий бежевый",
    ratio: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80",
    alt: "Просторная комната с большими окнами",
    kicker: "Комната",
    caption: "Больше воздуха",
    ratio: "tall",
  },
];

export const IDEA_PINS: Pin[] = [
  {
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    alt: "Столовая у окна",
    kicker: "Столовая",
    caption: "Свет у окна, меньше мебели",
    ratio: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    alt: "Диван и кресло в гостиной",
    kicker: "Гостиная",
    caption: "Мягкая мебель и тёплый пол",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    alt: "Кухня с островом",
    kicker: "Кухня",
    caption: "Светлые фасады, живое дерево",
    ratio: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
    alt: "Скандинавский уголок комнаты",
    kicker: "Деталь",
    caption: "Одна правка: пол, стены или свет",
    ratio: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80",
    alt: "Светлая комната с растениями",
    kicker: "Свет",
    caption: "Больше воздуха и растений",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80",
    alt: "Спальня с текстилем",
    kicker: "Спальня",
    caption: "Текстиль и спокойные стены",
    ratio: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    alt: "Дом с большими окнами",
    kicker: "Окна",
    caption: "Планировку и проёмы не трогаем",
    ratio: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80",
    alt: "Уютный интерьер с деревом",
    kicker: "Своими словами",
    caption: "«Светлый дуб и льняные шторы»",
    ratio: "square",
  },
];
