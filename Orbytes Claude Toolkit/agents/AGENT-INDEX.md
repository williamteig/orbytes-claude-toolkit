# Orbytes Agent Index

Central reference for the Project Manager agent and any system that needs to understand the full agent architecture.

## Master Agents

| Agent | Role | Primary Stages | Sub-Agents |
|-------|------|---------------|------------|
| **Developer** | Builds and maintains all technical deliverables | Stage 4, Stage 5 | Webflow Developer, Cloudflare Developer, Code Developer, Astro Specialist, Tailwind Specialist |
| **Designer** | Owns all visual and interaction design | Stage X, Stage 3 | Figma Designer, Webflow Stylist, Brand Designer |
| **Strategist** | Research, positioning, and strategic planning | Stage 1, Stage 2 | Researcher, Data Analyst, Technical Implementation Strategist |
| **Writer** | Produces all written content | Stage 2, Stage 5 | Copywriter, Technical Writer, Content Planner |
| **SEO** | Search engine optimisation across all stages | Stage 1, Stage 2, Stage 4 | Keyword Strategist, Technical SEO Specialist, Content SEO Analyst |
| **Project Manager** | Orchestrates the full project lifecycle | All stages | Task Coordinator, QA Reviewer, Client Liaison |

## Task Routing Rules

1. **One agent per task.** Every Notion task must have exactly one Agent Category assigned.
2. **Agents create tasks for other agents.** When an agent's work produces a need outside its scope, it creates a new task assigned to the appropriate agent — it never does the work itself.
3. **Approval gates are PM-only.** No deliverable passes Gate 1 (Content), Gate 2 (Design), or Gate 3 (Development) without Project Manager sign-off.
4. **Strategist starts most projects.** New projects typically begin with Strategist tasks (Research & Discovery), which then spawn tasks for Designer, Writer, SEO, and Developer.

## Stage-to-Agent Map

| Stage | Primary Agent(s) | Supporting Agent(s) |
|-------|------------------|---------------------|
| Stage X — Branding | Designer | Strategist |
| Stage 1 — Research & Discovery | Strategist | SEO, Researcher |
| Stage 2 — Content Writeup + Sitemap | Writer, SEO | Strategist |
| Gate 1 — Content Approval | Project Manager | QA Reviewer |
| Stage 3 — Design (Figma) | Designer | — |
| Gate 2 — Design Approval | Project Manager | QA Reviewer |
| Stage 4 — Development (Webflow) | Developer | SEO (technical) |
| Gate 3 — Development Approval | Project Manager | QA Reviewer |
| Stage 5 — Launch & Handover | Developer, Writer | Project Manager |

## Notion Property

**Agent Category** — Select property on all tasks:
- Developer
- Designer
- Strategist
- Writer
- SEO
- Project Manager
