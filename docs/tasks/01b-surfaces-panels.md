# Task 01B — CampusOS Shared Surface, Card and Panel Language

## Objective

Establish a coherent visual language for reusable CampusOS surfaces, cards, panels, rows, sections and content containers using the semantic design foundation created in Task 01A.

The current application mixes:

- older glass surfaces
- generic rounded cards
- bordered dashboard modules
- newer workspace/row layouts
- page-specific container styling
- inconsistent elevation
- inconsistent radius
- inconsistent padding
- decorative gradients and effects

This produces a fragmented and often AI-generated-looking application.

Task 01B should create a reusable surface system that future page redesign tasks can build upon.

This task is NOT a page redesign.

---

## Required context

Before implementation:

1. Read root `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/DESIGN.md`.
4. Read `docs/DECISIONS.md`.
5. Read `docs/tasks/01a-design-tokens.md`.
6. Read this task.
7. Inspect `app/design-tokens.css`.
8. Inspect `app/typography.css`.
9. Inspect `app/campus-design.css`.
10. Inspect shared card/panel/surface components.
11. Inspect a small representative sample of pages.
12. Inspect `git status` and `git diff`.

Do not assume a component should be replaced merely because it is old.

Identify actual consumers first.

---

# Design objective

CampusOS should not look like a collection of:

rounded rectangle  
+ border  
+ glass background  
+ icon  
+ title  
+ description

repeated across every page.

Different information should be able to occupy different visual structures while still belonging to the same design system.

The surface system should support both:

- expressive/spatial experiences
- dense functional application UI

---

# Scope

## 1. Define semantic surface roles

Create or consolidate reusable concepts for surfaces such as:

### Base

Normal page environment.

### Section

Large grouping region without unnecessary card styling.

### Surface

Normal contained information.

### Raised surface

Content that needs stronger separation.

### Inset surface

Filters, secondary information, controls or recessed content.

### Interactive surface

Clickable/selectable content with clear hover/focus/pressed behavior.

### Floating surface

Popovers, floating utilities, contextual tools or temporarily elevated UI.

### Overlay surface

Dialogs, command interfaces and high-priority overlays.

Exact component names may differ according to the current architecture.

Do not create abstraction merely for abstraction's sake.

---

## 2. Shared card language

Audit current cards and identify recurring patterns.

Create reusable styling/primitives for common card categories where useful.

Potential roles include:

- content card
- entity card
- compact card/row
- feature card
- data/stat surface
- interactive card
- media card

Do NOT make seven components simply because seven names are listed.

Only create reusable variants that actual CampusOS content needs.

Cards should use the new Task 01A tokens.

---

## 3. Reduce generic card-grid styling

Where shared primitives currently encode generic:

- heavy rounding
- translucent glass
- thin glowing borders
- gradient backgrounds
- unnecessary shadows

move toward the new CampusOS visual language.

Do not perform broad page redesign.

The objective is to change the reusable primitives and a limited set of representative consumers.

---

## 4. Spatial depth

Use the Task 01A depth hierarchy.

Surfaces should communicate hierarchy through restrained combinations of:

- contrast
- luminance
- border
- shadow
- position
- elevation
- texture where appropriate

Do NOT add 3D transforms, WebGL, parallax or elaborate animation in this task.

Spatial motion belongs to a later task.

This task creates the static material/depth language that motion can later use.

---

## 5. Light mode

Pay special attention to light-mode surfaces.

Light mode should not become:

white card  
on slightly grey page  
inside another white card  
with another grey border.

Use hierarchy through subtle tonal and material differences.

It should feel architectural and editorial rather than generic SaaS.

Avoid muddy green-tinted surfaces.

---

## 6. Dark mode

Preserve the successful neutral dark foundation from Task 01A.

Use restrained depth and contrast.

Avoid turning every raised object into:

black glass + white border + glow.

---

## 7. Border behavior

Different surface roles should not all use the same visible border.

Allow combinations of:

- no border
- subtle divider
- semantic border
- stronger boundary
- focus/interaction outline

Do not create visual boxes unnecessarily.

---

## 8. Radius behavior

Use Task 01A radius roles.

Not every surface needs the largest radius.

Dense utility UI should generally use smaller radii than prominent content surfaces.

Avoid pill-shaped content containers.

---

## 9. Padding and internal composition

Standardize common surface spacing.

Avoid arbitrary component padding.

Support:

- compact
- normal
- spacious

density where real use cases require it.

Do not create excessive variants.

---

## 10. Interactive states

For interactive surfaces establish coherent:

- hover
- focus-visible
- active/pressed
- selected
- disabled

states.

Keep these subtle for now.

Do not implement elaborate motion.

Use CSS transitions or existing simple Framer Motion behavior only where already part of the component.

---

# Representative implementation set

Do NOT migrate all 27 protected pages.

Apply/validate the new system only against a small representative set sufficient to prove the primitives.

Use:

1. Dashboard
2. Notifications
3. Profile
4. Study Hub
5. one discovery/content page selected based on current implementation

Landing page should only be checked for regression.

Do not redesign the landing page.

---

# Preserve

Where useful, preserve/refactor rather than replace:

- Base UI accessibility behavior
- existing semantic tokens from Task 01A
- useful PageIntro structure
- FilterChips functionality
- EmptyState
- DemoNotice
- SessionStorageNotice
- existing responsive behavior that works
- working data/state behavior

Presentation may be adjusted where required by the new surface system.

---

# Out of scope

Do NOT:

- redesign individual pages comprehensively
- redesign sidebar
- redesign top navigation/header
- redesign mobile navigation
- create new page layouts
- change product functionality
- add features
- change Supabase
- change authentication
- fix Profile product depth
- fix Settings preference behavior
- fix ProfileMenu data mismatch
- implement spatial page transitions
- add WebGL
- add GSAP
- add React Spring
- install React Bits
- install Aceternity
- reconcile dependencies
- delete obsolete immersive components
- rebuild buttons comprehensively
- rebuild dialogs comprehensively
- implement the Confessions dialog fix unless required by a shared primitive touched in this task
- begin Task 01C

---

# Validation

Keep validation intentionally small.

Inspect:

### Desktop
1440×900

### Mobile
390×844

### Themes
light and dark

Representative views only:

- Dashboard
- Notifications
- Profile
- Study Hub
- one discovery/content page

Check:

- hierarchy
- visual consistency
- light-mode surface quality
- dark-mode surface quality
- border/radius consistency
- focus visibility
- interactive surface states
- overflow
- obvious regressions

Run:

- typecheck
- lint

Do not perform the entire Task 00 viewport matrix.

---

# Acceptance criteria

Task 01B is complete only when:

- [ ] current shared surface/card systems were audited
- [ ] actual recurring surface roles were identified
- [ ] one coherent semantic surface hierarchy exists
- [ ] reusable shared surface primitives/styles exist where justified
- [ ] new primitives use Task 01A semantic tokens
- [ ] excessive generic glass/card styling is reduced in shared primitives
- [ ] radius usage follows the new hierarchy
- [ ] border usage is intentional
- [ ] depth/elevation is coherent
- [ ] common surface spacing is coherent
- [ ] interactive surfaces have clear hover/focus/pressed/selected states
- [ ] light-mode surface hierarchy is substantially improved
- [ ] dark-mode hierarchy remains strong
- [ ] representative Dashboard view was checked
- [ ] representative Notifications view was checked
- [ ] representative Profile view was checked
- [ ] representative Study Hub view was checked
- [ ] one discovery/content view was checked
- [ ] desktop representative validation was performed
- [ ] mobile representative validation was performed
- [ ] light mode was validated
- [ ] dark mode was validated
- [ ] landing page was checked for obvious regression
- [ ] no intentional product functionality changes were introduced
- [ ] typecheck passes
- [ ] lint passes
- [ ] no obvious new runtime errors were introduced
- [ ] task checklist is accurate
- [ ] `docs/STATE.md` is updated
- [ ] recommended scope for Task 01C is recorded

---

# State handoff

When complete, update `docs/STATE.md` with:

- new surface primitives/system
- what representative consumers were migrated
- legacy card/surface patterns still remaining
- important visual decisions
- known regressions/issues
- important files changed
- recommended Task 01C scope

Keep the update concise.

Do not begin Task 01C.

Likely Task 01C scope should cover shared controls, buttons, filters, notices and dialogs using Tasks 01A and 01B as foundations.