---
description: >-
  Orbytes development workflow — website vs custom app paths, default stacks, Webflow opt-in,
  and where global vs scaffolded project docs apply. Apply when planning or executing dev work.
alwaysApply: false
---

# Development workflow

## Global vs project-local docs

| Layer | Location | Role |
|-------|----------|------|
| **Global** | `global/rules/*.md`, `global/CLAUDE.md` | Defaults and cross-project rules (Git, pipeline, Astro/Tailwind summaries, Webflow when used). |
| **Website scaffold** | `website/CLAUDE.md` (copied into new site repos) | Astro + Tailwind conventions, CMS choice, performance—**this** is the living website contract for that codebase. |
| **App scaffold** | `app/CLAUDE.md` (copied into new app repos) | Architecture, security, testing—adapted to the **chosen stack** after workshopping. |

Always check **Notion** for the client: engagement tier, URLs, and whether a **Webflow** site exists before assuming tools.

---

## Website projects (standard path)

Default **implementation stack** for new orbytes marketing sites:

1. **Astro** + **Tailwind CSS**
2. **Deploy** — commonly **Cloudflare Pages** or **Vercel** (follow the project)
3. **CMS (when needed)** — often **CloudCannon** (Git-based editing + previews). Alternatives: headless **Webflow CMS** feeding Astro at build time, Markdown/content collections only, or other agreed CMS—record in Notion and the project `CLAUDE.md`.

**Webflow Designer build** (pages and styles authored primarily in Webflow):

- **Not default** for new work—treat as **legacy / selective**.
- **Always clarify per project** in Notion (and the task brief): does this engagement include a **native Webflow build**, **headless CMS only**, or **no Webflow**?
- If there is no Webflow site, do not invent one; build in Astro (and CMS choice above).

Detailed Astro/Tailwind/CMS patterns live in the **scaffolded** [`website/CLAUDE.md`](../website/CLAUDE.md) after `/new-orbytes-website`, not only in global rules.

---

## Custom app projects (Custom Build)

Workflow **differs** from websites:

1. **Workshopping / discovery** — Explore requirements, constraints, and **stack options** (frontend, backend, data, auth, hosting) before locking dependencies.
2. **Stack decision** — Document in the repo (e.g. `stack.md`) and Notion; no single default framework.
3. **Scaffold** — Use `/new-orbytes-app` (or equivalent) to generate the **chosen** framework layout; adjust `app/CLAUDE.md` copy in the repo to match reality.
4. **Implement** — Follow `global/rules/coding.md`, `git.md`, `pipeline.md`, and the project’s own architecture notes.

Apps do **not** use Webflow. Reuse **Figma** for UI handoff where applicable; dev agents follow `developer-master` and project rules.

---

## Rule of thumb

| Question | Website | Custom app |
|----------|---------|------------|
| Default stack | Astro + Tailwind | Decided after workshopping |
| Webflow | Only if Notion/task says so | No |
| CloudCannon | Common when CMS + Git workflow | N/A (unless rare hybrid—spell out) |
| Where details live | Copied `website/CLAUDE.md` | Copied `app/CLAUDE.md` + `stack.md` |

---

## Related rules

- `workflow.md` — client stage order and gates
- `pipeline.md` — Dev Pipeline tasks and agents
- `astro.md`, `tailwind.md`, `cloudflare.md`, `cloudcannon.md`, `webflow.md` — tool-specific rules
- `figma-file-structure.md` — design handoff before dev
