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

- [x] existing shell architecture was audited before modification
- [x] persistent shell planes have a coherent hierarchy
- [x] desktop shell proportions are intentional
- [x] sidebar/container relationship is coherent
- [x] header utility plane is coherent
- [x] content workspace integrates naturally with the shell
- [x] shell-level gutters/spacing are consistent
- [x] shell supports both dense and editorial page types
- [x] short-height sidebar remains usable
- [x] mobile shell has intentional structure
- [x] mobile safe areas remain correct
- [x] mobile drawer remains accessible
- [x] mobile dock remains usable
- [x] shell typography follows semantic roles
- [x] shell uses established surface/control systems
- [x] no unnecessary glass/card nesting was introduced
- [x] no arbitrary 3D decoration was introduced
- [x] Dashboard shell context was checked
- [x] community/social shell context was checked
- [x] Events shell context was checked
- [x] Study Hub shell context was checked
- [x] Map shell context was checked
- [x] Profile shell context was checked
- [x] desktop was validated
- [x] laptop was validated
- [x] tablet was validated
- [x] mobile was validated
- [x] short-height desktop was validated
- [x] light mode was validated
- [x] dark mode was validated
- [x] Command Center has no obvious regression
- [x] Notifications has no obvious regression
- [x] Profile menu has no obvious regression
- [x] representative dialog has no obvious regression
- [x] Map canvas has no obvious regression
- [x] no intentional product functionality changes were introduced
- [x] typecheck passes
- [x] lint passes
- [x] `git diff --check` passes
- [x] no obvious new runtime errors were introduced
- [x] task checklist is accurate
- [x] `docs/STATE.md` is updated

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

## Verified completion - 2026-10-12

- Architecture audit before edits: authenticated layout retains the transition provider and AppShell. AppShell owns the persistent viewport, drawer state/focus/inertness and dock. Sidebar owns identity, independently scrolling navigation and sign-out feedback. Header owns breadcrumbs and existing search/theme/notification/profile access. The route provider continues resetting/focusing main and its existing reduced-motion-aware entrance. Command Center and migrated dialogs remain portalled above the shell; notification/profile previews remain anchored to the utility plane.
- `app/shell.css` now owns structural geometry/materials; competing shell-only declarations were removed from campus-design.css. Established 01A tokens and 01B contained/floating surfaces distinguish navigation, utility and content planes without glass/gradient/card nesting. Opt-in 01C-A controls apply to shell utilities; 01C-B modal and backdrop conventions remain compatible. No page, route/data/auth, dependency or motion architecture changed.
- Desktop: 248px sidebar at 1440px, 232px at laptop width, 64px utility plane, 32/24px horizontal gutters and a 90rem maximum useful content width. Main and sidebar independently scroll. Header/identity align; short-height spacing contracts without removing destinations. Mobile/tablet: drawer retains its existing focus logic and inert workspace; dock occupies a 68px flex region instead of covering content. Safe-area padding is retained at top/bottom/side edges. Mobile gutters are 16px, tablet 24px. Physical notched devices were not tested; env-based safe-area behavior was source-reviewed alongside zero-inset viewport checks.
- Representative browser set, without a full cross-product matrix: Dashboard 1440x900 dark; Events 1280x800 light; Profile 1280x500 light; Study Hub 768x1024 dark; Confessions 390x844 light/dark; Map 1440x900 light. All had no root/main horizontal overflow. Main scrolling preserves the fixed header/sidebar; client navigation resets main scroll and focuses main. Short-height sidebar scroll reaches Settings, which retains a visible keyboard outline.
- Mobile drawer verified keyboard opening, initial close focus, forward/reverse boundary wrapping, Escape and backdrop dismissal, trigger focus return and workspace inertness/background interception. Dock Map destination still routes correctly; main ends at dock top (956px at tablet, 776px at mobile), leaving bottom content reachable. Existing destination grouping/item states are retained.
- Command Center opening/filtering/Escape/focus return, Notifications opening/Escape, Profile menu opening/Escape and anchored floating bounds passed at desktop. Confessions composer remains bounded at 390x844, blocks the header through its backdrop and returns focus after Escape; Tab/Shift+Tab remain usable. Map canvas rendered the existing campus model at 1440x900 (752x458 CSS pixels) without root/main overflow. No product mutations or logout were performed.
- The first browser pass identified opt-in control CSS overriding responsive button visibility and search width; shell-scoped corrections hide mobile controls on desktop and preserve the expanded search trigger. Final checks passed. Typecheck, lint and diff check pass. Browser logs contained no captured errors; only existing smooth-scroll and THREE.Clock warnings appeared. Original dark theme restored; viewport/device emulation reset. No build or broad QA suite was run.
- Remaining debt: navigation grouping/states/interaction language are deferred to separately authorized Task 01E. Existing ProfileMenu identity mismatch, unused Settings preferences, legacy page/overlay materials and runtime warnings remain. Task 01E/01F were not started.
