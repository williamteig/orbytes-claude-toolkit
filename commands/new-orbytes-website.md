# /new-orbytes-website — Scaffold a new orbytes website project

The user wants to create a new orbytes website client project. Walk them through the interactive onboarding, then scaffold the project.

## Step 1 — Gather project details

Ask the following questions interactively (use AskUserQuestion or equivalent prompts):

**Question 1: Client name**
- "What's the client/project name?" (free text)

**Question 2: Service tier**
- Landing Page — single page, fixed price
- Full Website — multi-page with CMS, fixed price

**Question 3: Deployment target**
- Vercel (Recommended)
- Cloudflare Pages
- Netlify
- Other

**Question 4: Additional integrations**
(Allow multiple selections)
- Webflow CMS (headless content from Webflow)
- Blog / Content Collections
- Contact form- Analytics (Plausible/Fathom)
- None of the above

## Step 2 — Scaffold the project

Once you have the answers, create the project:

1. **Create the project directory** using the client name (kebab-case)

2. **Copy global layer:**
   - Copy the global `CLAUDE.md` into the project root as `CLAUDE.md`
   - Copy global skills into `.claude/skills/`

3. **Copy website layer:**
   - Merge the website `CLAUDE.md` content into the project's `CLAUDE.md` (append after global rules)
   - Copy website templates into the project root:
     - `package.json` (replace `{{PROJECT_NAME}}` with the project name)
     - `astro.config.mjs` (replace `{{SITE_URL}}` with a placeholder or provided URL)
     - `tsconfig.json`
     - `src/layouts/BaseLayout.astro` (replace `{{DEFAULT_DESCRIPTION}}`)
     - `src/pages/index.astro` (replace `{{PROJECT_NAME}}`)

4. **Create the directory structure:**
   ```
   src/
   ├── components/
   │   ├── ui/
   │   ├── sections/
   │   └── layout/   ├── layouts/
   ├── pages/
   ├── styles/
   ├── assets/
   └── lib/
   ```

5. **Apply customizations based on answers:**
   - If **Webflow CMS** selected: add `src/lib/webflow.ts` with a placeholder API client
   - If **Blog** selected: create `src/content/config.ts` with a blog collection schema
   - If **Contact form** selected: create `src/components/sections/ContactForm.astro` placeholder
   - If **Analytics** selected: add analytics snippet to `BaseLayout.astro`

6. **Create supporting files:**
   - `.gitignore` (Astro defaults)
   - `.prettierrc` with Astro plugin config
   - `README.md` with project name and basic setup instructions
   - `.env.example` with any needed environment variables

7. **Create a Notion task** — Add an initial task to the Dev Pipeline:
   - Task: "Project setup: {{CLIENT_NAME}} website"
   - Type: Chore
   - Priority: High
   - Project: Ask which project tag to use, or create suggestion
   - Status: In progress
## Step 3 — Initialize and confirm

1. Run `npm install` in the project directory
2. Confirm the project builds with `npm run build`
3. Initialize git: `git init && git add -A && git commit -m "Initial scaffold via orbytes-claude-toolkit"`
4. Print a summary of what was created, including file tree and next steps

## Toolkit source

The template files for this command are in the orbytes-claude-toolkit repository. The install script sets the `ORBYTES_TOOLKIT_PATH` environment variable pointing to where the repo is cloned. Read templates from `$ORBYTES_TOOLKIT_PATH/website/templates/` and global files from `$ORBYTES_TOOLKIT_PATH/global/`.

If `ORBYTES_TOOLKIT_PATH` is not set, ask the user where they cloned the toolkit repo.