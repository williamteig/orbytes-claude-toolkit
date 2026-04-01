---
name: orbytes-workflow-sync
description: >
  Use this skill whenever any change is made to the core structure of the orbytes.io client
  onboarding and delivery workflow. This includes adding, removing, or renaming stages or steps;
  changing how approval gates work; updating the tools or process used at any stage; restructuring
  the Notion Project Template; or any other change that affects how orbytes delivers websites to
  clients end-to-end.

  The skill ensures the Notion Project Template and the orbytes-workflow.md file always stay
  in sync — both are updated together, never one without the other.

  Trigger whenever Will says things like: "add a new stage", "rename this step", "change the
  process", "update the workflow", "restructure the template", or any variation that implies
  a change to how orbytes works. If in doubt, use it — drift between the two sources of truth
  is the problem this skill exists to prevent.
---

# orbytes Workflow Sync

The orbytes.io workflow lives in two places that must always match:

1. **Notion Project Template** — the live dashboard template used for every client (page ID: `3282204c565980dfaf56cfb81526322f`)
2. **orbytes-workflow.md** — the written reference document stored in the project root

Your job is to apply any workflow change to both sources, consistently and completely.
---

## Step 1 — Read Both Sources First

Before making any change, always read the current state of both:

- Fetch the Notion Project Template using the page ID above
- Read the orbytes-workflow.md file from the project root

This gives you the full picture of what exists so you can apply the change correctly and spot any drift that already exists between the two.

---

## Step 2 — Understand the Change

Be clear on exactly what's changing before touching anything:

- Is this a new stage, step, or section?
- Is something being renamed, reordered, or removed?
- Does the change affect the Notion database structure (adding/removing databases or properties), the page content (headings, instructions, checklists), or both?
- Are there downstream effects? For example, renaming Stage 3 means approval gate references to "Stage 3" need updating too.

If the change is ambiguous, ask Will to clarify before proceeding.

---

## Step 3 — Apply to Notion Project Template

Update the Notion Project Template to reflect the change. Depending on the nature of the change, this may involve:
- Updating page content (headings, stage labels, instructions, approval gate text) using `notion-update-page`
- Creating new pages or databases using `notion-create-pages` or `notion-create-database`
- Renaming existing pages using `notion-update-page` with updated properties
- Updating database schemas using `notion-update-data-source`

Always preserve existing child pages and databases — use `<page url="...">` and `<database url="...">` tags when doing `replace_content` operations to avoid accidental deletions.

---

## Step 4 — Apply to orbytes-workflow.md

Update the markdown file to reflect the same change. Keep the writing style consistent with what's already there — clear, structured, minimal. The markdown file is a reference document, not a changelog, so update it to reflect the new state directly rather than appending notes about what changed.

---

## Step 5 — Verify Sync

After both updates, do a quick sanity check:

- Do the stage names and order match between the two?
- Do the approval gates appear at the same points?
- Are any new or renamed items reflected accurately in both?

If you find any existing drift (the two sources didn't already match before your change), flag it to Will and fix it.