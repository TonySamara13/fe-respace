import { parseUtc } from "@/shared/lib/date";

import { expect, it } from "vitest";

it("читает время API как UTC без offset", () => {
  const date = parseUtc("2026-10-07T15:00:00");
  expect(date.getUTCHours()).toBe(15);
  expect(date.getUTCDate()).toBe(7);
});
