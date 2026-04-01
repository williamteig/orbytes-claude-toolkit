# orbytes — App Project Rules

This is an orbytes app client project (Custom Build tier). These rules extend the global orbytes rules.

## Stack

App projects have custom stacks determined during the discovery phase. Common patterns include:

- **Frontend**: React (Next.js), React Native, Svelte (SvelteKit)
- **Backend**: Node.js, Python (FastAPI/Django), Supabase, Cloudflare Workers
- **Database**: PostgreSQL, Supabase, Cloudflare D1
- **Deployment**: Vercel, Cloudflare, AWS

The specific stack is defined during project onboarding and documented in the project's `stack.md` file.

## Architecture Principles

- **Separation of concerns**: clear boundaries between UI, business logic, and data layers
- **API-first**: define interfaces before implementations
- **Type safety**: TypeScript everywhere, strict mode enabled
- **Testing**: unit tests for business logic, integration tests for API endpoints, E2E for critical flows
- **Environment management**: use `.env.example` as a template, never commit real secrets
## Project Structure (Typical)

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

This is a starting point — adapt to the chosen stack.

## Key Differences from Website Projects

- Heavier emphasis on state management and data flow
- Authentication and authorization are usually required
- More complex testing requirements
- CI/CD pipelines with staging environments
- Database migrations and schema management
- API documentation (OpenAPI/Swagger where applicable)

## Security Defaults

- Input validation on all user-facing endpoints
- Parameterized database queries (no string concatenation)
- Rate limiting on authentication endpoints- CORS configured to known origins only
- Secrets in environment variables, never in code
- Dependency audit as part of CI (`npm audit`, `pip audit`)