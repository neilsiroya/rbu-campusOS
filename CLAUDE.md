@AGENTS.md

# RBU CampusOS Project Instructions

RBU CampusOS is a Next.js 16 project (App Router) developed for Vercel deployment.

## Technical Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: Tailwind CSS v4, shadcn/ui, Base UI
- Animations: Framer Motion
- Auth/Data: Supabase (SSR)
- Proxy: `proxy.ts` (Next.js middleware convention)

## Development Conventions
- Use `@/` for path imports.
- Consult `AGENTS.md` for Next.js-specific breaking changes and warnings.
- Preserve existing visual/design system.
- Always check for secrets before adding files to git.

## Tooling Activation
- Claude-Mem: Active (hooks + MCP server).
- Task Observer: Active. Before the first tool call of any session — and before writing or proposing a plan — invoke the `task-observer` skill and run its Session Start Protocol (storage probe at `~/.claude/skill-observations/`, frontmatter scan of `observation-log/`, review trigger on `last-review-date.txt`). Loading the skill without running the protocol activates nothing. Any turn that will involve a tool call counts; do not classify the session as "too simple" from its opening message. After completing each task, report a one-line observation summary (ids and titles, or "none logged and why"). A `SessionStart` hook in `.claude/settings.local.json` injects this instruction and the open-observation count on every session.
