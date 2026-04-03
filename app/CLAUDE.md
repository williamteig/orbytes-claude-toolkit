# orbytes — App Project Rules

This is an orbytes **custom app** client project (typically **Custom Build** tier). These rules extend the global orbytes rules. **How website vs app development differs** at Orbytes is summarized in the toolkit `global/rules/dev-workflow.md`.

## Development phases (order matters)

1. **Workshopping / discovery** — Requirements, users, constraints, and **stack options** (not code yet). Output: agreed direction captured in Notion and/or strategy deliverables.
2. **Stack decision** — Choose frontend, backend, data store, auth, and hosting. Document in this repo (e.g. **`stack.md`**) and link from Notion.
3. **Scaffold** — Generate the project layout for the **chosen** stack (`/new-orbytes-app` onboarding or manual equivalent). The scaffold must match `stack.md`, not a generic default.
4. **Implement** — Feature work, PRs, staging/prod per `global/rules/git.md` and the Dev Pipeline.

Websites default to **Astro + Tailwind**; **apps do not**—the stack is always explicit after phase 2.

## Stack (this repo)

Document the **actual** stack here or in `stack.md` (paths, versions, key libraries):

| Area | Choice for this project |
|------|-------------------------|
| Frontend | (e.g. Next.js, SvelteKit, React Native) |
| Backend / API | (e.g. Supabase, Workers, Node, FastAPI) |
| Database / data | (e.g. Postgres, D1, Supabase) |
| Auth | (if any) |
| Deploy | (e.g. Vercel, Cloudflare, EAS) |

Common patterns from other apps (not defaults): React/Next.js, SvelteKit, React Native, Supabase, Cloudflare Workers + D1, FastAPI, etc.

## Architecture Principles

- **Separation of concerns**: clear boundaries between UI, business logic, and data layers
- **API-first**: define interfaces before implementations
- **Type safety**: TypeScript everywhere when the stack uses TS, strict mode where applicable
- **Testing**: unit tests for business logic, integration tests for API endpoints, E2E for critical flows
- **Environment management**: use `.env.example` as a template, never commit real secrets

## Project Structure (typical — adapt to the scaffold)

```
src/
├── app/              # App entry point, routing
├── components/       # UI components
│   ├── ui/          # Primitives
│   └── features/    # Feature-specific components
├── lib/             # Shared utilities, API clients
├── hooks/           # Custom hooks (React projects)
├── services/        # Business logic, external API integrations
├── types/           # Shared TypeScript types
└── tests/           # Test files mirroring src structure
```

## Key Differences from Website Projects

- Heavier emphasis on state management and data flow
- Authentication and authorization are often required
- More complex testing and CI expectations
- Database migrations and schema management where applicable
- API documentation (OpenAPI/Swagger) where applicable

**No Webflow** — apps are not built in Webflow. Design handoff uses **Figma** (and code) per project.

## Security Defaults

- Input validation on all user-facing endpoints
- Parameterized database queries (no string concatenation)
- Rate limiting on authentication endpoints
- CORS configured to known origins only
- Secrets in environment variables, never in code
- Dependency audit as part of CI (`npm audit`, `pip audit`, etc.)
