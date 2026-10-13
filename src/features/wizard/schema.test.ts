import { expect, it } from "vitest";

import { briefSchema } from "./schema";

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
