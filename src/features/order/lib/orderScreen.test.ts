import { OrderMode, OrderStatus } from "@/shared/api/generated/model";

import { describe, expect, it } from "vitest";

import { resolveWizardStep, viewForStatus } from "./orderScreen";

describe("статус заказа", () => {
  it("мапит черновик на бриф", () => {
    expect(viewForStatus(OrderStatus.DRAFT)).toEqual({ type: "wizard", step: "brief" });
  });

  it("мапит ожидание фото и отправку", () => {
    expect(viewForStatus(OrderStatus.AWAITING_PHOTOS)).toEqual({ type: "wizard", step: "photos" });
    expect(viewForStatus(OrderStatus.AWAITING_PAYMENT)).toEqual({ type: "wizard", step: "submit" });
  });

  it("мапит очередь и генерацию на прогресс", () => {
    expect(viewForStatus(OrderStatus.PAID)).toEqual({ type: "progress" });
    expect(viewForStatus(OrderStatus.GENERATING)).toEqual({ type: "progress" });
  });

  it("мапит догрузку, результат и ошибку", () => {
    expect(viewForStatus(OrderStatus.AWAITING_EXTRA_PHOTOS)).toEqual({ type: "extra-photos" });
    expect(viewForStatus(OrderStatus.DELIVERED)).toEqual({ type: "delivered" });
    expect(viewForStatus(OrderStatus.FAILED)).toEqual({ type: "failed" });
  });

  it("не открывает шаг дальше текущего статуса", () => {
    expect(resolveWizardStep(OrderStatus.DRAFT, "submit")).toBe("brief");
    expect(resolveWizardStep(OrderStatus.AWAITING_PAYMENT, "brief")).toBe("brief");
    expect(resolveWizardStep(OrderStatus.AWAITING_PHOTOS, "photos")).toBe("photos");
    expect(resolveWizardStep(OrderStatus.GENERATING, "brief")).toBeNull();
  });

  it("для точечной правки черновик и фото открывают шаг правки", () => {
    expect(viewForStatus(OrderStatus.DRAFT, OrderMode.EDIT)).toEqual({ type: "wizard", step: "edit" });
    expect(viewForStatus(OrderStatus.AWAITING_PHOTOS, OrderMode.EDIT)).toEqual({ type: "wizard", step: "edit" });
    expect(viewForStatus(OrderStatus.AWAITING_PAYMENT, OrderMode.EDIT)).toEqual({ type: "wizard", step: "submit" });
  });

  it("для точечной правки нельзя открыть отправку до заполнения запроса", () => {
    expect(resolveWizardStep(OrderStatus.DRAFT, "submit", OrderMode.EDIT)).toBe("edit");
    expect(resolveWizardStep(OrderStatus.AWAITING_PAYMENT, "edit", OrderMode.EDIT)).toBe("edit");
  });
});
