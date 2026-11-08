export const DEFAULT_PACK_CODE = "PACK_5000";

export type PackRibbon = {
  label: string;
  tone: "accent" | "ink";
};

export type PackPresentation = {
  ribbon?: PackRibbon;
  perRoom: string;
  points: string[];
};

export function packPresentation(code: string, forOrder: boolean): PackPresentation {
  if (code === "PACK_5000") {
    return {
      ribbon: { label: "Популярный", tone: "accent" },
      perRoom: "10 токенов = 1 ₽",
      points: ["Базовый курс"],
    };
  }
  if (code === "PACK_11000") {
    return {
      ribbon: { label: "Выгодно", tone: "ink" },
      perRoom: "Больше токенов за рубль",
      points: ["11 000 токенов"],
    };
  }
  return {
    perRoom: "",
    points: [forOrder ? "Хватит для текущего заказа" : "Стартовый пакет"],
  };
}
