import { OrderMode, OrderStatus, type OrderStatus as OrderStatusValue } from "@/shared/api/generated/model";
import { assertNever } from "@/shared/lib/assertNever";

export const REDESIGN_STEPS = ["brief", "photos", "submit"] as const;
export const EDIT_STEPS = ["edit", "submit"] as const;
export const WIZARD_STEPS = ["brief", "photos", "edit", "submit"] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

export type OrderView =
  | { type: "wizard"; step: WizardStep }
  | { type: "progress" }
  | { type: "extra-photos" }
  | { type: "delivered" }
  | { type: "failed" };

export function viewForStatus(
  status: OrderStatusValue,
  mode: typeof OrderMode.REDESIGN | typeof OrderMode.EDIT = OrderMode.REDESIGN,
): OrderView {
  switch (status) {
    case OrderStatus.DRAFT:
      return { type: "wizard", step: mode === OrderMode.EDIT ? "edit" : "brief" };
    case OrderStatus.AWAITING_PHOTOS:
      return { type: "wizard", step: mode === OrderMode.EDIT ? "edit" : "photos" };
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

export function resolveWizardStep(
  status: OrderStatusValue,
  requested: string | undefined,
  mode: typeof OrderMode.REDESIGN | typeof OrderMode.EDIT = OrderMode.REDESIGN,
): WizardStep | null {
  const sequence: readonly WizardStep[] = mode === OrderMode.EDIT ? EDIT_STEPS : REDESIGN_STEPS;
  const max = maxStep(status, mode);
  if (!max) return null;
  if (!requested || !isStep(requested, sequence)) return max;
  if (sequence.indexOf(requested) > sequence.indexOf(max)) return max;
  return requested;
}

function maxStep(
  status: OrderStatusValue,
  mode: typeof OrderMode.REDESIGN | typeof OrderMode.EDIT,
): WizardStep | undefined {
  if (mode === OrderMode.EDIT) {
    if (status === OrderStatus.DRAFT || status === OrderStatus.AWAITING_PHOTOS) return "edit";
    if (status === OrderStatus.AWAITING_PAYMENT) return "submit";
    return undefined;
  }
  if (status === OrderStatus.DRAFT) return "brief";
  if (status === OrderStatus.AWAITING_PHOTOS) return "photos";
  if (status === OrderStatus.AWAITING_PAYMENT) return "submit";
  return undefined;
}

function isStep<T extends readonly string[]>(value: string, steps: T): value is T[number] {
  return steps.some((step) => step === value);
}

export function wizardIndex(step: WizardStep, mode: typeof OrderMode.REDESIGN | typeof OrderMode.EDIT): number {
  const sequence: readonly WizardStep[] = mode === OrderMode.EDIT ? EDIT_STEPS : REDESIGN_STEPS;
  return sequence.indexOf(step);
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
