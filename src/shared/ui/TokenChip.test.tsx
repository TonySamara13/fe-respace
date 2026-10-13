import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { TokenChip } from "./TokenChip";

it("показывает low-состояние при балансе меньше стоимости комнаты", () => {
  render(<TokenChip balance={10} generationCost={30} />);
  expect(screen.getByRole("link", { name: /10 токенов/ }).className).toContain("bg-warning-bg");
});

it("не красит чип, когда токенов хватает", () => {
  render(<TokenChip balance={70} generationCost={30} />);
  expect(screen.getByRole("link", { name: /70 токенов/ }).className).not.toContain("bg-warning-bg");
});
