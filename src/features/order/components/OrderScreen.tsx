"use client";

import { useRef } from "react";

import { OrderStatus, type OrderDtoRs } from "@/shared/api/generated/model";
import { useGetOrder } from "@/shared/api/generated/orders/orders";
import { useGetTokenBalance } from "@/shared/api/generated/tokens/tokens";
import { Notice } from "@/shared/ui/Notice";
import { BriefStep, EditStep, PhotosStep, SubmitStep } from "@/features/wizard";

import { resolveWizardStep, viewForStatus } from "../lib/orderScreen";
import { DeliveredView } from "./DeliveredView";
import { ExtraPhotosView } from "./ExtraPhotosView";
import { FailedView } from "./FailedView";
import { GeneratingView } from "./GeneratingView";

const POLL_FAST_MS = 4000;
const POLL_EXTRA_MS = 15_000;
const BALANCE_POLL_MS = 2000;
const BALANCE_POLL_LIMIT_MS = 30_000;

type OrderScreenProps = {
  orderId: string;
  requestedStep?: string;
  returned?: boolean;
};

export function OrderScreen({ orderId, requestedStep, returned = false }: OrderScreenProps) {
  const startedAt = useRef<number | null>(null);
  const orderQuery = useGetOrder(orderId, {
    query: {
      refetchInterval: (query) => {
        const status = query.state.data?.data.status;
        if (status === OrderStatus.PAID || status === OrderStatus.GENERATING) return POLL_FAST_MS;
        if (status === OrderStatus.AWAITING_EXTRA_PHOTOS) return POLL_EXTRA_MS;
        return false;
      },
      refetchIntervalInBackground: false,
    },
  });
  useGetTokenBalance({
    query: {
      enabled: returned,
      refetchInterval: () => {
        if (!returned) return false;
        if (startedAt.current === null) startedAt.current = Date.now();
        return Date.now() - startedAt.current < BALANCE_POLL_LIMIT_MS ? BALANCE_POLL_MS : false;
      },
      refetchIntervalInBackground: false,
    },
  });

  const order = orderQuery.data?.data;
  if (orderQuery.isLoading) return <OrderSkeleton />;
  if (!order) {
    return (
      <div className="mx-auto max-w-form px-5">
        <Notice variant="error" title="Не удалось открыть заказ">
          Обновите страницу или вернитесь к списку заказов.
        </Notice>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {returned ? (
        <div className="mx-auto mb-6 max-w-form px-5">
          <Notice variant="info" title="Проверяем зачисление токенов">
            Когда баланс обновится, нажмите «Отправить на генерацию».
          </Notice>
        </div>
      ) : null}
      <OrderBody order={order} requestedStep={requestedStep} />
    </div>
  );
}

function OrderBody({ order, requestedStep }: { order: OrderDtoRs; requestedStep?: string }) {
  const view = viewForStatus(order.status, order.mode);
  if (view.type === "wizard") {
    const step = resolveWizardStep(order.status, requestedStep, order.mode) ?? view.step;
    if (step === "brief") return <BriefStep order={order} />;
    if (step === "photos") return <PhotosStep order={order} />;
    if (step === "edit") return <EditStep order={order} />;
    return <SubmitStep order={order} />;
  }
  if (view.type === "progress") return <GeneratingView order={order} />;
  if (view.type === "extra-photos") return <ExtraPhotosView order={order} />;
  if (view.type === "delivered") return <DeliveredView order={order} />;
  return <FailedView order={order} />;
}

function OrderSkeleton() {
  return <div className="mx-auto h-80 max-w-form animate-pulse rounded-card bg-muted" />;
}
