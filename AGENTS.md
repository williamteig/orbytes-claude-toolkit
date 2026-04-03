# Orbytes toolkit agents

Canonical definitions live under [`global/agents/`](global/agents/). Spawn these via the Agent tool from commands or skills when the description matches the task.

| Agent | When to spawn | Definition |
|-------|----------------|------------|
| **project-manager** | Coordinating the Dev Pipeline in Notion: task moves, stage transitions, spawning specialists and QA sub-agents, enforcing blockers, approval gates. | [`global/agents/project-manager.md`](global/agents/project-manager.md) |
| **qa-component** | Verifying a single UI component (behaviour, states, optional Figma fidelity). | [`global/agents/qa-component.md`](global/agents/qa-component.md) |
| **qa-section** | QA for one page section against design and requirements. | [`global/agents/qa-section.md`](global/agents/qa-section.md) |
| **qa-page** | Full-page pass: visual, responsive, a11y, performance, pre-launch or after major changes. | [`global/agents/qa-page.md`](global/agents/qa-page.md) |

For pipeline stages, discipline order, and agent categories, see [`global/rules/pipeline.md`](global/rules/pipeline.md).
