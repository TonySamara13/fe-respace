# fe-respace — frontend Interior Studio

Инструкции для AI-агента, который собирает и развивает фронтенд. Читать **целиком перед первой правкой**.

## Что читать и в каком порядке

1. [../docs/project-context.md](../docs/project-context.md) — продукт, токены, поток заказа. Не противоречить.
2. [../docs/api-reference.md](../docs/api-reference.md) — REST API backend. Источник правды при расхождении — OpenAPI `http://localhost:8080/v3/api-docs`.
3. [docs/architecture.md](docs/architecture.md) — стек, структура, сессия, работа с API.
4. [docs/design-system.md](docs/design-system.md) — токены, Tailwind `@theme`, компоненты, адаптив.
5. [docs/screens.md](docs/screens.md) — маршруты, экраны по статусам заказа, тексты, соответствие макетам.
6. [CODE_STYLE.md](CODE_STYLE.md) — соглашения по коду. **Обязательны.**

Макеты: [../figma/html/](../figma/html/) (desktop 1440 и mobile 390), спецификации — [../figma/spec/](../figma/spec/).
Чтобы посмотреть макет, открой HTML-файл в браузере; общие стили — `../figma/html/shared.css`.

## Жёсткие правила

- **Выглядит как макет.** Цвета, шрифты, радиусы, отступы — только из токенов `docs/design-system.md`. Произвольные значения (`text-[#123456]`, `mt-[37px]`) запрещены, кроме случаев, описанных там же.
- **Mobile-first.** Базовые стили — под 390 px, десктоп — через `md:` / `lg:` / `xl:`. Каждый экран проверяется на 390 и 1440 px.
- **Никакой бизнес-логики, дублирующей backend.** Баланс, стоимость комнаты (30 токенов), цены пакетов, лимит фото — берутся из API (`/tokens/balance`, `/tokens/packages`, `maxPhotos`), а не хардкодятся. Тексты-примеры с числами в маркетинге лендинга допустимы.
- **Генерация — только после списания токенов** на backend (`POST /orders/{id}/submit`). Фронт не «запускает» генерацию сам.
- **JWT не хранится в `localStorage`/`sessionStorage`** и не доступен JS — только httpOnly-cookie через BFF (см. architecture).
- **Тексты UI — на русском**, как в макетах и `docs/screens.md`. Не придумывать новые формулировки про деньги, токены и ПДн.
- **Типы API — только сгенерированные** из OpenAPI (`src/shared/api/generated`, руками не править). Не писать DTO вручную.
- **Код и коммиты:** коммиты — только по явной просьбе разработчика.

## Окружение

- На машине разработчика **Node.js может быть не установлен** — сначала проверь `node --version`; нужен Node LTS (22+) и pnpm (`corepack enable`).
- Shell — PowerShell: команды через `;`, не `&&`.
- Backend: `be-respace`, порт 8080, профиль по умолчанию — mock-оплата и stub-генерация (см. [../be-respace/README.md](../be-respace/README.md)). Фронт — порт 3000 (`respace.frontend-base-url`).

## Порядок сборки с нуля

Каждый шаг заканчивается рабочим состоянием: `pnpm lint`, `pnpm typecheck`, `pnpm test` зелёные, экран проверен на 390 и 1440 px.

1. **Каркас.** `create-next-app` (TypeScript, App Router, Tailwind, ESLint, `src/`), pnpm, Prettier + `prettier-plugin-tailwindcss`, структура папок из architecture.
2. **Дизайн-система.** `@theme` из design-system, шрифты через `next/font`, базовые компоненты `src/shared/ui`: Button, Input, Textarea, Checkbox, Chip, Card, Notice, TokenChip, Spinner. Страница `/dev/ui` (только dev) — витрина компонентов, сверка с `figma/html/desktop/14-components.html`.
3. **API и сессия.** orval из OpenAPI, BFF-прокси `/api/backend/*`, route handlers логина/логаута, `middleware.ts` для защищённых маршрутов.
4. **Auth-экраны:** login, register, verify-email, forgot/reset-password (макеты 02–05).
5. **Лендинг** (01) с пакетами из `GET /tokens/packages`.
6. **Wizard:** бриф → фото → отправка (06–08), ошибка `insufficient_tokens` → покупка токенов.
7. **Покупка токенов** (16), возврат к заказу после оплаты.
8. **Заказ по статусам** (09–12) с polling и галереей.
9. **История заказов** (13), юридические страницы (15), 404/500.
10. **Playwright e2e** основного сценария на mock-backend + скриншоты 390/1440.

После правок UI имеет смысл прогнать ревью субагентом `design-mockup-reviewer` (сверка с макетом, отступы, тексты про токены).
