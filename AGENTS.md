# Orbytes toolkit agents

Canonical definitions live under [`global/agents/`](global/agents/). Spawn these via the Agent tool from commands or skills when the description matches the task.

**Boundaries:** **`project-manager`** (`pm`) moves tasks in Notion and runs QA gates. **Discipline masters** do the work and report back to `pm`. **QA agents** (`qa-*`) verify implementation; they do not replace `pm` on gates.

| Agent | When to spawn | Definition |
|-------|----------------|------------|
| **project-manager** | Coordinating the Dev Pipeline in Notion: task moves, stage transitions, spawning specialists and QA sub-agents, enforcing blockers, approval gates. | [`global/agents/project-manager.md`](global/agents/project-manager.md) |
| **strategy-master** | Research, framing, options/tradeoffs, execution plans, acceptance mapping for strategy-stage work. | [`global/agents/strategy-master.md`](global/agents/strategy-master.md) |
| **copy-master** | Brand voice, page/section copy, CMS-ready fields, SEO metadata for copy-stage work. | [`global/agents/copy-master.md`](global/agents/copy-master.md) |
| **design-master** | Figma file structure, handoff, and orchestration; may spawn **`design-section`** one frame at a time; Webflow/repo implementation is usually **developer** unless the brief says otherwise. | [`global/agents/design-master.md`](global/agents/design-master.md) |
| **design-section** | **One** Figma section (one top-level frame) per spawn; spawned by **design-master**; does not checkpoint or move Notion. | [`global/agents/design-section.md`](global/agents/design-section.md) |
| **developer-master** | Code, Webflow builds, infra, PR + preview; deploy only when the task requires it. | [`global/agents/developer-master.md`](global/agents/developer-master.md) |
| **qa-component** | Verifying a single UI component (behaviour, states, optional Figma fidelity). | [`global/agents/qa-component.md`](global/agents/qa-component.md) |
| **qa-section** | QA for one page section against design and requirements. | [`global/agents/qa-section.md`](global/agents/qa-section.md) |
| **qa-page** | Full-page pass: visual, responsive, a11y, performance, pre-launch or after major changes. | [`global/agents/qa-page.md`](global/agents/qa-page.md) |

For pipeline stages, discipline order, and agent categories, see [`global/rules/pipeline.md`](global/rules/pipeline.md).
