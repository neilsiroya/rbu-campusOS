---
name: supabase-workflow
description: Guides CampusOS authentication and data work with Supabase SSR, least privilege, and RLS. Use for auth, schema, query, or migration changes.
---

# Supabase workflow

## Existing integration

- `lib/supabase.ts` creates a browser client with `@supabase/ssr` and the public URL/anon key.
- `proxy.ts` creates a request-scoped server client, refreshes cookies, calls `auth.getUser()`, and enforces the app's protected route prefixes.
- Authentication routes and the profile read are current integration points. Verify source before assuming other pages are connected to a database.
- The repository currently contains no committed Supabase migrations or schema directory. Inspect the target project/schema and policies before changing data access.

## Secure changes

- Use the SSR client pattern appropriate to the execution context; never import a browser client into server-only code or server credentials into a client bundle.
- The anon/publishable key may be public; a service-role/secret key must remain server-only and must never use a `NEXT_PUBLIC_` name.
- Enforce authorization and least privilege with Row Level Security policies. Do not rely on hidden UI, route redirects, or client-side filters as authorization.
- Validate input, handle Supabase errors explicitly, and avoid logging tokens or personal data.
- Use reviewed migrations for schema changes. Do not apply destructive changes to a live project without explicit approval and a backup/rollback plan.
- Keep credentials in environment configuration or Vercel secrets. Never commit real keys; never invent credentials to validate.
