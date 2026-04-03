---
description: >-
  Orbytes Figma file layout — page order, brand/wireframe/hi-fi rules, variables-before-components,
  section handoff, Softriver, and design-stage deploy. Apply when creating or structuring client Figma files.
alwaysApply: false
---

# Figma file structure (Orbytes)

Canonical URL rules remain in `figma.md`. This document encodes **page topology**, **phase gates**, and **sub-agent handoff** from the design workflow questionnaire.

## Page order (enforce)

Use these **Figma pages** in this order:

1. **`_Brand`** — Brand kit and core UI primitives.
2. **`Variables and components`** — Design tokens and reusable components (two internal phases; see below).
3. **`_Wireframes`** — Low-fidelity layouts.
4. **`_Design`** — Hi-fi marketing and page designs.
5. **`scrapbook`** — Exploratory or throwaway work. **Not** part of the approval chain until frames are promoted to a canonical page.

## Variables and components (same page, sequential)

On **`Variables and components`**:

1. **Phase A — Variables first:** colour, typography, radius, shadows, and other tokens tied to brand.
2. **Phase B — Components:** UI primitives and patterns (buttons, fields, cards, etc.) built from those variables.

Complete Phase A before Phase B in the same file; treat that sequence as the internal gate for this page.

## Gate before `_Design` (soft)

- **Strong preference:** Do not build final hi-fi marketing frames on **`_Design`** until **`Variables and components`** (both phases) is in good shape.
- **Exception:** Timeboxed exploration is allowed—note the exception on the task or in Notion so `pm` and dev know the file is ahead of the usual sequence.

## `_Brand` scope

Include a **full kit** before downstream pages: **colours**, **text styles**, **radius**, **shadows**, **logos**, and **UI primitives** (e.g. buttons, form fields) so brand and core UI building blocks exist before wireframes and hi-fi.

## `_Wireframes`

- **Visual:** Grayscale / neutral; layout and hierarchy first.
- **Copy:** Prefer **real copy from Notion** when available; avoid lorem as the default.
- **Prototypes:** Figma prototype flows only when the **brief or task** explicitly asks for them.

## `_Design` vs `_Wireframes`

- Wireframes may be **per template**; they are a guide, not a rigid contract.
- **`_Design` may add new sections** vs wireframes only with **`pm` approval** (document on the task or in Notion).

## One section = one top-level frame

For orchestration and handoff:

- A **section** means **one top-level frame** (e.g. Hero, Features, Pricing as separate frames).
- **`design-master`** may spawn **`design-section`** sub-agents **one section at a time** (or as `pm` approves parallelism—see below).
- **`pm` checkpoints** between sections, updates Notion, and routes **deploy** steps (publish, review links, human verification)—see **Design-stage deploy**.

## Parallelism

There is **no fixed cap** on parallel **`design-section`** work. **`pm` decides** based on overlap risk (shared components, same page, conflicting edits).

## Section handoff bundle (mandatory)

Each section deliverable includes at least:

- Figma **file link** (base URL, no tracking params) and **node id** for the section frame.
- **Variants / states** called out in the brief.
- **Breakpoint intent** aligned with **Tailwind defaults** (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px) unless the task specifies otherwise.
- **Dev annotations** on the frame (spacing, grid, exceptions).
- **Export / asset** list (SVG, raster, etc.) as needed.
- **CMS field mapping** notes for the project CMS (**Webflow** or other—name the system in the handoff).

## Breakpoints

Default Figma layout modes and annotations to **Tailwind** breakpoint widths unless the brief defines a different scale.

## Accessibility

- **In Figma:** Light-touch—contrast-friendly tokens and obvious hierarchy; do not rely on Figma for full WCAG sign-off.
- **Full checks:** Happen in **implementation QA** and **dev**, not as exhaustive Figma annotations.

## Softriver assets

- Softriver delivers into **Notion** first; integrate into **Figma variables** on **`Variables and components`** when pulling brand into the file.
- **Relume** is **out of scope** for these rules unless a task explicitly references it.

## Design-stage “deploy”

When design work is ready for the next checkpoint, **`pm`** ensures:

1. **Figma** is saved and **published** as required for review.
2. **Notion** task / client page is updated (links, status, notes).
3. A **review link** is provided when stakeholders need it.
4. The task moves to the appropriate **human verification** step before dev handoff.

This is **not** Webflow or production deploy unless the task says so.

## QA timing (`qa-section`)

- **`qa-section`** runs against **implemented** UI (Webflow, Astro, etc.) when **`pm` spawns it**.
- Prefer **batching** **`qa-section`** when a full **page or template** is complete—not necessarily after every single Figma frame—unless risk calls for earlier checks.
