# Экраны и маршруты

Пути `/auth/verify-email`, `/auth/reset-password`, `/cabinet/orders/{id}`, `/cabinet/tokens` **зашиты в backend** (письма, `purchaseUrl`) — не менять без правки `be-respace` (`respace.auth.*-path`, `respace.tokens.purchase-path`, `OrderNotificationListener`).

Маршруты держать в `src/shared/config/routes.ts`, в коде не писать строки путей.

## Маршруты

| Маршрут | Доступ | Экран | Макет (`figma/html/…`) | API |
|---------|--------|-------|------------------------|-----|
| `/` | все | Лендинг | `desktop/01`, `mobile/01` | `GET /tokens/packages` |
| `/auth/login` | гость | Вход | `desktop/02`, `mobile/02` | `POST /auth/login`, `/auth/google` |
| `/auth/register` | гость | Регистрация | `desktop/03` | `POST /auth/register` |
| `/auth/verify-email?token=` | все | Ввод 4-значного кода | `desktop/04` | `POST /auth/verify-email`, `POST /user/verification/resend` |
| `/auth/forgot-password` | гость | Запрос сброса (форма email, стиль 05) | `desktop/05` | `POST /auth/forgot-password` |
| `/auth/reset-password?token=` | все | Код + новый пароль | `desktop/05` | `POST /auth/reset-password` |
| `/cabinet/orders` | вход | История заказов | `desktop/13`, `mobile/13` | `GET /user/orders` |
| `/cabinet/orders/new` | вход + email | Создаёт черновик и редиректит на `/cabinet/orders/{id}` | — | `POST /orders` |
| `/cabinet/orders/[id]` | вход | Wizard или состояние заказа — по `status` | `06–12` | `GET /orders/{id}` |
| `/cabinet/tokens?orderId=` | вход | Покупка токенов | `desktop/16`, `mobile/16` | `GET /tokens/packages`, `/tokens/balance`, `POST /tokens/purchases` |
| `/legal/offer`, `/legal/privacy`, `/legal/requisites` | все | Юридические | `desktop/15` | — |

После логина — на `next` из query (только относительный путь, начинающийся с `/`), иначе `/cabinet/orders`.
`409 email_not_verified` на `/cabinet/orders/new` → экран «Подтвердите email» с кнопкой повторной отправки.

## `/cabinet/orders/[id]` по статусу

| `status` | UI | Макет | Polling |
|----------|----|-------|---------|
| `DRAFT` | Wizard, шаг «Бриф» | 06 | — |
| `AWAITING_PHOTOS` | Wizard, шаг «Фото» | 07 | — |
| `AWAITING_PAYMENT` | Wizard, шаг «Генерация» (отправка) | 08 | — |
| `PAID`, `GENERATING` | Прогресс: `cabinetMessage`, `progress.done / total` | 09 | 4 с |
| `AWAITING_EXTRA_PHOTOS` | Догрузка фото + дедлайн `extraPhotosDeadline` + «Запустить генерацию» | 10 | 15 с |
| `DELIVERED` | Галерея `results[]`, скачивание, блок «Ещё одна комната?» с балансом | 11 | — |
| `FAILED` | Ошибка, `cabinetMessage`, «Токены за комнату вернули на баланс», CTA «Новая комната» | 12 | — |

Пока статус редактируемый (`DRAFT…AWAITING_PAYMENT`), шаги wizard переключаются через `?step=brief|photos|submit`; по умолчанию — шаг из таблицы. Нельзя открыть шаг дальше текущего статуса (например, `submit` при `DRAFT`). Маппинг статус → экран — одна чистая функция в `features/order/lib`, покрыта тестом.

`AWAITING_PAYMENT` и `PAID` — исторические имена: в UI это «Готов к отправке» и «В очереди». Слово «оплата» в контексте заказа не использовать.

## Wizard

- **Бриф:** тип комнаты (Chip, из `GET /catalog`), стиль (StyleCard) и/или текст; размеры — опционально. Ошибка `brief_empty` — «Выберите стиль или опишите желаемый интерьер». Сохранение — `PUT /orders/{id}/brief` по кнопке «Далее».
- **Фото:** 1–`maxPhotos` фото, Dropzone + превью, подсказки «Как снимать». Кнопка «Далее» активна при ≥ 1 загруженном фото.
- **Генерация (отправка):** карточка комнаты (бриф + превью), `BalanceRows` «На балансе / Стоимость комнаты / Останется», чекбокс согласия на обработку ПДн, кнопка **«Отправить на генерацию · 30 токенов»** (число — `generationCost` из `/tokens/balance`). При балансе < стоимости кнопка остаётся активной, а `TokenChip` — в low-состоянии; переход на покупку — по ответу `insufficient_tokens`.

## Покупка токенов

- Пакеты из API; по умолчанию выбран `PACK_70` (лента «Популярный»), у `PACK_100` — «Выгодно».
- `?orderId=` → Notice «Не хватает {required − balance} токенов для генерации комнаты» + «← Вернуться к заказу».
- Карточка оплаты: email (из сессии, редактируемый), чекбокс «Согласен с офертой и обработкой персональных данных», «Баланс после оплаты», кнопка «Оплатить {price} ₽» → `window.location.assign(confirmationUrl)`.
- Блок «Как работают токены» — 3 пункта из макета.

## Фиксированные тексты

Денежные и токенные формулировки — **только эти** (из [../../figma/spec/sitemap.md](../../figma/spec/sitemap.md)):

- Одна комната — **30 токенов** → 3 photoreal варианта за ~15 минут.
- 30 токенов — 420 ₽ · 1 комната.
- 70 токенов — 790 ₽ · 2 комнаты + 10 токенов · «Популярный» · ≈ 339 ₽ за комнату · выгоднее на 19%.
- 100 токенов — 1050 ₽ · 3 комнаты + 10 токенов · «Выгодно» · 315 ₽ за комнату · выгоднее на 25%.
- Провал генерации: «Токены за комнату вернули на баланс».
- Код подтверждения email действует **15 минут**.
- Результаты хранятся **90 дней**.

Склонение «токен / токена / токенов», «комната / комнаты / комнат» — через `Intl.PluralRules("ru")` в `shared/lib/plural.ts`. Цены — `Intl.NumberFormat("ru-RU")` + « ₽» (неразрывный пробел). Даты — `ru-RU`, время приходит из API в UTC без offset: парсить как UTC и показывать в локальной зоне.

## Общие элементы

- **Header** на всех экранах; после входа — `TokenChip` (баланс из `GET /tokens/balance`), «Мои заказы», «Новая комната»; на mobile — меню-иконка.
- **Footer** — «Оферта · Политика ПДн · Реквизиты ИП», `text-caption text-ink-tertiary`.
- **404 / ошибка** — в стиле карточки с line-art, CTA «На главную».
- `<title>` и `description` на каждой странице; кабинет и auth — `robots: noindex`.
