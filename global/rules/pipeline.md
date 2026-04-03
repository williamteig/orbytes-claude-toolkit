---
description: Orbytes dev pipeline workflow - stages and stage groups for every task in every website or app projects as found in the notion database Dev Pipeline. Apply when managing or discussing any tasks in the pipeline.
alwaysApply: false
---

# Orbytes Development Pipeline — Workflow Stages

> This document defines the stages of the Orbytes dev pipeline. It is the canonical reference for how tasks move through the board. Every agent must follow these stage definitions exactly.

---

## Agent Types

The pipeline supports five agent categories. Every task is assigned exactly one agent type.

| Agent Type | Description |
|---|---|
| `strategy` | Research, planning, idea refinement, analysis. Produces deliverables that inform downstream work. found under global/agents/strategy-master.md |
| `copy` | Writing, content planning, brand voice. found under global/agents/copy-master.md |
| `design` | Visual design, Figma, Webflow styling, brand assets. found under global/agents/design-master.md |
| `developer` | Webflow builds, code, Astro, Tailwind, Cloudflare, infrastructure. found under global/agents/developer-master.md |
| `pm` | Project manager. The delegator and sole pipeline coordinator. All agents report to PM. PM moves all tasks between stages, runs all QA gates, creates tasks, and handles cross-discipline routing. found under global/agents/project-manager.md |

---

## Notion Task Properties

Each task in the pipeline has the following properties (non-exhaustive — these are the properties relevant to pipeline logic):

| Property | Type | Description |
|---|---|---|
| Agent Category | Select | The agent type assigned to the task: `strategy`, `copy`, `design`, `developer`, or `pm`. |
| Disciplines | Multi-select | Which discipline stage groups the task passes through: `strategy`, `copy`, `design`, `dev`. |
| Bypass Review | Checkbox | When checked, the task skips Final Approval and goes straight to Done after its last discipline approval. |
| Blocked by | Relation | References task(s) that must complete before this task can proceed. |
| Blocking | Relation | References task(s) that are waiting on this task. |
| Client Belonging | Relation | The client project this task belongs to. Automatically set when the task is created. |
| Branch | Text | Git branch associated with this task (for developer tasks). |
| Priority | Select | Task priority level. High priority tasks always route to Final Approval. |
| Due | Date | Task deadline. |
| Notes | Text | Additional notes for the task. |
| ID | Number | Auto-incrementing number assigned to the task. |
| status | Select | The status of the task. |

And other properties not relevant to this rule set.

---

## Disciplines Property

The Disciplines property determines which stage groups a task passes through. The Agent Type determines who does the work. These are independent — a task assigned to `developer` with disciplines `copy, dev` would pass through both the copy and dev stage groups (with copy work done by a copy agent via a subtask or prior dependency, and dev work done by the developer agent).

When a task has multiple disciplines selected, it passes through each discipline's stage group in the fixed order: strategy → copy → design → dev. `pm` is responsible for ensuring the correct agent works on the task at each discipline boundary. For multi-discipline tasks, `pm` hands off to the appropriate agent as the task enters each new discipline's "In Progress" stage.

---

## Pipeline Coordination Model

All task movement is controlled by `pm`. No agent moves its own tasks.

**The flow for every stage transition:**
1. The working agent completes its work and reports to `pm` that the task is done.
2. `pm` moves the task to the next stage (QA).
3. `pm` initiates and runs the QA review.
4. If QA passes, `pm` moves the task to the approval gate (for Will).
5. If QA fails, `pm` moves the task back to the "In Progress" stage with revision notes.
6. At approval gates, Will reviews and approves or rejects. `pm` moves the task accordingly.
7. Before moving any task to an "In Progress" stage, `pm` checks the task's "Blocked by" relation. If any blocking task is not Done, the task stays where it is.

This centralised model means all pipeline logic (stage routing, discipline skipping, dependency checking) lives in one place — the `pm` agent.

---

## Stage Definitions

### 1. Idea Backlog

- **Type:** Holding
- **Description:** Unprocessed ideas. No work has been done. Ideas may come from Will, from agents, or from project discovery.
- **Who works here:** Nobody — this is a capture bucket.
- **Applies to:** All agent types.
- **Entry criteria:** None. Any idea can be added.
- **Exit criteria:** Will or `pm` moves the task to Idea Workshopping.

---

### 2. Idea Workshopping

- **Type:** Active work
- **Description:** The idea is being explored, refined, stress-tested, and broken into actionable tasks. `strategy` researches and refines the idea. `pm` validates the plan, creates subtasks with clear briefs, and assigns them to the correct agent types. Subtasks enter the pipeline at Idea Ready. The workshopping task stays open as a parent tracker while its subtasks are in progress.
- **Who works here:** `strategy`, `pm`
- **Does not apply to:** `copy`, `design`, `developer` — they are not involved until subtasks are created and assigned.
- **Entry criteria:** Task moved from Idea Backlog.
- **Exit criteria:** All subtasks have been created. The workshopping task remains open until all subtasks reach Done, then it moves to Done.

`pm` manually moves the workshopping task to Done once all subtasks are complete.

---

### 3. Idea Ready

- **Type:** Checkpoint (no active work)
- **Description:** The task has been fully defined with a clear brief, assigned agent type, disciplines selected, and all dependencies noted. This is a prioritisation queue — tasks sit here until Will or `pm` pulls them into active work.
- **Who works here:** Nobody. This is a holding state.
- **Applies to:** All agent types.
- **Entry criteria:** Subtask created during workshopping with a complete brief, agent type, and disciplines set.
- **Exit criteria:** Will or `pm` prioritises the task and moves it to its first applicable "In Progress" stage (determined by the Disciplines property).

---

### 4. Strategy In Progress

- **Type:** Active work
- **Description:** Active strategy work. The strategy agent executes research, analysis, planning, or other strategic deliverables based on the brief. This is distinct from workshopping — workshopping defines and scopes ideas; Strategy In Progress is where a defined strategy task is executed.
- **Who works here:** `strategy`
- **Does not apply to:** `copy`, `design`, `developer`, `pm` (pm monitors but does not do strategy work).
- **Entry criteria:** A task with `strategy` in its Disciplines property has been moved from Idea Ready by `pm`.
- **Exit criteria:** The strategy agent reports to `pm` that work is complete. `pm` advances the task to Strategy QA.

---

### 5. Strategy QA

- **Type:** Agent gate
- **Description:** The `pm` agent reviews the strategy deliverable against the brief, accuracy, completeness, and project requirements. An agent never QAs its own output. If QA fails, `pm` returns the task to Strategy In Progress with revision notes.
- **Who works here:** `pm`
- **Entry criteria:** Strategy agent has reported work complete.
- **Exit criteria:** QA passes — `pm` advances to Strategy Approval. OR QA fails — `pm` returns to Strategy In Progress with revision notes.

---

### 6. Strategy Approval

- **Type:** Human gate (Will)
- **Description:** Will reviews and approves the strategy deliverable.
- **Who works here:** Will only. All agents wait.
- **Entry criteria:** Strategy QA has passed.
- **Exit criteria:** Will approves — if the task has additional disciplines, `pm` advances to the next discipline's "In Progress" stage. If strategy is the only discipline, `pm` checks Final Approval routing (strategy tasks always require Final Approval). OR Will requests changes — task returns to Strategy In Progress.

---

### 7. Copy In Progress

- **Type:** Active work
- **Description:** Active writing and content work. The copy agent drafts text, structures information, and executes content strategy based on the brief.
- **Who works here:** `copy`
- **Does not apply to:** `design`, `developer`, `strategy`, `pm`.
- **Entry criteria:** A task with `copy` in its Disciplines property has been moved to this stage by `pm`. If the task also has `strategy` in its disciplines, Strategy Approval must have passed first. If the brief notes a dependency on another task, that task must be complete.
- **Exit criteria:** The copy agent reports to `pm` that work is complete. `pm` advances the task to Copy QA.

---

### 8. Copy QA

- **Type:** Agent gate
- **Description:** The `pm` agent reviews the copy against the brief, brand voice guidelines, factual accuracy, and project-specific requirements. An agent never QAs its own output. If QA fails, `pm` returns the task to Copy In Progress with revision notes.
- **Who works here:** `pm`
- **Entry criteria:** Copy agent has reported work complete.
- **Exit criteria:** QA passes — `pm` advances to Copy Approval. OR QA fails — `pm` returns to Copy In Progress with revision notes.

---

### 9. Copy Approval

- **Type:** Human gate (Will)
- **Description:** Will reviews and approves the copy.
- **Who works here:** Will only. All agents wait.
- **Entry criteria:** Copy QA has passed.
- **Exit criteria:** Will approves — if the task has additional disciplines, `pm` advances to the next discipline's "In Progress" stage. If copy is the last discipline, `pm` checks Final Approval routing. OR Will requests changes — task returns to Copy In Progress.

---

### 10. Design In Progress

- **Type:** Active work
- **Description:** Active design work. The design agent creates layouts, visual assets, and applies brand styling. If this task's disciplines include `copy`, the approved copy is locked at this point.
- **Who works here:** `design`
- **Does not apply to:** `copy`, `developer`, `strategy`, `pm`.
- **Entry criteria:** A task with `design` in its Disciplines property has been moved to this stage by `pm`. If the task also has `copy` in its disciplines, Copy Approval must have passed first. If the brief notes a dependency on another task, that task must be complete.
- **Exit criteria:** The design agent reports to `pm` that work is complete. `pm` advances the task to Design QA.

---

### 11. Design QA

- **Type:** Agent gate
- **Description:** The `pm` agent reviews designs against brand guidelines, accessibility standards, responsive requirements, and alignment with approved copy (if applicable). If QA fails, `pm` returns the task to Design In Progress with revision notes.
- **Who works here:** `pm`
- **Entry criteria:** Design agent has reported work complete.
- **Exit criteria:** QA passes — `pm` advances to Design Approval. OR QA fails — `pm` returns to Design In Progress with revision notes.

---

### 12. Design Approval

- **Type:** Human gate (Will)
- **Description:** Will reviews and approves the design.
- **Who works here:** Will only. All agents wait.
- **Entry criteria:** Design QA has passed.
- **Exit criteria:** Will approves — if the task has additional disciplines, `pm` advances to the next discipline's "In Progress" stage. If design is the last discipline, `pm` checks Final Approval routing. OR Will requests changes — task returns to Design In Progress.

---

### 13. Dev In Progress

- **Type:** Active work
- **Description:** Active development. The developer agent builds pages, writes code, handles infrastructure. If this task's disciplines include `copy` and/or `design`, the approved copy and design are locked at this point.
- **Who works here:** `developer`
- **Does not apply to:** `copy`, `design`, `strategy`, `pm`.
- **Entry criteria:** A task with `dev` in its Disciplines property has been moved to this stage by `pm`. If the task also has earlier disciplines, their respective approvals must have passed first. If the brief notes a dependency on another task, that task must be complete.
- **Exit criteria:** The developer agent reports to `pm` that work is complete. `pm` advances the task to Dev QA.

---

### 14. Dev QA

- **Type:** Agent gate
- **Description:** The `pm` agent runs a comprehensive technical quality check. Covers cross-browser testing, responsive behaviour, performance, accessibility, link validation, and verifies the build matches approved design and copy (if applicable). If QA fails, `pm` returns the task to Dev In Progress with revision notes.
- **Who works here:** `pm`
- **Entry criteria:** Developer agent has reported work complete.
- **Exit criteria:** QA passes — `pm` advances to Dev Approval. OR QA fails — `pm` returns to Dev In Progress with revision notes.

---

### 15. Dev Approval

- **Type:** Human gate (Will)
- **Description:** Will reviews the built result — ideally on a staging/preview URL.
- **Who works here:** Will only. All agents wait.
- **Entry criteria:** Dev QA has passed.
- **Exit criteria:** Will approves — `pm` checks Final Approval routing (see below). OR Will requests changes — task returns to Dev In Progress.

---

### 16. Final Approval

- **Type:** Human gate (Will)
- **Description:** Will reviews the complete, integrated result before the task is marked Done. This is not a re-review of individual discipline work — it answers: "Does this whole thing work together and is it ready to ship?" For multi-discipline tasks, this is where Will sees all the pieces assembled. For strategy/research tasks, this is where Will validates the deliverable.
- **Who works here:** Will only. All agents wait.
- **Applies to:** See "Final Approval Routing" below for which tasks require this stage.
- **Entry criteria:** The task's last applicable discipline approval has passed, AND the task is not marked "Bypass Review."
- **Exit criteria:** Will approves — task moves to Done. OR Will requests changes — `pm` returns the task to the most recent "In Progress" stage for the discipline that needs rework. If the issue is cross-discipline, `pm` creates a new task.

---

### 17. Done

- **Type:** Terminal
- **Description:** Work is complete, approved, and shipped (or ready to ship). The task is archived here for reference. If this task is a workshopping parent, it moves to Done only when all its subtasks are Done.
- **Applies to:** All agent types.
- **Entry criteria:** Final Approval passed, or task routed directly from discipline approval (Bypass Review), or all subtasks complete (for workshopping parents).

---

## Final Approval Routing

Every task has a **Bypass Review** checkbox property (already exists in the pipeline). This property, combined with the task's characteristics, determines whether the task goes to Final Approval or skips straight to Done after its last discipline approval.

**PM must route to Final Approval when ANY of the following are true:**
- The task has multiple disciplines selected (multi-discipline tasks always need Final Approval — the individual discipline gates checked pieces in isolation; Final Approval checks everything working together)
- The task's disciplines include `strategy` (all strategy and research deliverables require human review of the final output)
- The task publishes to production or goes live (any client-facing deploy, page launch, or public-facing change)
- The task is flagged as high priority

**PM may route directly to Done (skip Final Approval) when ALL of the following are true:**
- The task is single-discipline
- The task's discipline is NOT `strategy`
- The task does not publish to production
- The task is not flagged as high priority
- OR the task has "Bypass Review" checked

**The Bypass Review checkbox** is an explicit override. When checked, the task skips Final Approval regardless of the criteria above — it goes straight to Done after its last discipline approval passes. Will or `pm` can set this flag. It is intended for tasks where Will has already seen everything he needs to see at the discipline approval stage and a second review would be redundant.

**PM's default behaviour:** When in doubt, route to Final Approval. It is always safer to give Will one extra look than to ship something without it. Only skip Final Approval when the task clearly meets all the skip criteria above, or when Bypass Review is explicitly checked.

---

## Stage Routing

The **Disciplines** multi-select property determines which stage groups a task passes through. Stages are always traversed in this fixed order: strategy → copy → design → dev. Tasks skip stage groups for disciplines not in their multi-select. After the last discipline approval, `pm` checks Final Approval routing to determine whether the task goes to Final Approval or Done.

| Disciplines | Stage Path |
|---|---|
| `strategy` | Idea Ready → Strategy In Progress → Strategy QA → Strategy Approval → **Final Approval** → Done |
| `copy` | Idea Ready → Copy In Progress → Copy QA → Copy Approval → Done (or Final Approval → Done) |
| `design` | Idea Ready → Design In Progress → Design QA → Design Approval → Done (or Final Approval → Done) |
| `dev` | Idea Ready → Dev In Progress → Dev QA → Dev Approval → Done (or Final Approval → Done) |
| `copy, design` | Idea Ready → Copy In Progress → ... → Design Approval → **Final Approval** → Done |
| `copy, dev` | Idea Ready → Copy In Progress → ... → Dev Approval → **Final Approval** → Done |
| `design, dev` | Idea Ready → Design In Progress → ... → Dev Approval → **Final Approval** → Done |
| `copy, design, dev` | Idea Ready → Copy In Progress → ... → Design In Progress → ... → Dev Approval → **Final Approval** → Done |
| `strategy, copy, design, dev` | Idea Ready → Strategy In Progress → ... → Dev Approval → **Final Approval** → Done |

**Bold** Final Approval = always required. Non-bold "(or Final Approval → Done)" = depends on routing criteria.

**PM tasks** (workshopping/coordination): Backlog → Workshopping → (stays open until subtasks complete) → Done

---

## Cross-Discipline Issue Routing

When any agent (during active work) or `pm` (during QA) identifies an issue that belongs to a different discipline, it does not act on it directly. Instead:

1. The agent reports the issue to `pm`.
2. `pm` evaluates — is it valid? Does it require rework in another discipline?
3. If rework is required, `pm` creates a new task assigned to the appropriate agent type. The current task may be flagged as blocked until the new task resolves.
4. The original task is never moved backward across discipline boundaries. Cross-discipline issues always produce new tasks.

---

## Rework Behaviour

When QA fails or Will requests changes at an approval gate, `pm` moves the task backward within its current discipline only:

| Rejection Point | Task Returns To |
|---|---|
| Strategy QA fails | Strategy In Progress |
| Strategy Approval rejected | Strategy In Progress |
| Copy QA fails | Copy In Progress |
| Copy Approval rejected | Copy In Progress |
| Design QA fails | Design In Progress |
| Design Approval rejected | Design In Progress |
| Dev QA fails | Dev In Progress |
| Dev Approval rejected | Dev In Progress |
| Final Approval rejected | Most recent "In Progress" stage for the discipline that needs rework. If the issue is cross-discipline, `pm` creates a new task. |

Rework never cascades backward across disciplines. Cross-discipline issues are handled by creating new tasks (see Cross-Discipline Issue Routing above).

---

## Blocked State and Task Dependencies

Blocking and dependencies are handled through Notion's built-in relation properties:

- **Blocked by** (Relation) — references the task(s) that must complete before this task can proceed.
- **Blocking** (Relation) — references the task(s) that are waiting on this task.

These are standard Notion dependency relations. `pm` must check a task's "Blocked by" relation before moving it to an "In Progress" stage. If any blocking task is not yet Done, `pm` does not advance the blocked task — it remains in its current stage.

A task can be blocked in any stage. When the blocking task reaches Done, `pm` checks whether the previously blocked task can now advance.

When `pm` creates subtasks during workshopping, it sets the appropriate "Blocked by" / "Blocking" relations between tasks to enforce execution order (e.g. a `design` task is blocked by its corresponding `copy` task). `pm` may also include dependency context in the brief for additional clarity, but the relation properties are the source of truth — not the brief text.
