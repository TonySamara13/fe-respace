# Дизайн-система — Scandinavian Light

Источник: [../../figma/design-tokens/tokens.json](../../figma/design-tokens/tokens.json), [../../figma/html/shared.css](../../figma/html/shared.css), [../../figma/spec/components.md](../../figma/spec/components.md).
При расхождении макета и этого файла — сверяться с HTML-макетом в браузере и обновить этот файл.

## Tailwind `@theme`

`src/app/globals.css` — единственное место, где задаются значения. Скопировать как есть:

```css
@import "tailwindcss";

@theme {
  /* Цвета */
  --color-canvas: #F5F0EB;          /* фон страницы */
  --color-surface: #FFFFFF;         /* карточки, поля */
  --color-muted: #E8E0D6;           /* трек прогресса, disabled */
  --color-ink: #2C3328;             /* основной текст, тёмная лента «Выгодно» */
  --color-ink-secondary: #5A6358;
  --color-ink-tertiary: #8A9188;
  --color-accent: #6B8F71;
  --color-accent-hover: #5A7D60;
  --color-accent-soft: #E8F0E9;     /* зелёный бейдж */
  --color-line: #E8E0D6;            /* обычная рамка */
  --color-line-strong: #C4BDB4;     /* ghost-кнопка, dropzone, линия timeline */
  --color-error: #B54A4A;
  --color-error-bg: #FDF0F0;
  --color-warning: #A67C52;
  --color-warning-bg: #FBF4EA;
  --color-warning-border: #E9D7BF;

  /* Шрифты: переменные задаёт next/font в layout.tsx */
  --font-display: var(--font-cormorant), Georgia, serif;
  --font-sans: var(--font-manrope), system-ui, sans-serif;

  /* Типографика */
  --text-display-xl: 52px;  --text-display-xl--line-height: 1.15;
  --text-display-lg: 40px;  --text-display-lg--line-height: 1.15;
  --text-display-m: 36px;   --text-display-m--line-height: 1.15;   /* H1 лендинга на mobile */
  --text-display-s: 28px;   --text-display-s--line-height: 1.2;    /* H2 секции на mobile */
  --text-heading: 32px;     --text-heading--line-height: 1.15;
  --text-title: 24px;       --text-title--line-height: 1.2;
  --text-body-lg: 17px;     --text-body-lg--line-height: 1.5;
  --text-body: 15px;        --text-body--line-height: 1.5;
  --text-small: 14px;       --text-small--line-height: 1.5;
  --text-caption: 13px;     --text-caption--line-height: 1.5;
  --text-label: 12px;       --text-label--line-height: 1.4;
  --text-micro: 11px;       --text-micro--line-height: 1.3;
  --text-price: 26px;       --text-price--line-height: 1.2;   /* цена пакета */
  --text-stat: 30px;        --text-stat--line-height: 1;      /* число MiniStat */

  /* Радиусы, которых нет в Tailwind по умолчанию */
  --radius-card: 20px;

  /* Тени */
  --shadow-card: 0 4px 24px rgba(44, 51, 40, 0.06);
  --shadow-panel: 0 12px 48px rgba(44, 51, 40, 0.07);

  /* Контейнеры (max-w-*) */
  --container-content: 1100px;
  --container-wizard: 1280px;
  --container-form: 640px;
  --container-auth: 440px;
}

body {
  @apply bg-canvas text-ink font-sans text-body antialiased;
}
```

Шкала отступов — стандартная Tailwind (шаг 4 px): токены макета 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 = `2 / 3 / 4 / 5 / 6 / 8 / 10 / 12 / 16`.

### Радиусы

| Макет | Класс |
|-------|-------|
| 4 px (checkbox) | `rounded-sm` |
| 6 px (polaroid) | `rounded-md` |
| 8 px (input) | `rounded-lg` |
| 12 px (превью фото, результат, toast) | `rounded-xl` |
| 16 px (style card, dropzone, notice) | `rounded-2xl` |
| 20 px (card, pack card) | `rounded-card` |
| 24 px | `rounded-3xl` |
| pill (кнопки, chip, badge) | `rounded-full` |

## Шрифты

| Роль | Шрифт | Где |
|------|-------|-----|
| Display | **Cormorant Garamond** 500 / 600, subsets `latin` + `cyrillic` | логотип, H1–H3, числа токенов и mini-stat |
| Текст | **Manrope** 400 / 500 / 600, subsets `latin` + `cyrillic` | всё остальное |

В макетах указан DM Sans, но **у DM Sans нет кириллицы** — русский текст в макетах фактически рисуется системным шрифтом. Manrope — ближайший по характеру геометрический гротеск с кириллицей. Подключать через `next/font/google` с `variable: "--font-cormorant"` / `"--font-manrope"`, `display: "swap"`.

Числа (цены, токены, баланс, прогресс) — `tabular-nums`; крупные числа Cormorant — `lining-nums`.

### Типографическая шкала

| Стиль | Desktop | Mobile (< md) | Шрифт |
|-------|---------|---------------|-------|
| H1 лендинга | `lg:text-display-xl` | `text-display-m` | display 500 |
| H2 секции | `lg:text-display-lg` | `text-display-s` | display 500 |
| H1 wizard / кабинета | `lg:text-heading` | `text-display-s` | display 500 |
| Логотип | `text-title` 600 | `text-title` | display 600 |
| Lead | `text-body-lg` | `text-body` | sans 400, `text-ink-secondary` |
| Body | `text-body` | `text-body` | sans 400 |
| Кнопка | `text-body` 500 | то же | sans 500 |
| Подсказки, footer | `text-caption` | то же | sans 400 |
| Label поля | `text-label` 500 `text-ink-secondary` | то же | sans 500 |

Нужен размер, которого нет в шкале, — добавить токен в `@theme`, а не произвольное значение.

## Контраст (известное ограничение палитры)

| Пара | Контраст | Норма AA |
|------|----------|----------|
| Белый текст на `accent` | 3.6 : 1 | 4.5 : 1 для текста < 18 px |
| `ink-tertiary` на `canvas` | 2.9 : 1 | 4.5 : 1 |
| `ink-secondary` на `canvas` | 5.5 : 1 | ок |
| `ink` на `canvas` | 11.5 : 1 | ок |

Палитру не менять без решения по дизайну. До решения:

- `ink-tertiary` — только для второстепенного текста (подписи «за комнату», футер, даты), **никогда** для ошибок, цен, подсказок, без которых не пройти шаг.
- Текст ошибок — `text-error`, важные подсказки — `text-ink-secondary`.

## Адаптив

Брейкпоинты — стандартные Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Макеты: mobile 390 (база, без префикса), desktop 1440 (`lg` и выше).

| Блок | Mobile | Desktop |
|------|--------|---------|
| Контейнер | `px-5` | `max-w-content mx-auto px-8` |
| Секция лендинга | `py-10` | `lg:py-16` |
| Wizard | одна колонка: форма, под ней подсказки (свёрнуты в `<details>`) | `xl:` сетка `240px / minmax(0,640px) / 240px`, gap 48, `max-w-wizard`; шаг отправки — `240px / minmax(0,880px)` |
| Карточка формы wizard | `px-6 py-7` | `lg:px-12 lg:pt-10 lg:pb-11` |
| Пакеты токенов | строки: токены слева, цена справа | `md:` сетка из 3 колонок |
| Галерея результатов | 1 колонка | `md:` 3 колонки, aspect 4:3 |
| Auth | карточка на всю ширину, polaroid и line-art скрыты | центр `max-w-auth`, polaroid «До/После» по бокам (`lg:block`) |
| Header | логотип + TokenChip + меню-иконка | логотип, ссылки, TokenChip, CTA |
| Главная кнопка шага | липкая панель снизу (`sticky bottom-0`, фон `canvas`, safe-area) | обычная кнопка в карточке |

Обязательно на mobile:

- Кликабельные элементы ≥ 44×44 px.
- Поля ввода — шрифт ≥ 16 px (`text-base` на `< md`), иначе iOS увеличивает страницу при фокусе.
- `viewport-fit=cover` + `env(safe-area-inset-bottom)` у липкой панели.
- Нет горизонтального скролла на 360 px (минимальная поддерживаемая ширина).
- Декор (`Deco`, line-art, polaroid) — `hidden lg:block`, `aria-hidden`, `pointer-events-none`, никогда не перекрывает контент (контент `relative z-10`).

## Компоненты (`src/shared/ui`)

Значения — из [components.md](../../figma/spec/components.md) и `shared.css`. Варианты — через `class-variance-authority`.

| Компонент | Ключевые параметры | Макет |
|-----------|--------------------|-------|
| `Button` | `primary` (accent → hover accent-hover), `ghost` (рамка line-strong), `disabled` (muted / ink-tertiary); `px-7 py-3 rounded-full text-body font-medium`; `block` — на всю ширину; `loading` — спиннер, текст не прыгает | 14 |
| `Input` / `Textarea` | `h-11 px-4 rounded-lg border-line bg-surface`; focus — кольцо accent 2 px; error — рамка error + helper `text-caption`; textarea min-h 120 | 14 |
| `Field` | label `text-label font-medium text-ink-secondary`, gap 6 px, отступ снизу 16 | |
| `Checkbox` | 20×20, `rounded-sm`, checked — accent; label `text-caption`, ссылки подчёркнуты accent | 08, 16 |
| `Chip` | `px-4 py-2.5 rounded-full bg-canvas text-small`; selected — accent + белый текст | 06 |
| `StyleCard` | `p-4 rounded-2xl border-line bg-surface`; selected — `border-2 border-accent` | 06 |
| `Card` | `bg-surface rounded-card border border-line p-8`; featured — `border-accent` | все |
| `PackCard` | `rounded-card px-8 pt-9 pb-8`, selected — `border-2 border-accent`; число токенов Cormorant 52/600 + «токенов»; цена 26/600; лента «Популярный» (accent) / «Выгодно» (ink) `text-micro uppercase tracking-wide` сверху-слева | 01, 16 |
| `TokenChip` | pill, белый, рамка line; монета 24 px accent с «T»; `text-small font-medium`; low (баланс < стоимости комнаты) — warning-bg / warning-border / монета warning; ссылка на `/cabinet/tokens` | шапка |
| `Notice` | `rounded-2xl px-6 py-4.5 bg-warning-bg border-warning-border`, иконка в белом круге 40 px; варианты `warning`, `error`, `info` | 16 |
| `BalanceRows` | строки `py-3 border-b border-line`, значения `tabular-nums`, итог — accent | 08 |
| `WizardProgress` | «Бриф → Фото → Генерация»; активный — accent, пройденный — галочка accent | 06–08 |
| `Dropzone` | `border-2 border-dashed border-line-strong rounded-2xl px-6 py-12 bg-surface` | 07 |
| `PhotoThumb` | 120×120 (`size-30`), `rounded-xl`, кнопка удаления поверх, прогресс загрузки | 07 |
| `OrderProgress` | текст `cabinetMessage`, трек muted 4 px, заливка accent, подпись «2 из 3» | 09 |
| `Badge` | `text-label px-2.5 py-1 rounded-full bg-canvas text-ink-secondary`; `green` — accent-soft / accent | 13 |
| `TipList`, `MiniStat`, `Timeline`, `Polaroid`, `TrustStrip`, `Deco` | см. components.md | 02–08 |
| `Toast` | error — error-bg / error, `rounded-xl px-4 py-3`; info — surface + рамка | 14 |

## Состояния и взаимодействие

- Hover/active/focus-visible есть у всего кликабельного; фокус — `ring-2 ring-accent ring-offset-2 ring-offset-canvas`.
- Переходы — `transition-colors duration-150`; без анимаций, сдвигающих layout. Уважать `prefers-reduced-motion`.
- Загрузка данных — скелетоны `bg-muted animate-pulse` формы карточек; не спиннер на весь экран.
- Пустые состояния (нет заказов) — короткий текст + CTA «Новая комната», как в макете 13.
- Иконки — `lucide-react`, `strokeWidth={1.5}`, размер 16/20/24.
