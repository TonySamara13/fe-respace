import { expect, it } from "vitest";

import { EditArea } from "@/shared/api/generated/model";

import { briefSchema, editRequestSchema } from "./schema";

const valid = {
  roomTypeCode: "kitchen",
  stylePresetCode: "",
  text: "Светлая кухня",
  lengthCm: "",
  widthCm: "",
  heightCm: "",
};

it("требует стиль или текст", () => {
  const result = briefSchema.safeParse({ ...valid, text: "  " });
  expect(result.success).toBe(false);
});

it("принимает описание без пресета", () => {
  expect(briefSchema.safeParse(valid).success).toBe(true);
});

it("требует описание точечной правки", () => {
  expect(editRequestSchema.safeParse({ area: EditArea.FLOOR, instruction: "   " }).success).toBe(false);
});

it("принимает запрос правки пола", () => {
  expect(
    editRequestSchema.safeParse({ area: EditArea.FLOOR, instruction: "Светлый дуб вместо ламината" }).success,
  ).toBe(true);
});
