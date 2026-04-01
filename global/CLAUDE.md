# orbytes — Global Project Rules

You are working on an orbytes.io client project. orbytes creates apps and websites for clients. These rules apply to every orbytes project regardless of type.

## Who is orbytes

orbytes.io is a digital product studio that builds websites and apps for clients. It is run by Will Teig (william@orbytes.io). All projects follow a structured delivery pipeline managed in Notion.

## Service Tiers

- **Landing Page** — fixed price, single-page site
- **Full Website** — multi-page site with CMS, fixed price
- **Custom Build** — enterprise-grade, technical integrations, custom scope

## Core Tools

| Tool | Purpose | When |
|------|---------|------|
| Notion | Project management, copy, brand notes, checklists | Always — source of truth |
| Figma | Branding + design mockups | Stage X (Branding) and Stage 3 (Design) |
| Webflow | Website build (for website clients) | Stage 4 (Development) onwards |
| Relume | Component inspiration + Webflow imports | During development |
| Claude | Copywriting, code generation, project assistance | Throughout |
| Softriver | Whitelabel branding partner | Delivers logo, palette, fonts |

## Dev Pipeline (Notion-managed)

Every orbytes project follows this pipeline. Notion is the single source of truth for project state.
### Client Summary
Auto-populated from the external qualification form. Never recreate form logic in Notion. The Notion workspace is only created once a client is qualified.

### Stage X — Branding (Optional)
- Add-on service delivered by Softriver (always whitelabeled as orbytes)
- Runs in parallel with early stages but must complete before Stage 3 (Design)
- Deliverables: logo, colour palette, typography, brand guidelines

### Stage 1 — Research & Discovery
1. Asset Docs — collect all existing client assets
2. Discovery Notes — client goals, audience, competitors
3. Competitor Research — analysis of 3-5 competitors
4. Moodboard — visual direction reference

### Stage 2 — Content Writeup + Sitemap
- Full copy for all pages
- Sitemap structure
- **✅ Approval Gate 1** — client signs off on copy and structure before design begins

### Stage 3 — Design (Figma)
- Intentionally lightweight — homepage + optionally one more page
- Uses Figma for mockups, not full pixel-perfect designs
- Webflow is the primary design tool (Stage 4)
- **✅ Approval Gate 2** — client signs off on design direction before development
### Stage 4 — Development
- Built in Webflow (website clients) or custom stack (app clients)
- This is where the real design refinement happens
- CMS setup, responsive design, interactions
- **✅ Approval Gate 3** — client signs off before launch

### Stage 5 — Launch & Handover
- Final QA and testing
- DNS configuration and launch
- Client training on CMS/admin
- Handover documentation

## Key Rules

- **Three approval gates only**: after copy (Stage 2), after design (Stage 3), after development (Stage 4)
- **Notion is always the source of truth** for project state, client details, and deliverables
- **Never skip stages** — even if a stage is light, document that it was completed
- **Branding is always whitelabeled** — Softriver is never mentioned to the client
- **Figma is lightweight** — don't over-invest in Figma mockups; Webflow is the design tool

## Git Workflow

- Branch naming: `feature/description`, `fix/description`, `chore/description`
- Commit messages: imperative mood, concise ("Add hero section", "Fix mobile nav overflow")
- PRs: always include a description of what changed and why
- Never commit secrets, API keys, or `.env` files

## Coding Standards

- TypeScript preferred over JavaScript where possible
- Use semantic HTML elements
- Mobile-first responsive design- Accessible by default (ARIA labels, alt text, keyboard navigation)
- Performance-conscious: optimize images, lazy load below the fold, minimize JS bundles
- Comment complex logic, not obvious code