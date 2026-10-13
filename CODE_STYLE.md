# Code style — fe-respace

Соглашения фронтенда Interior Studio (Next.js App Router + TypeScript + Tailwind v4).
Главный принцип, как и в backend: **пиши так, как написан соседний код**. Форматирование — Prettier, остальное — ESLint и правила ниже.

---

## 1. Общее

| Правило | Комментарий |
|---------|-------------|
| Тексты UI — **русский**; имена в коде — **английский** | `OrderProgress`, `useTokenBalance` |
| Комментарии — русский, только когда код не может сказать сам (ограничение, неочевидная причина) | не пересказывать код |
| TypeScript `strict`, без `any`, без `@ts-ignore` | `unknown` + сужение типа; `@ts-expect-error` с причиной — в крайнем случае |
| Без `!` (non-null assertion) | ранний выход, `??`, явная проверка |
| Минимальный diff: не переформатировать и не «улучшать» соседний код без запроса | |
| Неиспользуемый код, закомментированные блоки, `console.log` — не оставлять | |
| Prettier: 2 пробела, двойные кавычки, точки с запятой, `printWidth` 100, trailing commas | |

---

## 2. Файлы и именование

| Что | Имя | Пример |
|-----|-----|--------|
| Компонент | `PascalCase.tsx`, один экспортируемый компонент на файл | `TokenChip.tsx` |
| Хук | `useCamelCase.ts` | `useOrderPolling.ts` |
| Утилита, схема, константы | `camelCase.ts` | `plural.ts`, `schema.ts` |
| Тест | рядом с файлом: `*.test.ts(x)`; e2e — `e2e/*.spec.ts` | `orderScreen.test.ts` |
| Маршрут | по правилам Next: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` | |
| Папки | `kebab-case` | `features/order/components` |

- Экспорт — **именованный**; `export default` только там, где требует Next.js (`page`, `layout`, …).
- Публичный API фичи — `features/<name>/index.ts`; извне импортировать только из него.
- Импорты — через алиас `@/` (`@/shared/ui`), без `../../..`. Порядок: внешние пакеты → `@/` → относительные; между группами пустая строка.
- Константы модуля — `UPPER_SNAKE_CASE` в начале файла: `const POLL_INTERVAL_MS = 4000;`. Магические числа и строки статусов — через константы или сгенерированные типы API.

---

## 3. Компоненты

- Функциональные компоненты, `function Name(props: NameProps)`; тип пропсов — `type NameProps = {...}` над компонентом.
- **Server Components по умолчанию.** `"use client"` — только в листовых интерактивных компонентах и фичах кабинета, не в `layout.tsx` и не в `page.tsx` без необходимости.
- `page.tsx` тонкий: параметры маршрута → компонент фичи. Бизнес-логика — в `features/*/hooks` и `features/*/lib`.
- Один компонент — одна ответственность; > ~150 строк или 3+ состояния — разделить.
- Условный рендер по статусу/варианту — `switch` по union-типу с исчерпывающей проверкой:

```ts
function assertNever(value: never): never {
  throw new Error(`Неизвестное значение: ${String(value)}`);
}
```

- Списки — стабильный `key` (id из API), не индекс.
- Изображения — `next/image` (для presigned URL — `unoptimized` или `remotePatterns` хоста S3), всегда `alt` на русском; декоративные — `alt=""` и `aria-hidden`.
- Ссылки — `next/link`; внешние — `target="_blank" rel="noopener noreferrer"`.

---

## 4. Стили (Tailwind)

- Только классы из `@theme` (`docs/design-system.md`) и стандартной шкалы Tailwind. **Запрещены** произвольные значения цветов, шрифтов, радиусов, теней (`bg-[#…]`, `rounded-[13px]`). Исключение — сетки из макета (`grid-cols-[240px_minmax(0,640px)_240px]`) и позиционирование декора.
- Не хватает значения — добавить токен в `@theme` и в `design-system.md`.
- Mobile-first: база — mobile, затем `md:` / `lg:` / `xl:`. Не писать `max-*:` без причины.
- Слияние классов — `cn()` (`clsx` + `tailwind-merge`) из `@/shared/lib/cn`; варианты — `cva`.
- Без `style={{…}}`, CSS-модулей и глобальных классов, кроме `globals.css` (`@theme`, `body`, `@font-face` при необходимости).
- `@apply` — только в `globals.css` для `body` и базовых тегов.
- Порядок классов — `prettier-plugin-tailwindcss`, руками не сортировать.

---

## 5. Данные и API

- Запросы — **только** через хуки orval (`src/shared/api/generated`) или `fetcher` из `@/shared/api`. Прямой `fetch` к backend в компонентах запрещён.
- Сгенерированные файлы не редактировать; обёртки и адаптеры — в `features/*/hooks`.
- Серверное состояние — TanStack Query; не дублировать его в `useState` / контексте. Локальное UI-состояние — `useState`; межкомпонентное в пределах фичи — props или небольшой контекст фичи. Глобальных сторов нет.
- Ошибки API — `ApiError` с `code`; ветвление по `code`:

```ts
if (isApiError(error, "insufficient_tokens")) {
  router.push(routes.tokens({ orderId }));
  return;
}
```

- Мутации: кнопка в `loading` и `disabled` на время запроса (защита от двойного submit); после успеха — `invalidateQueries` нужных ключей.
- Деньги приходят строкой/числом в рублях — только форматировать (`formatRub`), не вычислять цены на фронте. Остаток после списания («Останется») — `balance − generationCost` из API.
- Время из API — UTC без offset; парсить через `parseUtc()` из `shared/lib/date`.

---

## 6. Формы

- `react-hook-form` + `zodResolver`; схема — `features/<name>/schema.ts`, тип — `z.infer`.
- Сообщения валидации — русские, совпадают по смыслу с `message` в DTO backend.
- Ошибки backend `validation_error` / бизнес-коды — `setError("root", …)` или на конкретное поле, если `code` однозначно на него указывает.
- Каждое поле — через `Field` (label + control + helper/error); `id`/`htmlFor`, `aria-invalid`, `aria-describedby`.
- `type`, `inputMode`, `autoComplete` — всегда (`email`, `current-password`, `new-password`, `one-time-code`).
- Submit по Enter работает; кнопка — `type="submit"`.

---

## 7. Доступность

- Семантика: `button` для действий, `a` для навигации, один `h1` на странице, заголовки по порядку.
- Всё доступно с клавиатуры; видимый `focus-visible`.
- Интерактивные элементы ≥ 44×44 px на mobile.
- Иконки без текста — `aria-label`; статус загрузки/генерации — `aria-live="polite"`.
- Чекбоксы согласий — настоящий `<input type="checkbox">` (через Radix/shadcn), не `div`.

---

## 8. Безопасность

- Токен сессии — только в httpOnly-cookie (см. `docs/architecture.md`). Не логировать токены, коды подтверждения, email целиком.
- `next` после логина и любые redirect-параметры — только относительные пути (`startsWith("/") && !startsWith("//")`).
- Без `dangerouslySetInnerHTML`. Текст от пользователя (бриф) выводить как текст.
- Секреты — только в серверных env без `NEXT_PUBLIC_`.

---

## 9. Тесты

- Vitest + Testing Library; имена тестов — русские фразы: `it("показывает low-состояние при балансе меньше стоимости комнаты")`.
- Тестировать поведение (что видит и делает пользователь), не реализацию; запросы к элементам — `getByRole` / `getByLabelText`.
- Обязательно покрыть: маппинг статус → экран, склонения и форматирование, zod-схемы, обработку `insufficient_tokens`.
- Playwright — сценарии из `docs/architecture.md`, проекты `mobile` (390) и `desktop` (1440).
- Перед завершением задачи: `pnpm lint; pnpm typecheck; pnpm test`.

---

## 10. Git

- Коммиты и MR — только по явному решению разработчика.
- Сообщение коммита — по-русски: что сделано.
- `src/shared/api/generated` коммитится (сборка не зависит от запущенного backend); `openapi.json` — тоже, рядом с `orval.config.ts`.
