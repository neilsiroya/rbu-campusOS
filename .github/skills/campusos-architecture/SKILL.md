---
name: campusos-architecture
description: Explains CampusOS's App Router, shared components, auth proxy, and data boundaries. Use before cross-route or architectural changes.
---

# CampusOS architecture

## Current boundaries

- `app/layout.tsx` owns global providers, themes, aurora, cursor, and toast viewport.
- `app/(app)/` holds campus routes and `app/(app)/layout.tsx` composes the signed-in application shell.
- `app/auth/` contains authentication routes. `proxy.ts` refreshes Supabase auth and redirects unauthenticated users from its protected route prefixes.
- `components/ui/` holds low-level controls; `components/os/` holds CampusOS page-level primitives; `components/layout/` and feature folders hold shared shell and domain UI.
- `lib/` contains campus demo data, schemas, navigation, utilities, session state, and the Supabase browser helper.

## Change guidance

- Trace route ownership, imports, state, and navigation before moving shared behavior. Prefer a small local change over a new abstraction.
- Keep server and client responsibilities explicit. Follow the installed Next.js guide under `node_modules/next/dist/docs/` before using unfamiliar Next.js APIs; keep root `AGENTS.md` intact.
- Separate static/demo/session-local state from persisted backend data in both implementation and user-facing copy.
- Inspect repository SQL/migrations and deployed Supabase policies before assuming a schema or adding data reads/writes. Preserve route auth and database RLS boundaries.
- Run lint, typecheck, and production build for meaningful code changes; document any environmental limits rather than masking failures.
