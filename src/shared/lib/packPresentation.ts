export const DEFAULT_PACK_CODE = "PACK_5000";

export type PackRibbon = {
  label: string;
  tone: "accent" | "ink";
};

export type PackPresentation = {
  title: string;
  ribbon?: PackRibbon;
  perRoom: string;
  points: string[];
};

export function packTitle(code: string): string {
  if (code === "PACK_2000") return "Комфорт";
  if (code === "PACK_5000") return "Бизнес";
  if (code === "PACK_11000") return "Премиум";
  return "Пакет";
}

export function packPresentation(code: string, forOrder: boolean): PackPresentation {
  if (code === "PACK_5000") {
    return {
      title: packTitle(code),
      ribbon: { label: "Популярный", tone: "accent" },
      perRoom: "10 токенов = 1 ₽",
      points: ["Базовый курс"],
    };
  }
  if (code === "PACK_11000") {
    return {
      title: packTitle(code),
      ribbon: { label: "Выгодно", tone: "ink" },
      perRoom: "Больше токенов за рубль",
      points: ["11 000 токенов"],
    };
  }
  return {
    title: packTitle(code),
    perRoom: "",
    points: [forOrder ? "Хватит для текущего заказа" : "Стартовый пакет"],
  };
}
