# orbytes — Website Project Rules

This is an orbytes website client project. These rules extend the global orbytes rules.

## Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Deployment**: Typically Vercel or Cloudflare Pages
- **CMS**: Webflow CMS (content managed in Webflow, or headless via API)

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
- Use semantic HTML (`<main>`, `<article>`, `<section>`, `<nav>`)- Include Open Graph and Twitter Card meta tags
- Generate a sitemap (use `@astrojs/sitemap`)
- Add structured data (JSON-LD) where appropriate

## Webflow Integration

When the website also has a Webflow component (e.g., CMS content managed in Webflow):

- Use the Webflow CMS API to pull content at build time
- Cache API responses during builds
- Map Webflow collection fields to Astro content types
- Keep Webflow as the content editing interface for the client