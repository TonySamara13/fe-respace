# fe-respace

Фронтенд Interior Studio: Next.js, BFF-сессия, пакеты токенов и заказ комнаты.

Правила для агентов — [AGENTS.md](./AGENTS.md). Экраны — [docs/screens.md](./docs/screens.md).

## Запуск

Нужны Node.js 22+ и pnpm (`corepack pnpm`, если `pnpm` не в PATH).

```powershell
cd fe-respace
copy .env.example .env
corepack pnpm install
corepack pnpm dev
```

Приложение: http://localhost:3000. Backend: http://localhost:8080 (`BACKEND_URL`).

```powershell
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm api:fetch   # обновить openapi.json с запущенного backend
corepack pnpm api:gen
corepack pnpm test:e2e
```

`src/shared/api/generated` собирается из `openapi.json` и коммитится.
