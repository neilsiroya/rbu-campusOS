<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RBU CampusOS Project Context

RBU CampusOS is a student-focused digital campus operating system for Ramdeobaba University. It is not primarily an ERP or generic SaaS dashboard.

Project documentation lives under `docs/`.

## Project context

Use documentation contextually:

- `docs/STATE.md` — current project state, active work, known issues, and next task
- `docs/PRODUCT.md` — product definition, features, terminology, and product principles
- `docs/DESIGN.md` — UI/UX, typography, motion, spatial/3D design, responsive behavior, and visual principles
- `docs/ARCHITECTURE.md` — backend, Supabase, APIs, infrastructure, security, and production architecture
- `docs/DECISIONS.md` — durable project decisions that should not repeatedly be reopened
- `docs/tasks/` — scoped implementation tasks and acceptance criteria

For normal work, inspect the actual code and read only the documentation relevant to the active task.

Do not load every project document unnecessarily.

## Source of truth

Use information in this order:

1. current repository/code
2. `docs/STATE.md`
3. active task file
4. relevant durable documentation
5. conversation history

Current code is authoritative for implementation reality.

Do not rely on previous conversation memory when the repository provides newer information.

## Task discipline

Work on one defined task or goal at a time.

Do not opportunistically redesign or refactor unrelated areas.

Preserve working authentication, Supabase integrations, application routes, data behavior, and other existing functionality unless the active task explicitly changes them.

Demo data may remain where real production data is not yet available.

Do not fabricate functionality or represent demo information as verified real information.

## Design work

For frontend work, follow `docs/DESIGN.md`.

CampusOS should feel authored, spatial, interactive, premium, and coherent.

"3D" means spatial interface design and interaction.

Do not treat arbitrary blobs, spheres, floating objects, or decorative WebGL scenes as sufficient 3D design.

Avoid generic AI-generated dashboard patterns and component-library-demo aesthetics.

## Dependencies and tools

Inspect `package.json` before assuming a dependency exists.

Prefer existing tooling over adding redundant packages.

Do not use multiple libraries to solve the same problem without a clear reason.

Use connected tools, MCPs, skills, browser automation, and design resources only when they materially improve the active task.

## Verification

Before declaring a task complete:

- inspect the actual result
- run relevant checks
- verify acceptance criteria
- inspect for runtime/console errors when applicable
- verify important responsive behavior when applicable
- inspect `git diff`

Writing code is not sufficient evidence that the task is complete.

## State handoff

After a meaningful milestone, or before stopping unfinished work, update `docs/STATE.md`.

Record only:

- current objective
- what was completed
- what remains
- known bugs/regressions
- important changed areas when useful
- exact next task

Do not turn `STATE.md` into a reasoning transcript or development diary.

## Interrupted-task recovery

When continuing after a usage limit, context reset, new conversation, or model switch:

1. read `docs/STATE.md`
2. read the active task
3. inspect `git status`
4. inspect `git diff`
5. inspect the relevant implementation
6. continue from the first incomplete acceptance criterion

Do not restart completed work solely because previous chat context is unavailable.