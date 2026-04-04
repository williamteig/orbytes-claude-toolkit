# Notion task bridge

Backend (**Cloudflare Worker**) + **Tauri** menu bar app that connect the orbytes Dev Pipeline in Notion to local execution (git worktrees + Cursor CLI). Chrome MV3 is intentionally out of scope for now.

## Repo placement

**Same repo (`orbytes-claude-toolkit`) is fine:** the toolkit stays the source of truth; this app lives under `apps/notion-task-bridge/` so install scripts and `global/` are unchanged. If the Worker or menubar later need their own CI or release cadence, you can split into a new repo and submodule the toolkit—or keep monorepo.

## Layout

- `worker/` — TypeScript Worker, D1 job queue, Notion webhook intake, **PM flesh-out** (Anthropic + Notion API).
- `menubar/` — Tauri 2 app (menu bar tray; hidden window for status + flesh-out trigger).

## Human gates — where you enter secrets and approve access

You must complete these steps before flesh-out and Notion writes work end-to-end.

1. **Anthropic API key** — Create at [Anthropic Console](https://console.anthropic.com/). Put the key in Worker `ANTHROPIC_API_KEY` (local: `worker/.dev.vars`; production: `npx wrangler secret put ANTHROPIC_API_KEY`).
2. **Notion integration** — At [My integrations](https://www.notion.so/my-integrations), create an integration, copy its **Internal Integration Secret** into `NOTION_API_KEY` (same local/secret pattern as above).
3. **Share pages with the integration** — Open your **Dev Pipeline** database and each task page as needed → **⋯** → **Add connections** → select your integration. Without this, Notion returns 403/404 for the Worker.
4. **Cloudflare (production only)** — Run `npx wrangler login` once per machine. Create D1: `npx wrangler d1 create notion-task-bridge`, paste the returned `database_id` into `worker/wrangler.jsonc` (replace the placeholder UUID). Apply migrations: `npx wrangler d1 migrations apply notion-task-bridge --remote`. Set all four secrets with `npx wrangler secret put …` or copy from local `.dev.vars` via `npm run secrets:push` in `worker/`.
5. **Stop and verify** — After deploying, trigger a test flesh-out on a **non-production** task page and confirm properties + body in Notion before using on client work.

## Worker (local dev)

```bash
cd apps/notion-task-bridge/worker
cp .dev.vars.example .dev.vars
# Fill WEBHOOK_SECRET, DEVICE_TOKEN, NOTION_API_KEY, ANTHROPIC_API_KEY
npm install
npm run generate:toolkit
npx wrangler d1 migrations apply notion-task-bridge --local
npm run dev
```

- Health: `GET /health`
- Enqueue **run** job: `POST /api/webhooks/notion` with `Authorization: Bearer $WEBHOOK_SECRET` and JSON `{ "action": "run", "devId": 12, "notionPageId": "optional" }`.
- **Flesh out async** (same auth): `POST /api/webhooks/notion` with `{ "action": "flesh_out", "notionPageId": "<uuid-or-url>" }` — returns immediately; work runs in `waitUntil` (check Worker logs if it fails).
- Manual flesh-out (same as webhook): `POST /api/tasks/flesh-out` with JSON `{ "notionPageId": "..." }`.
- Poll pending **run** jobs: `GET /api/jobs/pending` with `Authorization: Bearer $DEVICE_TOKEN`.

Regenerate embedded toolkit after changing `global/`:

```bash
npm run generate:toolkit
```

## Menubar (local dev)

Requires **Rust** (`cargo` + Xcode CLT on macOS). Copy `.env.example` to `.env` and align tokens with Worker `.dev.vars`.

```bash
cd apps/notion-task-bridge/menubar
cp .env.example .env
npm install
npm run tauri dev
```

Tray → **Open status…** — pending jobs + **Flesh out** field (uses `VITE_WEBHOOK_SECRET` = same value as `WEBHOOK_SECRET`).

## Legacy vendor script (optional)

```bash
./scripts/vendor-toolkit-for-notion-bridge.sh
```

Runtime flesh-out uses `src/generated/toolkit-context.ts` from `npm run generate:toolkit` instead.

## Secrets

| Secret | Used by |
|--------|---------|
| `WEBHOOK_SECRET` | `POST /api/webhooks/notion`, `POST /api/tasks/flesh-out` |
| `DEVICE_TOKEN` | `GET /api/jobs/pending`, `PATCH /api/jobs/:id` |
| `NOTION_API_KEY` | Notion REST (flesh-out) |
| `ANTHROPIC_API_KEY` | Claude (flesh-out) |

Do not commit `.dev.vars` or `menubar/.env`.

## Lint and format

From `worker/` or `menubar/`:

- `npm run lint` — ESLint (TypeScript + `eslint-config-prettier`)
- `npm run lint:fix` — ESLint with autofix
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check (CI-friendly)
- `npm run check` — `worker`: lint + format check + Vitest; `menubar`: lint + format check

Generated Worker code (`worker/src/generated/`) and `worker-configuration.d.ts` are ignored by ESLint/Prettier.

## Limitations

- Flesh-out runs on the Worker with a **CPU/time budget**; very large pages or slow Anthropic responses may fail — check `wrangler tail` / dashboard logs.
- Notion property names must match your Dev Pipeline schema (**Task**, **Status**, **Type**, **Priority**, **Notes**). If your workspace uses different names, adjust `patchNotionPage` in `worker/src/flesh-out.ts`.
- Clearing page body deletes **top-level** blocks only; nested toggles may need manual cleanup in Notion.
