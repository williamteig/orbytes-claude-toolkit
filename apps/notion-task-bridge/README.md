# Notion task bridge

Backend (**Cloudflare Worker**) + **Tauri** menu bar app that connect the orbytes Dev Pipeline in Notion to local execution (git worktrees + Cursor CLI). Chrome MV3 is intentionally out of scope for now.

## Repo placement

**Same repo (`orbytes-claude-toolkit`) is fine:** the toolkit stays the source of truth; this app lives under `apps/notion-task-bridge/` so install scripts and `global/` are unchanged. If the Worker or menubar later need their own CI or release cadence, you can split into a new repo and submodule the toolkit—or keep monorepo.

## Layout

- `worker/` — TypeScript Worker, D1 job queue, Notion webhook intake.
- `menubar/` — Tauri 2 app (menu bar tray; hidden window for status JSON).

## Worker (local dev)

```bash
cd apps/notion-task-bridge/worker
cp .dev.vars.example .dev.vars   # set WEBHOOK_SECRET and DEVICE_TOKEN
npm install
npx wrangler d1 migrations apply notion-task-bridge --local
npm run dev
```

- Health: `GET /health`
- Enqueue job (Notion automation or curl): `POST /api/webhooks/notion` with `Authorization: Bearer $WEBHOOK_SECRET` and JSON body `{ "action": "run", "devId": 12 }` or `{ "action": "flesh_out", "notionPageId": "..." }`.
- Poll pending: `GET /api/jobs/pending` with `Authorization: Bearer $DEVICE_TOKEN`.

Deploy: create a real D1 database (`wrangler d1 create notion-task-bridge`), put its `database_id` in `wrangler.jsonc`, set secrets (`wrangler secret put WEBHOOK_SECRET`), etc.

## Menubar (local dev)

Requires **Rust** (for `cargo`). Copy `.env.example` to `.env` and align with Worker `.dev.vars` `DEVICE_TOKEN`.

```bash
cd apps/notion-task-bridge/menubar
cp .env.example .env
npm install
npm run tauri dev
```

Tray → **Open status…** shows the hidden window with pending jobs (polls every 30s).

## Vendoring toolkit markdown for PM flesh-out (later)

From repo root:

```bash
./scripts/vendor-toolkit-for-notion-bridge.sh
```

The Worker can read `worker/vendor-toolkit/` at runtime to build LLM prompts (not implemented in v0 yet).

## Secrets

| Secret | Used by |
|--------|---------|
| `WEBHOOK_SECRET` | `POST /api/webhooks/notion` |
| `DEVICE_TOKEN` | `GET /api/jobs/pending`, `PATCH /api/jobs/:id` |

Do not commit `.dev.vars` or `menubar/.env`.
