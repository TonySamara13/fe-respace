export const DEFAULT_PACK_CODE = "PACK_70";

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
  if (code === "PACK_70") {
    return {
      ribbon: { label: "Популярный", tone: "accent" },
      perRoom: "≈ 339 ₽ за комнату",
      points: ["2 комнаты + 10 токенов", "Выгоднее на 19%"],
    };
  }
  if (code === "PACK_100") {
    return {
      ribbon: { label: "Выгодно", tone: "ink" },
      perRoom: "315 ₽ за комнату",
      points: ["3 комнаты + 10 токенов", "Выгоднее на 25%"],
    };
  }
  return {
    perRoom: "420 ₽ за комнату",
    points: ["1 комната", forOrder ? "Хватит для текущего заказа" : "Попробовать сервис"],
  };
}
