# Task 01D — Authenticated Application Shell

## Objective

Redesign and consolidate the structural visual hierarchy of the authenticated CampusOS application shell.

Tasks 01A–01C established the foundational token, typography, surface, control and dialog systems.

Task 01D should now make the persistent authenticated environment feel like one intentional CampusOS workspace rather than a generic dashboard frame surrounding individually designed pages.

This task covers the shell itself.

It does NOT redesign individual product pages and does NOT yet establish the final navigation information architecture.

---

## Required context

Before implementation:

1. Read `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/PRODUCT.md`.
4. Read `docs/DESIGN.md`.
5. Read `docs/DECISIONS.md`.
6. Read Tasks 01A, 01B, 01C-A and 01C-B.
7. Read this task.
8. Inspect the authenticated layout and AppShell.
9. Inspect desktop sidebar structure.
10. Inspect shared header/top-bar structure.
11. Inspect mobile drawer and mobile dock.
12. Inspect content scrolling/focus/route behavior.
13. Inspect shell-specific CSS and motion.
14. Inspect `git status` and `git diff`.

Do not inspect unrelated page internals beyond what is necessary to understand shell boundaries.

---

# Design goal

The authenticated application should feel like a premium digital campus environment.

It should not resemble:

- a generic SaaS admin dashboard
- a shadcn component demo
- a conventional ERP
- a sidebar attached to a collection of cards
- excessive glass panels floating over a gradient background

The shell should create a persistent spatial frame around CampusOS.

It should feel calm, precise, modern and dimensional.

The spatial quality should come primarily from:

- layering
- depth hierarchy
- proportion
- persistent planes
- separation of navigation and workspace
- restrained material changes
- intentional negative space

Do not attempt to create spatial quality through arbitrary 3D objects.

---

# Scope

## 1. Shell architecture audit

Before changing implementation, identify the responsibilities of:

- root authenticated layout
- AppShell
- desktop sidebar
- header/top bar
- main content viewport
- mobile drawer
- mobile navigation/dock
- overlays that mount relative to the shell

Preserve working architecture unless a structural change is clearly justified.

Document any important architectural decision in the task/state handoff.

---

## 2. Persistent workspace frame

Establish a clear structural relationship between:

- navigation plane
- utility/header plane
- content workspace
- background/base plane
- floating overlays

Use Tasks 01A and 01B depth/surface semantics.

The content area should feel integrated with the shell rather than like a card placed inside another card.

Avoid unnecessary outer containers around every page.

---

## 3. Desktop shell

Refine the desktop shell's:

- proportions
- sidebar/content relationship
- header/content relationship
- spacing
- borders/dividers
- surface hierarchy
- viewport behavior

Preserve usable sidebar scrolling on short-height displays.

Do not comprehensively redesign navigation item styling or information architecture yet. Task 01E owns navigation.

Task 01D may adjust navigation-container presentation where required by the shell.

---

## 4. Header / utility plane

Refine the persistent header as a structural utility layer.

It should provide a clear home for existing:

- search / Command Center trigger
- notifications
- profile access
- contextual shell utilities already present

Avoid turning the header into a large toolbar full of decorative controls.

The header should not visually compete with page content.

Do not add new product functionality.

---

## 5. Main content viewport

Establish consistent:

- maximum useful width where appropriate
- responsive gutters
- top/bottom spacing
- relationship to PageIntro
- content scrolling
- focus behavior

Do not impose one narrow centered column on pages that need workspace width.

The system should support both:

- dense utility/workspace pages
- editorial/community pages

without requiring every page to own shell-level spacing.

---

## 6. Spatial hierarchy

Create restrained dimensionality through CSS/layout.

Potential techniques include:

- persistent planes
- subtle inset/raised relationships
- controlled overlap
- carefully positioned separators
- depth transitions between shell regions
- subtle edge treatment

Do NOT add:

- Three.js
- WebGL
- random perspective transforms
- floating blobs
- toruses
- decorative 3D assets
- heavy parallax

Task 01F will handle the broader spatial-motion system.

---

## 7. Desktop sidebar container

Improve the sidebar's relationship to the overall shell.

Review:

- width
- edge treatment
- internal spacing
- logo/identity region
- navigation region
- bottom utility/account region
- scrolling
- separation from content

Do not comprehensively redesign each navigation item.

Task 01E owns navigation states, grouping and interaction language.

---

## 8. Mobile shell

Review the authenticated shell at mobile widths.

Ensure intentional relationships between:

- content
- top utilities
- mobile navigation
- drawer
- safe areas
- viewport height
- scrolling

Do not simply shrink desktop shell styling.

Mobile should feel designed as its own shell state.

---

## 9. Mobile drawer

Refine its structural material and relationship to the mobile shell if required.

Preserve:

- focus containment
- keyboard behavior
- Escape behavior
- background inertness/blocking
- existing route functionality

Task 01E will handle navigation presentation inside it.

---

## 10. Mobile dock

Refine only its shell-level placement/material/geometry.

Do not redesign its navigation information architecture or individual destination treatment yet.

Preserve safe-area behavior.

---

## 11. Shell typography

Use Task 01A semantic typography.

Remove shell-specific arbitrary tiny uppercase labels or excessive tracking where encountered.

Do not sweep individual page typography.

---

## 12. Shell surfaces and controls

Use:

- Task 01B surfaces
- Task 01C-A controls
- Task 01C-B overlay conventions

Do not invent a parallel shell-only visual system without justification.

---

# Identity correctness boundary

The existing ProfileMenu can display `CURRENT_STUDENT` while `/profile` uses authenticated metadata.

This is a functional/data-source mismatch.

Do not silently solve it as part of a visual shell redesign.

If the shell work makes the mismatch more visible, preserve the behavior and record it in `docs/STATE.md`.

A separate functional task should resolve identity-source consistency.

---

# Motion boundary

Preserve existing functional route/focus behavior.

Simple shell transitions may be refined only where necessary for the new structure.

Do NOT establish the global motion language here.

Do NOT add:

- GSAP
- React Spring
- new page transition architecture
- shared-element routing
- cinematic animation
- elaborate parallax

Task 01F owns spatial motion.

---

# Representative validation

The shell is global, so validation should cover representative page categories without redesigning them.

Use:

1. Dashboard
2. Feed or Confessions
3. Events
4. Study Hub
5. Map
6. Profile

Do not modify these pages merely because they look unfinished.

They are validation contexts for the shell.

---

# Viewports

Validate:

### Desktop
1440×900

### Laptop
1280×800

### Tablet
768×1024

### Mobile
390×844

### Short desktop
1280×500

Check both themes across enough representative contexts to verify the shared shell.

Do not exhaustively test every page/theme/viewport combination.

---

# Preserve

Preserve:

- route contracts
- authentication
- safe-return behavior
- Supabase behavior
- page functionality
- application state
- notification state
- assignment state
- Command Center functionality
- dialog accessibility
- mobile drawer accessibility
- sidebar short-height scrolling
- reduced-motion behavior
- map rendering architecture
- existing product disclosures

---

# Out of scope

Do NOT:

- redesign individual pages
- rewrite navigation information architecture
- comprehensively redesign navigation items
- implement new product features
- fix ProfileMenu identity data
- connect Settings preferences
- redesign landing
- redesign Campus AI
- redesign Command Center
- add WebGL
- add Three.js shell effects
- add GSAP
- add React Spring
- install dependencies
- reconcile dependencies
- delete legacy immersive components
- modify Supabase
- modify authentication
- begin Task 01E
- begin Task 01F

---

# Validation

Run:

- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Browser-check representative shell contexts.

Explicitly inspect:

- shell hierarchy
- desktop sidebar/content relationship
- header/content relationship
- main scrolling
- short-height sidebar scrolling
- responsive gutters
- mobile safe areas
- mobile dock placement
- mobile drawer behavior
- keyboard focus visibility
- overlays relative to shell
- root horizontal overflow
- light mode
- dark mode

Verify no obvious regression in:

- Command Center
- Notifications
- Profile menu
- representative dialog
- Map canvas

Do not perform full application QA.

---

# Acceptance criteria

Task 01D is complete only when:

- [ ] existing shell architecture was audited before modification
- [ ] persistent shell planes have a coherent hierarchy
- [ ] desktop shell proportions are intentional
- [ ] sidebar/container relationship is coherent
- [ ] header utility plane is coherent
- [ ] content workspace integrates naturally with the shell
- [ ] shell-level gutters/spacing are consistent
- [ ] shell supports both dense and editorial page types
- [ ] short-height sidebar remains usable
- [ ] mobile shell has intentional structure
- [ ] mobile safe areas remain correct
- [ ] mobile drawer remains accessible
- [ ] mobile dock remains usable
- [ ] shell typography follows semantic roles
- [ ] shell uses established surface/control systems
- [ ] no unnecessary glass/card nesting was introduced
- [ ] no arbitrary 3D decoration was introduced
- [ ] Dashboard shell context was checked
- [ ] community/social shell context was checked
- [ ] Events shell context was checked
- [ ] Study Hub shell context was checked
- [ ] Map shell context was checked
- [ ] Profile shell context was checked
- [ ] desktop was validated
- [ ] laptop was validated
- [ ] tablet was validated
- [ ] mobile was validated
- [ ] short-height desktop was validated
- [ ] light mode was validated
- [ ] dark mode was validated
- [ ] Command Center has no obvious regression
- [ ] Notifications has no obvious regression
- [ ] Profile menu has no obvious regression
- [ ] representative dialog has no obvious regression
- [ ] Map canvas has no obvious regression
- [ ] no intentional product functionality changes were introduced
- [ ] typecheck passes
- [ ] lint passes
- [ ] `git diff --check` passes
- [ ] no obvious new runtime errors were introduced
- [ ] task checklist is accurate
- [ ] `docs/STATE.md` is updated

---

# State handoff

When complete, update `docs/STATE.md` with:

- shell architecture retained/changed
- structural visual system established
- desktop shell result
- mobile shell result
- representative contexts validated
- known issues/regressions
- important files changed
- remaining shell/navigation debt
- recommended Task 01E scope

Do not begin Task 01E.

Task 01E should establish the navigation hierarchy, grouping, active states and interaction language across desktop sidebar, mobile drawer and mobile dock using the Task 01D shell.