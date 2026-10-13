import { ApiError } from "@/shared/api/errors";

import { expect, it } from "vitest";

import { tokensPathFromInsufficient } from "./purchasePath";

it("ведёт на покупку токенов с orderId при insufficient_tokens", () => {
  const error = new ApiError(409, "insufficient_tokens", "Не хватает токенов", {
    balance: 10,
    required: 30,
    purchaseUrl: "http://localhost:3000/cabinet/tokens",
  });
  expect(tokensPathFromInsufficient(error, "order-1")).toBe("/cabinet/tokens?orderId=order-1");
});
