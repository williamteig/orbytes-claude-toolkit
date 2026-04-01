# /new-orbytes-app — Scaffold a new orbytes app project

The user wants to create a new orbytes app (Custom Build) client project. Walk them through the interactive onboarding, then scaffold the project.

## Step 1 — Gather project details

Ask the following questions interactively:

**Question 1: Client/project name**
- "What's the client/project name?" (free text)

**Question 2: Frontend framework**
- Next.js (React) (Recommended)
- SvelteKit
- React Native (mobile app)
- None / API only

**Question 3: Backend**
- Supabase (Recommended — auth, database, storage out of the box)
- Cloudflare Workers + D1
- Node.js (Express/Fastify)
- Python (FastAPI)
- None / frontend only

**Question 4: Additional features**
(Allow multiple selections)- Authentication (email + social login)
- File uploads / storage
- Real-time / websockets
- Scheduled jobs / cron
- Email notifications (Resend/Postmark)
- Payments (Stripe)
- None of the above

## Step 2 — Scaffold the project

Once you have the answers, create the project:

1. **Create the project directory** using the client name (kebab-case)

2. **Copy global layer:**
   - Copy the global `CLAUDE.md` into the project root as `CLAUDE.md`
   - Copy global skills into `.claude/skills/`

3. **Copy app layer:**
   - Merge the app `CLAUDE.md` content into the project's `CLAUDE.md`
   - Write a `stack.md` file documenting the chosen stack and rationale

4. **Initialize the framework:**
   - If **Next.js**: run `npx create-next-app@latest` with TypeScript, Tailwind, App Router, src directory
   - If **SvelteKit**: run `npx sv create` with TypeScript
   - If **React Native**: run `npx create-expo-app` with TypeScript template
   - If **API only**: create a minimal Node/Python project structure
5. **Set up the backend:**
   - If **Supabase**: create `src/lib/supabase.ts` client, add `.env.example` with `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - If **Cloudflare Workers**: create `wrangler.toml` and worker entry point
   - If **Express/Fastify**: create `src/server/` with routes, middleware, and config
   - If **FastAPI**: create `src/api/` with main.py, routers, and requirements.txt

6. **Apply feature customizations:**
   - If **Authentication**: scaffold auth pages/components and middleware
   - If **File uploads**: create upload utility and storage configuration
   - If **Real-time**: add websocket setup or Supabase realtime subscription helpers
   - If **Scheduled jobs**: add cron configuration (Cloudflare Cron Triggers or equivalent)
   - If **Email**: create email service wrapper with templates
   - If **Payments**: create Stripe webhook handler and checkout utility

7. **Create supporting files:**
   - `.gitignore` (framework defaults + `.env`)
   - `.env.example` with all needed environment variables
   - `README.md` with project name, stack overview, and setup instructions
   - `docker-compose.yml` if local services are needed (database, etc.)

8. **Create a Notion task** — Add initial task to the Dev Pipeline:
   - Task: "Project setup: {{CLIENT_NAME}} app"
   - Type: Chore
   - Priority: High
   - Status: In progress
## Step 3 — Initialize and confirm

1. Install dependencies
2. Verify the project builds/starts
3. Initialize git: `git init && git add -A && git commit -m "Initial scaffold via orbytes-claude-toolkit"`
4. Print a summary: chosen stack, file tree, environment variables needed, and next steps

## Toolkit source

Read global files from `$ORBYTES_TOOLKIT_PATH/global/` and app files from `$ORBYTES_TOOLKIT_PATH/app/`. If `ORBYTES_TOOLKIT_PATH` is not set, ask the user where they cloned the toolkit repo.