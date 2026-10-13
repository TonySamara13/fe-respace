import { plural, tokensLabel } from "@/shared/lib/plural";

import { describe, expect, it } from "vitest";

describe("склонения", () => {
  it("склоняет токены", () => {
    expect(tokensLabel(1)).toBe("1 токен");
    expect(tokensLabel(2)).toBe("2 токена");
    expect(tokensLabel(5)).toBe("5 токенов");
    expect(tokensLabel(21)).toBe("21 токен");
  });

  it("склоняет комнаты", () => {
    expect(plural(1, { one: "комната", few: "комнаты", many: "комнат" })).toBe("комната");
    expect(plural(3, { one: "комната", few: "комнаты", many: "комнат" })).toBe("комнаты");
    expect(plural(11, { one: "комната", few: "комнаты", many: "комнат" })).toBe("комнат");
  });
});
