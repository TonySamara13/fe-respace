"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import type { TokenPackageDtoRs } from "@/shared/api/generated/model";
import { useGetOrder } from "@/shared/api/generated/orders/orders";
import { useGetTokenBalance, usePurchaseTokens } from "@/shared/api/generated/tokens/tokens";
import { isApiError } from "@/shared/api/errors";
import { publicEnv } from "@/shared/config/env";
import { routes } from "@/shared/config/routes";
import { readSessionUser } from "@/shared/lib/sessionUser";
import { DEFAULT_PACK_CODE, packPresentation } from "@/shared/lib/packPresentation";
import { plural, tokensLabel } from "@/shared/lib/plural";
import { BalanceRows } from "@/shared/ui/BalanceRows";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Field } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { Notice } from "@/shared/ui/Notice";
import { PackCard } from "@/shared/ui/PackCard";
import { TipList } from "@/shared/ui/TipList";
import { Toast } from "@/shared/ui/Toast";
import { TrustStrip } from "@/shared/ui/TrustStrip";
import { formatRub } from "@/shared/lib/format";

import { purchaseSchema, type PurchaseValues } from "../schema";

const BALANCE_POLL_MS = 2000;
const BALANCE_POLL_LIMIT_MS = 30_000;

type TokenShopProps = {
  packages: TokenPackageDtoRs[];
  orderId?: string;
  returned?: boolean;
};

export function TokenShop({ packages, orderId, returned = false }: TokenShopProps) {
  const initialCode = packages.some((item) => item.code === DEFAULT_PACK_CODE)
    ? DEFAULT_PACK_CODE
    : packages[0]?.code;
  const [selectedCode, setSelectedCode] = useState(initialCode ?? "");
  const [rootError, setRootError] = useState<string>();
  const user = readSessionUser();
  const startedAt = useRef<number | null>(null);
  const balance = useGetTokenBalance({
    query: {
      refetchInterval: () => {
        if (!returned) return false;
        if (startedAt.current === null) startedAt.current = Date.now();
        return Date.now() - startedAt.current < BALANCE_POLL_LIMIT_MS ? BALANCE_POLL_MS : false;
      },
      refetchIntervalInBackground: false,
    },
  });
  const order = useGetOrder(orderId ?? "", {
    query: { enabled: Boolean(orderId) },
  });
  const purchase = usePurchaseTokens();
  const form = useForm<PurchaseValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: { email: user?.email ?? "", offerConsent: false },
  });

  useEffect(() => {
    if (user?.email) form.setValue("email", user.email);
  }, [form, user?.email]);

  const selected = packages.find((item) => item.code === selectedCode) ?? packages[0];
  const wallet = balance.data?.data;
  const shortage =
    wallet && orderId && wallet.balance < wallet.generationCost ? wallet.generationCost - wallet.balance : 0;
  const roomTitle = [order.data?.data.brief?.roomTypeName, order.data?.data.brief?.stylePresetName]
    .filter(Boolean)
    .join(" · ");

  async function onSubmit(values: PurchaseValues) {
    if (!selected) return;
    setRootError(undefined);
    const returnUrl = orderId
      ? `${publicEnv.siteUrl}${routes.order(orderId)}?returned=1`
      : `${publicEnv.siteUrl}${routes.tokens}?returned=1`;
    try {
      const result = await purchase.mutateAsync({
        data: { packageCode: selected.code, email: values.email, returnUrl },
      });
      window.location.assign(result.data.confirmationUrl);
    } catch (error) {
      setRootError(isApiError(error) ? error.detail : "Не удалось создать платёж");
    }
  }

  const emailError = form.formState.errors.email?.message;
  const consentError = form.formState.errors.offerConsent?.message;
  const after =
    wallet && selected ? wallet.balance + selected.tokens : undefined;

  return (
    <div className="mx-auto w-full max-w-content px-5 pb-16 lg:px-8">
      {orderId ? (
        <Link href={routes.order(orderId)} className="text-caption text-ink-secondary">
          ← Вернуться к заказу{roomTitle ? ` «${roomTitle}»` : ""}
        </Link>
      ) : null}
      <h1 className="mt-4 font-display text-display-s font-medium lg:text-display-lg">Пакеты токенов</h1>
      <p className="mt-2 mb-6 text-ink-secondary">
        Одна комната — 30 токенов · 3 photoreal варианта за ~15 минут
      </p>
      {returned ? (
        <div className="mb-6">
          <Notice variant="info" title="Проверяем зачисление токенов">
            Баланс обновится автоматически, как только оплата подтвердится.
          </Notice>
        </div>
      ) : null}
      {shortage > 0 && wallet ? (
        <div className="mb-8">
          <Notice
            title={`Не хватает ${shortage} ${plural(shortage, { one: "токена", few: "токенов", many: "токенов" })} для генерации комнаты`}
          >
            На балансе {wallet.balance}, нужно {wallet.generationCost}. После оплаты вернём вас к заказу
            {roomTitle ? ` «${roomTitle}»` : ""} — останется нажать «Отправить на генерацию».
          </Notice>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((item) => (
          <PackCard
            key={item.code}
            tokens={item.tokens}
            price={item.price}
            presentation={packPresentation(item.code, Boolean(orderId))}
            selected={item.code === selected?.code}
            actionLabel={item.code === selected?.code ? "Выбрано" : "Выбрать"}
            onSelect={() => setSelectedCode(item.code)}
          />
        ))}
      </div>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          className="rounded-card border border-line bg-surface p-8 shadow-card"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <h2 className="mb-4 font-display text-display-s font-medium">Оплата</h2>
          {rootError ? (
            <div className="mb-4">
              <Toast variant="error">{rootError}</Toast>
            </div>
          ) : null}
          <Field label="Email для чека" htmlFor="email" error={emailError}>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
              {...form.register("email")}
            />
          </Field>
          <Checkbox
            id="offerConsent"
            label={
              <>
                Согласен с <Link href={routes.offer}>офертой</Link> и{" "}
                <Link href={routes.privacy}>обработкой персональных данных</Link>
              </>
            }
            {...form.register("offerConsent")}
          />
          {consentError ? <p className="mt-1 text-caption text-error">{consentError}</p> : null}
          {selected && after !== undefined ? (
            <div className="mt-4">
              <BalanceRows
                rows={[
                  { label: "Пакет", value: tokensLabel(selected.tokens) },
                  { label: "Баланс после оплаты", value: tokensLabel(after), accent: true },
                ]}
              />
            </div>
          ) : null}
          <div className="mt-5">
            <Button type="submit" block loading={purchase.isPending} disabled={!selected}>
              Оплатить {selected ? formatRub(selected.price) : ""}
            </Button>
          </div>
          <TrustStrip items={["ЮKassa", "Мир, Visa, Mastercard", "СБП", "Чек на email"]} />
        </form>
        <div>
          <p className="mb-4 text-label font-medium tracking-wide text-ink-tertiary uppercase">
            Как работают токены
          </p>
          <TipList
            items={[
              "Покупаете пакет — токены сразу на балансе",
              "Каждая комната списывает 30 токенов при отправке на генерацию",
              "Остаток хранится на балансе для следующих комнат",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
