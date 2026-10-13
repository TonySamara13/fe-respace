# Архитектура фронтенда

## Стек

| Задача | Решение | Почему |
|--------|---------|--------|
| Фреймворк | **Next.js** (App Router), актуальная стабильная версия, React 19 | SSR лендинга (SEO), route handlers для BFF |
| Язык | **TypeScript**, `strict: true` | |
| Стили | **Tailwind CSS v4** (`@theme` в CSS) | токены макета переносятся один в один |
| Базовые компоненты | **shadcn/ui** (Radix) — копируются в `src/shared/ui` и перекрашиваются | доступность без чужого визуального стиля |
| Иконки | `lucide-react`, stroke 1.5 | совпадает с линейной графикой макета |
| Серверное состояние | **TanStack Query** v5 | polling статуса заказа, кэш баланса |
| Формы | **react-hook-form** + **zod** (`@hookform/resolvers`) | |
| Клиент API | **orval** → хуки TanStack Query из OpenAPI | типы совпадают с DTO backend |
| Фото | `heic2any` (HEIC → JPEG), `browser-image-compression` | backend принимает только JPEG/PNG/WebP |
| Тесты | **Vitest** + Testing Library (логика, компоненты), **Playwright** (e2e, скриншоты) | |
| Качество | ESLint (`next/core-web-vitals`, `next/typescript`), Prettier + `prettier-plugin-tailwindcss` | |
| Пакетный менеджер | **pnpm** | |

Не добавлять без согласования: UI-киты со своим стилем (MUI, Ant, Chakra, Bootstrap), CSS-in-JS, Redux/MobX, axios (хватает `fetch`), moment.js.

## Структура

```
fe-respace/
  src/
    app/                       # только маршруты: page/layout/loading/error, тонкие
      (marketing)/             # лендинг, legal — серверные компоненты
      (auth)/auth/...          # login, register, verify-email, forgot-password, reset-password
      (cabinet)/cabinet/...    # orders, orders/new, orders/[id], tokens — за авторизацией
      api/
        backend/[...path]/route.ts   # BFF-прокси на be-respace
        session/route.ts             # POST login/register/google → cookie; DELETE → logout
      layout.tsx  globals.css  not-found.tsx  error.tsx
    features/                  # сценарии, каждый — своя папка
      auth/  wizard/  order/  tokens/  history/
        components/  hooks/  lib/  schema.ts
    shared/
      ui/                      # дизайн-система (Button, Card, TokenChip...)
      api/
        generated/             # orval, НЕ редактировать
        fetcher.ts             # mutator для orval: base /api/backend, ProblemDetail → ApiError
        errors.ts              # ApiError, коды ошибок backend
      lib/                     # утилиты без React (format, plural, cn)
      config/                  # env, маршруты (routes.ts)
    proxy.ts                   # редирект неавторизованных из /cabinet/* (в Next.js 16 файл middleware переименован в proxy)
  e2e/                         # Playwright
  orval.config.ts
```

Правила зависимостей: `app` → `features` → `shared`. `features` не импортируют друг друга, кроме публичного `index.ts`. `shared` не знает о `features`.

## Сессия и авторизация (BFF)

Backend выдаёт JWT (`accessToken`, срок 7 дней, refresh-токена нет). Браузер **никогда не видит токен**:

1. Форма логина шлёт `POST /api/session` (route handler Next.js) с `{ mode: "login" | "register" | "google", ... }`.
2. Handler вызывает `be-respace` `/api/v1/auth/*`, кладёт `accessToken` в cookie `rs_session` (`httpOnly`, `secure` в prod, `sameSite=lax`, `path=/`, `maxAge` 7 дней), а `email` и `emailVerified` — в отдельную не-httpOnly cookie `rs_user` (JSON) для UI.
3. Все запросы клиента идут на `/api/backend/<путь>` → прокси добавляет `Authorization: Bearer <cookie>` и пересылает на `BACKEND_URL/api/v1/<путь>`, возвращая статус, заголовки и тело как есть.
4. Ответ `401` от backend → прокси удаляет cookies; клиент редиректит на `/auth/login?next=<текущий путь>`.
5. `src/proxy.ts` (Next.js 16; раньше `middleware.ts`): нет `rs_session` на `/cabinet/*` → редирект на `/auth/login?next=...`; есть сессия на `/auth/login|register` → `/cabinet/orders`.
6. `DELETE /api/session` — logout (удалить обе cookie).

`GET /user/me` в backend нет: `emailVerified` берём из ответа auth и обновляем `rs_user` после успешного `verify-email`. Если понадобится актуальный профиль — попросить добавить эндпоинт в backend, не обходить.

CORS при этой схеме не нужен: браузер ходит только на свой origin. Исключения, где браузер идёт напрямую:

- **PUT фото на presigned S3 URL** (`upload.url` + `upload.headers` из ответа `POST /orders/{id}/photos`) — у S3/MinIO должен быть CORS на origin фронта.
- **Оплата:** `window.location.assign(confirmationUrl)` — ЮKassa или dev-эндпоинт mock-оплаты backend.

## Переменные окружения

| Переменная | Где | Пример |
|------------|-----|--------|
| `BACKEND_URL` | только сервер (BFF, SSR) | `http://localhost:8080` |
| `NEXT_PUBLIC_SITE_URL` | клиент и сервер | `http://localhost:3000` — для `returnUrl` оплаты |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | клиент | Google Sign-In, опционально |

Читать env только через `src/shared/config/env.ts` с валидацией zod; `process.env` в коде фич не использовать.

## Работа с API

- `pnpm api:fetch` сохраняет `http://localhost:8080/v3/api-docs` в `openapi.json` (коммитится); `pnpm api:gen` — orval: вход `openapi.json`, выход `src/shared/api/generated`, клиент `react-query`, mutator `src/shared/api/fetcher.ts`. После изменения DTO в backend — оба скрипта и починить типы.
- `fetcher.ts`: base URL `/api/backend` в браузере и `BACKEND_URL/api/v1` на сервере (SSR, с токеном из cookies). Ошибка → `ApiError { status, code, detail, extra }` из Problem Details.
- Ветвление UI по ошибке — **только по `code`** (`insufficient_tokens`, `order_locked`, `email_not_verified`, `validation_error`...), не по тексту `detail`. `detail` можно показывать пользователю как есть — он на русском.
- `validation_error` из backend показывается у формы целиком; клиентская валидация zod повторяет правила DTO (обязательность, длины, email), чтобы до backend доходили валидные данные.
- Query keys — из orval; после мутаций инвалидировать: заказ (`GET /orders/{id}`), баланс (`GET /tokens/balance`), историю.

## Ключевые сценарии

### Polling заказа

`GET /orders/{id}` с `refetchInterval`: 4 с в `PAID` / `GENERATING`, 15 с в `AWAITING_EXTRA_PHOTOS`, выкл. в остальных. Пауза, когда вкладка скрыта (`refetchIntervalInBackground: false`).

### Загрузка фото

1. Файл: HEIC/HEIF → JPEG (`heic2any`), сжать до ≤ 20 МБ и длинной стороны ~2560 px; типы — `image/jpeg|png|webp`.
2. `POST /orders/{id}/photos` `{ contentType, sizeBytes }` → `{ photoId, upload }`.
3. `PUT upload.url` с `upload.headers` (через `XMLHttpRequest` ради прогресса).
4. `POST /orders/{id}/photos/{photoId}/complete`.
5. Параллельно — не больше 3 загрузок; лимит фото — `maxPhotos` из заказа. Ошибки `too_many_photos`, `photo_too_large`, `unsupported_content_type` — текст у превью.

### Отправка на генерацию и нехватка токенов

1. `POST /orders/{id}/submit` `{ personalDataConsent: true, email? }`.
2. `409 insufficient_tokens` → переход на `/cabinet/tokens?orderId={id}` (путь берём из `purchaseUrl`, добавляем `orderId`). Заказ не меняется.
3. На странице токенов при `orderId`: плашка «Не хватает {required − balance} токенов…», ссылка «← Вернуться к заказу», `returnUrl = ${NEXT_PUBLIC_SITE_URL}/cabinet/orders/{id}` в `POST /tokens/purchases`.
4. Возврат с оплаты: баланс зачисляется webhook-ом асинхронно — опрашивать `GET /tokens/balance` каждые 2 с до 30 с, пока не вырастет; затем пользователь сам нажимает «Отправить на генерацию». Авто-submit не делать.

## Рендеринг

- Лендинг и legal — серверные компоненты; пакеты токенов на лендинге — серверный `fetch` с `revalidate: 300`.
- Кабинет — клиентские компоненты (`"use client"` на уровне фич), страницы `app` остаются тонкими.
- `loading.tsx` — скелетоны в стиле карточек; `error.tsx` — дружелюбная ошибка с кнопкой «Повторить».

## Тестирование

- **Vitest:** чистые функции (`shared/lib`), маппинг статус → экран, zod-схемы, компоненты с логикой (TokenChip low-state, формы).
- **Playwright** против локального backend (mock-оплата, stub-генерация): регистрация → подтверждение (код из лога backend или dev-хелпер) → заказ → нехватка токенов → покупка → submit → `DELIVERED`.
- Проекты Playwright: `mobile` (390×844, `isMobile`, touch) и `desktop` (1440×900). Скриншоты ключевых экранов — `toHaveScreenshot`, для сверки с макетами.
- Перед завершением задачи: `pnpm lint; pnpm typecheck; pnpm test` — зелёные.
