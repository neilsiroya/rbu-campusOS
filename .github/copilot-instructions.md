# RBU CampusOS

CampusOS is a student-first campus operating system for Ramdeobaba University, combining academic tools, campus utilities, opportunities, and community features.

## Stack and structure

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Base UI, Framer Motion, Lucide React, Supabase SSR, and Vercel.
- `app/` contains routes; `app/(app)/` is the signed-in campus experience and `app/auth/` contains login and signup.
- `components/ui/` contains shared primitives; `components/os/`, `components/layout/`, and feature folders contain reusable interface pieces.
- `lib/` contains shared utilities, campus demo data, schemas, navigation, and the Supabase browser client. `proxy.ts` refreshes Supabase auth and guards routes.
- Use `@/` imports. Follow nearby TypeScript and App Router patterns; add `"use client"` only where browser state or interaction requires it.
- Before changing Next.js APIs, read the relevant guide in the installed `node_modules/next/dist/docs/`. Preserve the Next-generated guidance in root `AGENTS.md`.
- Some routes and actions are demonstrations or session-local. Verify whether data is actually persisted before describing it as live or adding integrations.

## Design and interaction

- Preserve CampusOS's premium, futuristic campus identity: OKLCH semantic tokens, aurora backdrop, Liquid Glass surface levels, light/dark themes, cursor spotlight, and restrained micro-interactions.
- Check `app/globals.css`, `components/ui/`, and `components/os/` before adding colors, surface styles, or primitives. Prefer existing tokens and components; do not introduce arbitrary Tailwind colors or duplicate UI primitives.
- Avoid generic dashboard templates, excessive gradients/glass/rounded cards, purple AI glow, decorative effects without purpose, and unnecessary animation. Keep visual hierarchy and campus-specific content intentional.
- Use semantic HTML, visible keyboard focus, accessible names, sufficient contrast in both themes, and reduced-motion-aware behavior. Do not use color alone to communicate state.
- Design mobile-first. Verify real copy and controls at narrow widths; prevent page-level horizontal overflow, preserve touch targets, and check desktop, tablet, and mobile compositions.
- Keep client bundles and hydration deterministic. Prefer server components when possible; avoid render-time randomness, unnecessary effects, and animation that harms responsiveness.

## Supabase and security

- Preserve the authentication boundary enforced by `proxy.ts`; use Supabase SSR patterns appropriate to the server or browser runtime.
- The current browser helper uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never put a service-role key or other secret in client code, `NEXT_PUBLIC_*`, logs, or committed files.
- Inspect the actual schema, migrations, and Row Level Security policies before changing data access. Do not assume tables or policies exist; enforce authorization in the database as well as the UI.
- Treat user-provided and database values as untrusted. Keep credentials in local environment configuration or Vercel settings; never commit `.env` files or real keys.

## Validation and delivery

- CI runs `npm ci`, `npm run lint`, `npm run typecheck`, then `npm run build`; use these checks for code changes when feasible. `package.json` currently has no test script or checked-in test suite.
- The CI build receives Supabase URL and anon-key values from GitHub secrets. Do not fabricate credentials to make a check pass.
- For UI changes, inspect the affected routes in a browser at mobile/tablet/desktop widths and in light/dark themes; check keyboard interaction and browser console errors. Do not bypass authentication to inspect protected data.
- Preserve existing user changes. Review the diff and stage only task-related files. Use a concise imperative commit subject; do not commit, push, rebase, or force-push unless explicitly requested. Check for secrets before staging.
- Vercel deployment configuration and environment variables are managed in the deployment environment. Do not claim production behavior from a local build alone.

## Customization layers

- These repository-wide instructions complement root `AGENTS.md`, which contains a Next.js-generated documentation requirement and must be preserved.
- Root `CLAUDE.md` imports `AGENTS.md` and adds Claude/tooling-specific guidance; do not copy that tooling setup into this file.
- Use `.github/skills/` for task-specific workflows and `.github/agents/` for selectable specialist personas. No repository prompt files or hooks are configured unless added deliberately.
