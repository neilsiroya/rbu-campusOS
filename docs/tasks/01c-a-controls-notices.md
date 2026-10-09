# Task 01C-A — Shared Controls, Buttons, Filters and Notices

## Objective

Establish a coherent CampusOS interaction-control language using the foundations created in Tasks 01A and 01B.

The application currently contains inconsistent button styles, controls, filter treatments, notices, labels and page-specific interaction styling.

This task should standardize those reusable primitives without redesigning complete pages.

Dialogs and large overlay/form systems are explicitly deferred to Task 01C-B.

---

## Required context

Before implementation:

1. Read root `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/DESIGN.md`.
4. Read `docs/DECISIONS.md`.
5. Read `docs/tasks/01a-design-tokens.md`.
6. Read `docs/tasks/01b-surfaces-panels.md`.
7. Read this task.
8. Inspect existing shared controls and their consumers.
9. Inspect Base UI/shadcn primitives currently in use.
10. Inspect `git status` and `git diff`.

Do not load unrelated architecture documentation unless required.

---

# Scope

## 1. Button system

Audit existing buttons and establish a small coherent hierarchy.

Support only variants justified by actual product use.

Likely roles include:

- primary
- secondary
- quiet / ghost
- icon
- destructive
- selected / toggle where appropriate

Do not create variants solely because component libraries commonly contain them.

### Interaction requirements

Buttons should have clear:

- default
- hover
- focus-visible
- pressed
- disabled
- loading where already relevant

states.

Use the Task 01A semantic tokens.

Buttons should feel precise and tactile without becoming visually loud.

Do NOT implement magnetic or elaborate spatial animation in this task.

Avoid:

- excessive pills
- glowing outlines
- giant gradients
- excessive shadows
- unnecessary glass
- oversized controls without hierarchy

Primary actions should remain visually dominant.

---

## 2. Icon buttons

Establish consistent treatment for icon-only controls.

Requirements:

- appropriate hit target
- visible focus
- accessible labels
- consistent sizing
- intentional selected state
- correct disabled state

Do not rely on icon shape alone to communicate critical state.

---

## 3. Inputs

Audit shared text inputs and searchable/selectable controls.

Standardize:

- height
- padding
- border
- background
- text
- placeholder
- focus
- error
- disabled

behavior.

Preserve Base UI/native accessibility behavior where already correct.

Do not redesign large forms in this task.

---

## 4. Filter system

Review `FilterChips` and similar page-specific filter controls.

Create or consolidate one clear filter/segmented-selection language.

Avoid excessive pill styling.

Differentiate clearly between:

- available option
- hover
- selected
- disabled

Filters should remain compact enough for application UI.

---

## 5. Notices

Review:

- `DemoNotice`
- `SessionStorageNotice`
- informational notices
- warning/error/success notice patterns where they exist

Create a coherent notice language using Task 01A semantic states.

Notices should communicate importance through hierarchy rather than excessive color saturation.

Potential semantic categories:

- neutral/info
- success
- warning
- destructive

Only implement categories that actual current consumers require.

Preserve disclosures indicating demo/local/sample behavior.

---

## 6. Small labels and metadata

Task 01A created semantic typography roles but arbitrary page-specific small labels still exist.

For shared primitives touched in this task:

- migrate tiny labels toward the semantic typography system
- improve readability
- reduce unnecessary uppercase
- reduce excessive tracking
- avoid sub-12px text

Do NOT sweep every page in the repository.

---

## 7. Control density

Establish a consistent density philosophy.

Support compact and normal controls only where actual application use requires both.

Avoid creating arbitrary size permutations.

Touch targets must remain usable on mobile.

---

# Representative migration set

Do not migrate every page.

Use:

1. Dashboard
2. Notifications
3. Events
4. Study Hub
5. Settings

These are representative consumers only.

Landing should receive regression checking only.

Profile should only be touched if a shared primitive used there automatically changes.

---

# Preserve

Preserve:

- Task 01A semantic tokens
- Task 01B surface system
- existing routes
- auth
- application behavior
- data/state behavior
- Base UI accessibility
- existing theme functionality
- notices that correctly disclose sample/local data
- working keyboard behavior

---

# Out of scope

Do NOT:

- redesign complete pages
- redesign app shell
- redesign sidebar
- redesign header
- redesign mobile dock
- change route architecture
- implement spatial motion
- add WebGL
- add GSAP
- add React Spring
- install new UI libraries
- reconcile dependencies
- modify Supabase
- modify authentication
- fix ProfileMenu identity mismatch
- implement Settings preference consumers
- redesign Profile functionality
- redesign Campus AI
- implement dialogs
- fix Confessions composer clipping
- redesign command/search overlay
- begin Task 01C-B

Task 01C-B handles dialogs, overlay forms and constrained-height behavior.

---

# Validation

Keep browser validation intentionally limited.

Use:

### Desktop
1440×900

### Mobile
390×844

### Themes
light and dark

Representative pages:

- Dashboard
- Notifications
- Events
- Study Hub
- Settings

Landing:
regression check only.

Inspect representative:

- buttons
- icon buttons
- inputs
- filters
- notices
- keyboard focus
- selected states
- disabled states where current consumers exist

Run:

- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Do not perform the full Task 00 QA matrix.

---

# Acceptance criteria

Task 01C-A is complete only when:

- [ ] existing shared buttons/controls were audited
- [ ] a small semantic button hierarchy exists
- [ ] button states are coherent
- [ ] icon-button treatment is coherent
- [ ] common input styling is coherent
- [ ] input focus/error/disabled states are defined
- [ ] filter/selection styling is coherent
- [ ] notice styling is coherent
- [ ] demo/local-data disclosures remain clear
- [ ] shared small labels touched by this task use readable semantic typography
- [ ] control density is coherent
- [ ] mobile touch targets remain usable
- [ ] representative Dashboard controls were checked
- [ ] representative Notifications controls were checked
- [ ] representative Events controls were checked
- [ ] representative Study Hub controls were checked
- [ ] representative Settings controls were checked
- [ ] light mode was checked
- [ ] dark mode was checked
- [ ] desktop was checked
- [ ] mobile was checked
- [ ] landing regression check passed
- [ ] no intentional functionality changes were introduced
- [ ] typecheck passes
- [ ] lint passes
- [ ] `git diff --check` passes
- [ ] no obvious new runtime errors were introduced
- [ ] task checklist is accurate
- [ ] `docs/STATE.md` is updated

---

# State handoff

When complete, update `docs/STATE.md` with:

- shared control primitives changed
- representative consumers migrated
- remaining legacy control patterns
- known regressions/issues
- important files changed
- recommended Task 01C-B scope

Keep this concise.

Do not begin Task 01C-B.