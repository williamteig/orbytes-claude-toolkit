# Orbytes — Global Project Instructions

You are working on an Orbytes client project. Orbytes is a digital product studio run by Will Teig (william@orbytes.io) that builds websites and apps for clients using a structured, stage-gated workflow managed in Notion.

## Tools & Platforms

- **Notion** — Project management, copy, brand notes, checklists (always the source of truth)
- **Figma** — Branding assets and lightweight design mockups
- **Webflow** — Optional for some website engagements (native build or headless CMS); **confirm in Notion**—default new sites are **Astro + Tailwind** (see `dev-workflow.md`)
- **GitHub** — Version control under `williamteig` personal account (private repos)
- **Softriver** — Whitelabeled branding partner (delivers logo, palette, fonts)
- **Relume** — Component inspiration and Webflow imports
- **Claude** — Copywriting, development assistance, project automation

## Skills

- **orbytes-context-sync** — Always trigger before starting work on any client project. Loads fresh context from Notion, Figma, and Webflow.
- **orbytes-workflow-sync** — Trigger whenever the core workflow structure changes. Keeps the Notion Project Template and workflow documentation in sync.

## Rules

Detailed rules, gotchas, and conventions are organized by topic in `~/.claude/rules/` (Claude Code) and, after running the Cursor install path, mirrored under `~/.cursor/rules/` as `.mdc` files pointing at the same sources:

- `coding.md` — Naming, commit style, code quality (always active)
- `git.md` — GitHub conventions, branch/PR patterns (always active)
- `workflow.md` — Stage order, approval gates, service tiers
- `figma.md` — Figma URL handling, branding rules, gotchas
- `figma-file-structure.md` — Figma page order, section handoff, design-stage deploy
- `notion.md` — Source of truth rules, database IDs, update patterns
- `webflow.md` — Webflow site management, CMS modes, gotchas
- `astro.md` — Astro defaults for website projects
- `tailwind.md` — Tailwind tokens and breakpoints vs Figma
- `cloudflare.md` — Pages, Workers, secrets, previews
- `cloudcannon.md` — Git-backed CMS editing and branch workflow
- `pipeline.md` — Dev pipeline stages, agent categories, discipline routing
- `dev-workflow.md` — Website vs app dev paths, Astro + Tailwind default, Webflow opt-in, scaffold docs

## Cursor

If you use **Cursor** (not only Claude Code): default `./install.sh` configures **`~/.claude/`** only. Run `./install.sh --target cursor` or `./install.sh --target all` to symlink the same commands, rules (as `.mdc`), and skills into **`~/.cursor/`**.

The **orbytes-claude-toolkit** repo also commits a **`.cursor/`** tree (symlinks into `global/`) so Cloud Agents and clone-local workflows see rules and commands **in-repo**, not only under your home directory. **`AGENTS.md`** at the repo root summarizes when to spawn each agent under `global/agents/`.
