import { formatRub } from "@/shared/lib/format";

import { expect, it } from "vitest";

it("форматирует рубли с неразрывным пробелом", () => {
  expect(formatRub(420)).toBe("420\u00A0₽");
  expect(formatRub("1050.00")).toBe("1\u00A0050\u00A0₽");
});
