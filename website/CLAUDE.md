# orbytes — Website Project Rules

This is an orbytes **website** client project. These rules extend the global orbytes rules. **Global defaults** for “websites vs apps” and Webflow opt-in are in the toolkit `global/rules/dev-workflow.md` (symlinked in dev environments).

## Stack (this repo)

Confirm any CMS or Webflow usage in **Notion**; this file is the **source of truth for this codebase**.

| Layer | Default |
|-------|---------|
| **Framework** | Astro |
| **Styling** | Tailwind CSS |
| **Deploy** | Cloudflare Pages or Vercel (as configured for this project) |
| **CMS** | If content editors need a UI: often **CloudCannon** (Git-based). Alternatives: **Webflow CMS** headless → Astro at build time, Astro content collections / Markdown only, or other—document below. |
| **Webflow Designer build** | **Only if this engagement uses one.** If the site is Astro-only, there is no Webflow Designer build—ignore Webflow MCP for layout work. |

### Record for this project (fill in)

- **CMS:** (e.g. CloudCannon / Webflow headless / none / other)
- **Webflow:** (none | headless CMS only | native Designer build — link in Notion)

## Astro Conventions

- Use `.astro` components for pages and layouts
- Use framework components (React/Svelte) only when client-side interactivity is required
- Prefer Astro's built-in `<Image />` component for optimized images
- Use content collections for structured content (blog posts, case studies, etc.)
- Keep pages in `src/pages/` — Astro's file-based routing handles the rest
- Layouts go in `src/layouts/`, reusable components in `src/components/`

## Tailwind Conventions

- Use Tailwind utility classes directly in markup — avoid `@apply` except in base styles
- Define brand colours, fonts, and spacing in `tailwind.config.mjs` using design tokens
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for mobile-first breakpoints
- Use `prose` class from `@tailwindcss/typography` for CMS/long-form content

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Primitives (Button, Card, Input)
│   ├── sections/       # Page sections (Hero, CTA, Features)
│   └── layout/         # Header, Footer, Nav
├── layouts/            # Page layouts (BaseLayout, BlogLayout)
├── pages/              # File-based routes
├── content/            # Content collections (if using Astro content)
├── styles/             # Global styles, Tailwind base overrides
├── assets/             # Static assets (images, fonts, icons)
└── lib/                # Utilities, helpers, API clients
```

## Performance Targets

- Lighthouse score: 90+ across all categories
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Use `loading="lazy"` for below-fold images
- Minimize client-side JavaScript — lean on Astro's static-first approach

## SEO Defaults

- Every page must have a unique `<title>` and `<meta name="description">`
- Use semantic HTML (`<main>`, `<article>`, `<section>`, `<nav>`)
- Include Open Graph and Twitter Card meta tags
- Generate a sitemap (use `@astrojs/sitemap`)
- Add structured data (JSON-LD) where appropriate

## CloudCannon (when this project uses it)

- Content and config live in **Git**; editors use CloudCannon for previews and structured fields—see global `cloudcannon.md` for conventions.
- Branch strategy (preview vs production) should match the repo’s `README` / Notion.

## Webflow (only when engaged)

**Native Webflow Designer build** — site pages and styles live in Webflow; publishing is Webflow-hosted.

**Webflow CMS → Astro (headless)** — editors use Webflow for collections; Astro pulls at **build time** via API:

- Use the Webflow CMS API to pull content at build time
- Cache API responses during builds
- Map Webflow collection fields to Astro content types
- Keep Webflow as the content editing interface when that is the agreed model

If this project is **Astro-only** with no Webflow, delete or ignore this section.
