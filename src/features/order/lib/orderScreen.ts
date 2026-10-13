import { OrderStatus, type OrderStatus as OrderStatusValue } from "@/shared/api/generated/model";
import { assertNever } from "@/shared/lib/assertNever";

export const WIZARD_STEPS = ["brief", "photos", "submit"] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

const STEP_BY_STATUS: Partial<Record<OrderStatusValue, WizardStep>> = {
  [OrderStatus.DRAFT]: "brief",
  [OrderStatus.AWAITING_PHOTOS]: "photos",
  [OrderStatus.AWAITING_PAYMENT]: "submit",
};

export type OrderView =
  | { type: "wizard"; step: WizardStep }
  | { type: "progress" }
  | { type: "extra-photos" }
  | { type: "delivered" }
  | { type: "failed" };

export function viewForStatus(status: OrderStatusValue): OrderView {
  switch (status) {
    case OrderStatus.DRAFT:
      return { type: "wizard", step: "brief" };
    case OrderStatus.AWAITING_PHOTOS:
      return { type: "wizard", step: "photos" };
    case OrderStatus.AWAITING_PAYMENT:
      return { type: "wizard", step: "submit" };
    case OrderStatus.PAID:
    case OrderStatus.GENERATING:
      return { type: "progress" };
    case OrderStatus.AWAITING_EXTRA_PHOTOS:
      return { type: "extra-photos" };
    case OrderStatus.DELIVERED:
      return { type: "delivered" };
    case OrderStatus.FAILED:
      return { type: "failed" };
    default:
      return assertNever(status);
  }
}

export function resolveWizardStep(status: OrderStatusValue, requested: string | undefined): WizardStep | null {
  const max = STEP_BY_STATUS[status];
  if (!max) return null;
  if (!requested || !isWizardStep(requested)) return max;
  if (WIZARD_STEPS.indexOf(requested) > WIZARD_STEPS.indexOf(max)) return max;
  return requested;
}

function isWizardStep(value: string): value is WizardStep {
  return WIZARD_STEPS.some((step) => step === value);
}

export function wizardIndex(step: WizardStep): number {
  return WIZARD_STEPS.indexOf(step);
}

export function statusBadge(status: OrderStatusValue): {
  label: string;
  tone: "neutral" | "green" | "error";
} {
  switch (status) {
    case OrderStatus.DELIVERED:
      return { label: "Готово", tone: "green" };
    case OrderStatus.PAID:
    case OrderStatus.GENERATING:
      return { label: "Генерация", tone: "neutral" };
    case OrderStatus.AWAITING_EXTRA_PHOTOS:
      return { label: "Нужны фото", tone: "neutral" };
    case OrderStatus.FAILED:
      return { label: "Ошибка", tone: "error" };
    case OrderStatus.DRAFT:
      return { label: "Черновик", tone: "neutral" };
    case OrderStatus.AWAITING_PHOTOS:
      return { label: "Фото", tone: "neutral" };
    case OrderStatus.AWAITING_PAYMENT:
      return { label: "Готов к отправке", tone: "neutral" };
    default:
      return assertNever(status);
  }
}
