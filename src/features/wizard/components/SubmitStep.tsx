"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { PhotoStatus, type OrderDtoRs } from "@/shared/api/generated/model";
import { getGetOrderQueryKey, useSubmitOrder } from "@/shared/api/generated/orders/orders";
import {
  getGetTokenBalanceQueryKey,
  useGetTokenBalance,
} from "@/shared/api/generated/tokens/tokens";
import { isApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";
import { tokensLabel } from "@/shared/lib/plural";
import { BalanceRows } from "@/shared/ui/BalanceRows";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { PhotoThumb } from "@/shared/ui/PhotoThumb";
import { Timeline } from "@/shared/ui/Timeline";
import { Toast } from "@/shared/ui/Toast";
import { WizardProgress } from "@/shared/ui/WizardProgress";
import { tokensPathFromInsufficient } from "@/shared/lib/purchasePath";

import { submitSchema, type SubmitValues } from "../schema";
import { WizardFrame } from "./WizardFrame";

type SubmitStepProps = {
  order: OrderDtoRs;
};

export function SubmitStep({ order }: SubmitStepProps) {
  const balance = useGetTokenBalance();
  const submit = useSubmitOrder();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<SubmitValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: { personalDataConsent: false },
  });
  const uploaded = order.photos.filter((photo) => photo.status === PhotoStatus.UPLOADED);
  const wallet = balance.data?.data;
  const cost = wallet?.generationCost;
  const remain = wallet && cost !== undefined ? wallet.balance - cost : undefined;
  const roomTitle = [order.brief?.roomTypeName, order.brief?.stylePresetName].filter(Boolean).join(" · ");

  async function onSubmit(values: SubmitValues) {
    try {
      const result = await submit.mutateAsync({
        id: order.id,
        data: { personalDataConsent: values.personalDataConsent },
      });
      queryClient.setQueryData(getGetOrderQueryKey(order.id), result);
      await queryClient.invalidateQueries({ queryKey: getGetTokenBalanceQueryKey() });
      router.replace(routes.order(order.id));
    } catch (error) {
      if (isApiError(error, "insufficient_tokens")) {
        router.push(tokensPathFromInsufficient(error, order.id));
        return;
      }
      form.setError("root", {
        message: isApiError(error) ? error.detail : "Не удалось отправить на генерацию",
      });
    }
  }

  const consentError = form.formState.errors.personalDataConsent?.message;

  return (
    <WizardFrame
      wide
      progress={<WizardProgress activeIndex={2} />}
      title="Генерация"
      lead="Списание токенов и постановка в очередь"
      asideStart={
        <div>
          <p className="mb-4 text-label font-medium tracking-wide text-ink-tertiary uppercase">Что дальше</p>
          <Timeline
            items={[
              { title: "Отправка", text: cost ? `Спишем ${tokensLabel(cost)} с баланса` : "Спишем токены с баланса" },
              { title: "Проверка фото", text: "Если ракурсов мало — попросим догрузить" },
              { title: "Генерация", text: "Около 15 минут" },
              { title: "Готово", text: "Письмо со ссылкой на результат" },
            ]}
          />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-display-s font-medium">Ваша комната</h2>
          {roomTitle ? <p className="mt-3 font-medium">{roomTitle}</p> : null}
          {order.brief?.text ? <p className="mt-2 text-small text-ink-secondary">«{order.brief.text}»</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {uploaded.map((photo, index) => (
              <PhotoThumb key={photo.id} src={photo.url} alt={`Фото комнаты ${index + 1}`} />
            ))}
          </div>
          <p className="mt-4 text-caption text-ink-tertiary">Результат: 3 photoreal JPEG · хранение 90 дней</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {wallet && cost !== undefined && remain !== undefined ? (
            <BalanceRows
              rows={[
                { label: "На балансе", value: tokensLabel(wallet.balance) },
                { label: "Стоимость комнаты", value: `− ${tokensLabel(cost)}` },
                { label: "Останется", value: tokensLabel(remain), accent: true },
              ]}
            />
          ) : null}
          <div className="my-5">
            <Checkbox
              id="personalDataConsent"
              label={
                <>
                  Согласен на{" "}
                  <Link href={routes.privacy}>обработку персональных данных</Link> (фото квартиры)
                </>
              }
              aria-invalid={Boolean(consentError)}
              {...form.register("personalDataConsent")}
            />
            {consentError ? <p className="mt-1 text-caption text-error">{consentError}</p> : null}
          </div>
          {form.formState.errors.root?.message ? (
            <div className="mb-4">
              <Toast variant="error">{form.formState.errors.root.message}</Toast>
            </div>
          ) : null}
          <Button type="submit" block loading={submit.isPending} disabled={!wallet}>
            Отправить на генерацию
            {cost !== undefined ? ` · ${tokensLabel(cost)}` : ""}
          </Button>
          <p className="mt-4 text-center text-caption text-ink-tertiary">
            Не хватает токенов? Перейдём к покупке и вернём вас сюда
          </p>
        </form>
      </div>
    </WizardFrame>
  );
}
