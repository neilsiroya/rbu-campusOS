# Task 01A — CampusOS Design Tokens and Typography Foundation

## Objective

Establish one authoritative visual-token foundation for RBU CampusOS.

The current frontend contains overlapping legacy green/glass styles, newer neutral overrides, duplicate typography definitions, mixed font variables, inconsistent radii, hardcoded layer values, and inconsistent motion/style constants.

This task should consolidate the foundational visual language WITHOUT redesigning individual product pages.

The result should make future page redesigns predictable and reduce visual inconsistency across CampusOS.

## Required context

Before changing code:

1. Read root `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/DESIGN.md`.
4. Read `docs/DECISIONS.md`.
5. Read this task file.
6. Inspect the current design/token implementation.
7. Inspect global CSS and Tailwind configuration.
8. Inspect font loading and typography definitions.
9. Inspect representative components that consume existing tokens.
10. Inspect `git status` and `git diff`.

Do not assume old utilities are safe to delete merely because they appear outdated.

Determine actual usage first.

---

# Scope

This task covers ONLY foundational design tokens and typography.

## 1. Color system

Create one authoritative semantic color system for CampusOS.

It should support both light and dark modes.

Prefer semantic concepts such as:

- background
- background-elevated
- surface
- surface-raised
- surface-inset
- foreground
- foreground-muted
- foreground-subtle
- border
- border-strong
- accent
- accent-hover
- accent-subtle
- success
- warning
- destructive
- info
- focus

Exact naming may follow the repository's existing architecture where sensible.

Avoid styling components directly around arbitrary raw color values.

### Dark mode

Preserve the parts of the current dark palette that already feel premium and successful.

Refine rather than unnecessarily replacing good work.

Dark mode should feel:

- deep
- neutral
- dimensional
- calm
- premium

Avoid excessive green cast.

### Light mode

Light mode requires stronger art direction.

It should feel:

- architectural
- bright
- editorial
- refined
- spatial
- clean

Do NOT treat light mode as simply inverted dark mode.

Avoid:

- muddy green-grey surfaces
- low-contrast beige/grey accumulation
- generic SaaS whites
- excessive tinted backgrounds

Do not attempt a complete light-theme page redesign in this task.

Only establish the correct token foundation.

---

## 2. Typography foundation

Establish one clear typography hierarchy.

Audit and consolidate duplicate font variables and typography naming.

Define intentional roles for:

- display
- page title
- section heading
- UI heading
- card/entity title
- body
- compact body
- metadata
- labels
- navigation
- numeric/data values

Avoid creating dozens of arbitrary text utilities.

Typography should remain expressive enough for CampusOS while working in dense application UI.

Requirements:

- readable small text
- strong heading hierarchy
- reasonable line heights
- deliberate weight usage
- consistent font delivery
- responsive scaling where appropriate

Avoid:

- tiny uppercase labels everywhere
- excessive letter spacing
- fake futuristic styling
- excessive all-caps metadata

Preserve existing fonts if they support the design direction well.

Do not replace fonts merely for novelty.

---

## 3. Spacing scale

Audit existing spacing behavior.

Establish a coherent spacing rhythm that future components can reuse.

Do not rewrite every component during this task.

Prefer an intentional scale over arbitrary per-component values.

Pay particular attention to:

- page gutters
- panel padding
- component gaps
- compact UI spacing
- dense data layouts
- mobile spacing

---

## 4. Radius system

Consolidate inconsistent radius usage.

Create a small intentional radius hierarchy.

For example, concepts may include:

- subtle
- control
- surface
- large surface
- circular

Exact implementation is up to the existing architecture.

Important:

Not every object should be rounded.

Avoid restoring the generic:

rounded rectangle + border + glass

pattern across the application.

---

## 5. Border and divider system

Create consistent semantic treatment for:

- subtle separators
- normal borders
- stronger boundaries
- interactive focus boundaries

Avoid unnecessary borders around every object.

---

## 6. Elevation and depth tokens

CampusOS is intended to become a spatial interface.

Create foundational depth/elevation concepts that future tasks can use.

Possible levels:

- base
- inset
- surface
- elevated
- floating
- overlay

Depth may involve combinations of:

- shadow
- blur
- contrast
- luminance
- border behavior
- transform/perspective later

Do not add dramatic 3D effects in this task.

This task only defines a coherent depth vocabulary.

---

## 7. Layer / z-index system

Audit hardcoded z-index values.

Create or consolidate a predictable layering hierarchy for concepts such as:

- base content
- sticky UI
- navigation
- floating controls
- popover
- drawer
- dialog
- command/search
- notification/toast
- critical overlay

Do not blindly replace values without checking interaction behavior.

---

## 8. Focus system

Establish one accessible focus treatment.

It must:

- remain visible in both themes
- work across controls
- maintain contrast
- not rely purely on subtle color change

Do not remove Base UI accessibility behavior.

---

# Cleanup

During this task, legacy token definitions may be removed or consolidated ONLY when:

1. their usage has been identified,
2. the replacement is implemented,
3. the change does not unexpectedly redesign unrelated pages.

Do not perform broad component redesign.

Do not remove unreferenced 3D/blob architecture in this task.

Dependency cleanup belongs elsewhere.

---

# Validation set

Do NOT inspect every route.

Use a small representative set only.

At minimum inspect:

1. Landing page
2. Dashboard
3. Notifications
4. Profile
5. One dense content/discovery page

Check both light and dark mode.

Use:

- one desktop viewport
- one mobile viewport

This task does not require the exhaustive matrix used during Task 00.

---

# Out of scope

Do NOT:

- redesign the landing page
- redesign Dashboard
- redesign individual product pages
- redesign sidebar/navigation
- rebuild cards
- rebuild buttons
- rebuild dialogs
- add spatial WebGL
- add animations
- install animation libraries
- clean dependencies
- modify Supabase
- modify backend behavior
- create new features
- fix unrelated product functionality
- work on React Spring
- add React Bits
- add Aceternity
- implement page transitions

Those belong to later tasks.

---

# Acceptance criteria

Task 01A is complete only when:

- [ ] current global visual tokens were audited
- [ ] duplicate/conflicting foundational color systems were identified
- [ ] one semantic color hierarchy is authoritative
- [ ] dark-mode foundation remains visually strong
- [ ] light-mode token foundation is substantially improved
- [ ] typography definitions are consolidated
- [ ] duplicate font variables/naming are resolved where safely possible
- [ ] typography roles are clearly defined
- [ ] spacing foundation is coherent
- [ ] radius hierarchy is coherent
- [ ] border/divider hierarchy is coherent
- [ ] depth/elevation vocabulary exists
- [ ] layer/z-index hierarchy is coherent
- [ ] accessible focus treatment is consistent
- [ ] representative desktop views were checked
- [ ] representative mobile views were checked
- [ ] representative light-mode views were checked
- [ ] representative dark-mode views were checked
- [ ] no application functionality was intentionally changed
- [ ] typecheck passes
- [ ] lint passes
- [ ] no new obvious runtime errors are introduced
- [ ] `docs/STATE.md` is updated with verified results
- [ ] this task's criteria are marked accurately

---

# State handoff

When complete, update `docs/STATE.md` with only:

- foundational systems changed
- important visual decisions made
- legacy systems still remaining
- regressions/known issues
- important files changed
- recommended scope for Task 01B

Do not write a long implementation diary.

Task 01B should build the shared surface/card/panel visual language using the token system established here.