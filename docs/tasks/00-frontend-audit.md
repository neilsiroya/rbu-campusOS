# Task 00 — Current Frontend Audit

## Objective

Establish an accurate baseline of the current RBU CampusOS frontend after the previous large redesign pass.

This task is DIAGNOSTIC ONLY.

Inspect the actual repository and running application to determine what currently exists, what works, what is broken, what design systems/primitives have already been implemented, what dependencies are actually installed, and where the current frontend differs from the intended CampusOS design direction.

The purpose of this task is to prevent future work from rebuilding things blindly or relying on stale conversation history.

## Required context

Before auditing:

1. Read the root `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/DESIGN.md`.
4. Read `docs/PRODUCT.md`.
5. Read this task file.
6. Inspect `package.json`.
7. Inspect `git status` and `git diff`.

The repository and running application are authoritative.

## Scope

Audit the current frontend only.

Inspect:

### Global architecture

- app/layout architecture
- route structure
- shared layouts
- providers
- global styles
- theme system
- design tokens
- fonts
- reusable UI primitives
- motion primitives
- spatial/3D primitives
- state-management patterns

### Installed frontend tooling

Determine exactly what is currently installed and actually used.

Pay particular attention to:

- Motion / Framer Motion
- GSAP
- React Spring
- Three.js
- React Three Fiber
- Drei
- postprocessing
- React Bits-derived components
- Aceternity-derived components
- Motion Primitives
- animation/vector tooling
- Lenis
- shadcn/ui
- Base UI
- Lucide
- cmdk
- any other animation, 3D, UI, interaction, visualization, or design libraries

Do not assume previously discussed packages are installed.

Distinguish:

- installed and used
- installed but unused
- partially integrated
- duplicated/redundant tooling

### Landing page

Inspect the actual landing page in the browser.

Evaluate:

- information hierarchy
- branding
- wordmark
- hero composition
- background
- imagery
- CTAs
- navigation
- typography
- spatial depth
- 3D/WebGL use
- animation
- scroll behavior
- responsive behavior
- light mode
- dark mode
- conceptual relationship to CampusOS

Explicitly identify any remaining:

- redundant CTAs
- meaningless decorative imagery
- random 3D objects
- generic visual effects
- scattered labels/icons
- accidental horizontal scrolling
- weak hierarchy

### Application shell

Inspect:

- sidebar
- navigation rail/dock if present
- header
- page containers
- responsive behavior
- route transitions
- active states
- sidebar scrolling
- short viewport heights
- command/search access
- mobile navigation

Confirm whether every navigation item can actually be reached.

### Authenticated pages

Inspect every existing major route.

At minimum, locate and assess existing implementations for:

- Dashboard
- Feed
- Confessions
- Events
- Clubs
- People
- Campus AI
- Search / Omnisearch
- Map
- Facilities
- Lost & Found
- Marketplace
- Notes / Study Hub
- Internships
- Hackathons
- Placements
- Timetable
- Attendance
- Assignments
- Exams
- Notifications
- Profile
- Settings
- Authentication

If a listed route does not exist, record that fact.

For each existing area, identify:

- visual consistency
- layout quality
- card/surface patterns
- typography
- interaction quality
- responsive behavior
- obvious broken controls
- generic/template patterns
- duplicated UI
- opportunities for shared primitives

Do NOT redesign the pages during this task.

### Design system

Determine what already exists for:

- colors
- spacing
- typography
- radius
- borders
- shadows
- surface levels
- depth
- motion durations
- easing
- spring values
- breakpoints
- z-index/layers
- buttons
- cards
- panels
- navigation
- form controls
- dialogs
- feedback states

Identify inconsistencies and duplicated implementations.

### Motion and spatial system

Determine whether motion currently has a coherent architecture.

Inspect:

- page transitions
- entrance animation
- layout animation
- hover behavior
- button interactions
- card interactions
- pointer effects
- scroll-linked effects
- parallax
- shared-element transitions
- WebGL scenes
- shaders
- 3D objects
- reduced-motion handling
- mobile fallbacks

Identify effects that appear decorative, redundant, expensive, or disconnected from CampusOS.

### Browser QA

Run the application and inspect it using available browser/Playwright/DevTools tooling.

Test representative widths for:

- desktop
- laptop
- tablet
- mobile

Also inspect a short-height desktop/laptop viewport specifically for sidebar/navigation problems.

Check:

- console errors
- runtime errors
- hydration warnings
- overflow
- accidental horizontal scrolling
- clipping
- z-index issues
- broken interaction
- unreachable navigation
- responsive failures
- obvious layout shift

Inspect both light and dark themes if both currently exist.

## Do not modify application code

This is critical.

During Task 00:

DO NOT:

- redesign anything
- install packages
- remove packages
- change components
- change styles
- fix bugs
- refactor code
- replace the sidebar
- change animations
- change WebGL
- implement new features
- start Task 01

The purpose is to establish ground truth first.

The only files that may be updated are:

- `docs/STATE.md`
- this task file

No application source file should be modified.

## Audit output

At the end of the audit, update `docs/STATE.md` with a concise factual baseline containing:

### Current frontend architecture

What major systems currently exist.

### Existing reusable design systems

What useful primitives/tokens/components are already present and should potentially be retained.

### Installed creative tooling

What animation/UI/3D packages are actually installed and their current usage.

### Confirmed design problems

Only issues actually observed in the repository/browser.

### Confirmed functional problems

Only problems actually reproduced or verified.

### Technical debt relevant to the redesign

Important duplication, inconsistent styling, architecture problems, or unnecessary complexity.

### Preserve

Important existing work that should not be unnecessarily rebuilt.

### Replace / reconsider

Systems that appear fundamentally incompatible with `docs/DESIGN.md`.

### Recommended Task 01 scope

Based on the evidence, state what the Design Foundation task should address BEFORE individual page redesign begins.

Keep the STATE update concise.

Do not write a giant audit report into STATE.md.

If more detail is required for handoff, add a concise `## Audit Findings` section to this task file.

## Acceptance criteria

Task 00 is complete only when:

- [ ] root project instructions were read
- [ ] current project state was read
- [ ] design direction was read
- [ ] product definition was read
- [ ] package.json was inspected
- [ ] installed frontend/design/animation/3D dependencies were identified
- [ ] shared frontend architecture was inspected
- [ ] landing page was inspected in the browser
- [ ] application shell/navigation was inspected
- [ ] existing major routes were inventoried
- [ ] representative authenticated pages were visually inspected
- [ ] light and dark mode were inspected where available
- [ ] desktop behavior was inspected
- [ ] mobile behavior was inspected
- [ ] short-height navigation/sidebar behavior was inspected
- [ ] browser console/runtime issues were checked
- [ ] overflow and horizontal scrolling were checked
- [ ] existing design primitives were identified
- [ ] current motion/3D implementation was identified
- [ ] useful existing work to preserve was identified
- [ ] weak systems to reconsider were identified
- [ ] no application code was intentionally modified
- [ ] `docs/STATE.md` was updated with verified findings
- [ ] recommended Task 01 scope was recorded

## Out of scope

Everything involving implementation.

In particular:

- redesign
- new UI
- new components
- new animations
- new 3D
- dependency installation
- dependency cleanup
- backend work
- Supabase changes
- database changes
- RLS
- APIs
- infrastructure
- new features

Those belong to later tasks.

