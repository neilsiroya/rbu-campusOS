# Task 01C-B — Dialogs, Overlay Forms and Constrained-Height Behavior

## Objective

Establish one coherent CampusOS dialog and overlay-form system using the foundations created in Tasks 01A, 01B and 01C-A.

This task must also resolve the browser-confirmed Confessions composer failure on short viewports.

The goal is not to redesign every modal in the application. The goal is to create a reusable, accessible overlay architecture and prove it against representative real consumers.

---

## Required context

Before implementation:

1. Read `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/DESIGN.md`.
4. Read `docs/DECISIONS.md`.
5. Read Tasks 01A, 01B and 01C-A.
6. Read this task.
7. Inspect existing dialog/modal/drawer/popover implementations.
8. Inspect Base UI dialog primitives and current wrappers.
9. Inspect the Confessions composer implementation.
10. Inspect representative overlay consumers.
11. Inspect `git status` and `git diff`.

Do not inspect or refactor unrelated systems.

---

# Primary requirement — constrained dialog architecture

Dialogs must remain usable when viewport height is limited.

The existing Confessions composer was previously measured outside the viewport at:

- 1280×500
- 390×500

with visible vertical overflow.

Implement a shared policy that prevents this class of failure.

The solution should establish appropriate behavior for:

- maximum dialog height relative to viewport
- internal scrolling
- fixed/stable header where appropriate
- scrollable content region
- stable action/footer region where appropriate
- safe viewport padding
- mobile width
- short-height desktop
- short-height mobile
- focus visibility while scrolling
- content that grows dynamically

Do not solve the bug using a one-off Confessions-only height hack if a reusable dialog primitive can solve it correctly.

---

# Dialog material

Use the Task 01B surface hierarchy.

Dialogs should read as high-priority overlay surfaces without becoming generic glass cards.

Use restrained:

- background separation
- border
- shadow/depth
- radius
- backdrop

Avoid:

- excessive blur
- giant radius
- glow
- gradient borders
- decorative lighting
- unnecessary glassmorphism

Light and dark themes should each retain clear hierarchy.

---

# Dialog structure

Where justified, standardize reusable regions such as:

- dialog container
- header
- title
- description
- body/content
- footer/actions
- close control

Do not force every dialog to contain every region.

Prefer composition over a large collection of specialized dialog components.

---

# Forms inside overlays

Overlay forms should use the Task 01C-A control system.

Standardize representative:

- labels
- inputs
- textareas
- selects where present
- validation/error placement
- helper text
- action groups

Do not redesign general application forms outside overlays.

---

# Action hierarchy

Dialog actions must have intentional hierarchy.

Typical patterns:

- primary action
- secondary/cancel
- destructive action when applicable
- close icon where appropriate

Avoid oversized competing actions.

Specifically inspect existing cases where actions such as `Open` and `Close` have excessive or equal visual dominance.

Do not change the underlying product action.

---

# Accessibility and interaction

Preserve or improve existing Base UI behavior.

Verify representative:

- keyboard opening
- focus placement
- focus containment/trapping
- Tab / Shift+Tab behavior
- Escape dismissal where appropriate
- focus return to trigger
- accessible title/description
- close-button label
- backdrop behavior
- scroll behavior
- background interaction blocking

Do not replace accessible Base UI behavior with custom interaction code unless necessary.

---

# Responsive behavior

Dialogs should behave intentionally across:

### Normal desktop
1440×900

### Short desktop
1280×500

### Normal mobile
390×844

### Short mobile
390×500

The dialog must never require content outside the reachable viewport.

For long content, the correct internal region should scroll.

Avoid whole-page horizontal overflow.

---

# Representative consumers

Keep migration limited.

Required:

1. Confessions composer
2. Notifications overlay/dialog if applicable
3. one representative form-heavy dialog
4. one representative compact confirmation/action dialog if present

If one of these categories does not exist, document that rather than inventing a consumer.

Command Center / Omnisearch should only be inspected for regression unless it shares the exact primitive being changed.

Do not redesign Command Center in this task.

---

# Confessions acceptance requirement

The Confessions composer must specifically be tested at:

- 1280×500
- 390×500
- 390×844

Confirm:

- dialog remains within reachable viewport
- header/title remains understandable
- composer fields remain reachable
- submit/cancel actions remain reachable
- internal scrolling works when necessary
- no horizontal overflow
- keyboard focus remains visible
- Escape/focus-return behavior remains correct

This requirement cannot be satisfied through source inspection alone.

---

# Motion

Keep overlay motion restrained.

Existing simple transitions may remain.

Do not introduce:

- GSAP
- React Spring
- elaborate Framer Motion choreography
- 3D transforms
- cinematic modal transitions

The future spatial-motion task owns broader motion architecture.

Reduced-motion behavior must remain valid.

---

# Preserve

Preserve:

- auth
- routes
- data
- state
- existing product actions
- Confessions functionality
- Base UI accessibility behavior
- Task 01A tokens
- Task 01B surfaces
- Task 01C-A controls
- theme behavior
- sample/demo disclosures

---

# Out of scope

Do NOT:

- redesign complete pages
- redesign sidebar
- redesign header
- redesign mobile navigation
- redesign app shell
- redesign Command Center
- implement spatial page transitions
- add WebGL
- add GSAP
- add React Spring
- install dependencies
- reconcile extraneous dependencies
- modify Supabase
- modify authentication
- fix ProfileMenu identity mismatch
- connect Settings preferences to consumers
- add new product features
- begin Task 01D

---

# Validation

Run:

- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Browser validation must include:

### Confessions
- 1280×500
- 390×500
- 390×844

### Representative shared-dialog consumers
- 1440×900
- 390×844

Check both light and dark themes on enough representative views to verify shared materials.

Explicitly test:

- open
- close
- Escape
- Tab
- Shift+Tab
- focus return
- internal scroll
- primary/secondary action hierarchy
- mobile overflow
- short-height overflow

Do not rerun the entire Task 00 matrix.

---

# Acceptance criteria

Task 01C-B is complete only when:

- [x] current dialog/overlay implementations were audited
- [x] shared dialog material uses Tasks 01A/01B foundations
- [x] overlay forms use Task 01C-A controls where appropriate
- [x] reusable constrained-height behavior exists
- [x] dialog body can scroll internally when required
- [x] action/footer regions remain reachable
- [x] safe viewport spacing exists
- [x] light-mode dialog hierarchy is coherent
- [x] dark-mode dialog hierarchy is coherent
- [x] dialog action hierarchy is coherent
- [x] keyboard focus remains visible
- [x] focus containment behavior remains correct
- [x] Escape behavior remains correct
- [x] focus returns correctly
- [x] background interaction remains appropriately blocked
- [x] Confessions composer works at 1280×500
- [x] Confessions composer works at 390×500
- [x] Confessions composer works at 390×844
- [x] Confessions fields and actions remain reachable
- [x] Confessions has no dialog-caused horizontal overflow
- [x] representative form-heavy dialog was validated if one exists
- [x] representative compact dialog was validated if one exists
- [x] Command Center has no obvious regression
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

- shared dialog/overlay architecture established
- consumers migrated
- Confessions short-height result
- accessibility behaviors validated
- remaining legacy overlays
- known issues/regressions
- important files changed
- recommended Task 01D scope

Do not begin Task 01D.

Task 01D should focus on the authenticated application shell and its structural visual hierarchy, not individual page redesigns.

## Verified completion — 2026-10-09

- Audited all raw Base UI dialogs: Confessions composer, Study Hub resource detail/share, Marketplace item detail/create and Command Center. Also inspected Notifications/Profile nonmodal regions and the navigation drawer. No compact confirmation/action dialog exists; the two detail dialogs are full resource/item inspectors. No consumer was invented. Existing detail actions already distinguish quiet/outline close from primary download/save-interest; no competing Open/Close pair was found.
- Added compositional `DialogContent`, `DialogHeader`, `DialogBody`, `DialogFooter` and opt-in `app/dialogs.css`. Base UI retains portal/modal/focus/dismissal behavior. Task 01B overlay/floating materials and 01C-A controls apply within migrated portals. Viewport/safe-area padding, bounded width/height, internal body scrolling, stable title/actions and body-local focus scrolling are shared. No new animation; reduced-motion policy remains unchanged.
- Migrated Confessions and Study Hub sharing form. Notifications remains an anchored, nonmodal region with shared material/body/footer composition; its desktop trigger is intentionally absent at 390px. Product handlers, state, native required validation and demo disclosures are preserved.
- Confessions browser checks: 1280×500 dark and 390×500 light both fit at y=16–484; body client/scroll heights 316/422 and 304/468 respectively. 390×844 dark fits at y=105.8–738.2, body 468/468. Tab and Shift+Tab cycle within the modal, focused fields scroll into view, actions stay reachable, and Escape/Cancel return focus to the trigger. No root horizontal overflow. Native blank-submit validation focuses the textarea without creating a post. A native textarea resize at 390×844 grows the body to 648/683 while the dialog stays within y=16–828 with its footer visible.
- Study Hub share validated at 1440×900 light and 390×844 dark: named title/description, labeled close, keyboard opening, initial focus, full forward/reverse focus cycle, internal mobile scroll, stable footer, Escape/Cancel/backdrop dismissal and trigger focus return. Backdrop intercepts background hits and body scrolling is locked. No horizontal overflow. No resource was submitted.
- Notifications checked at 1440×900 in dark/light: bounds fit, restrained floating material, keyboard opening, close/Escape focus return and preserved nonmodal behavior. Mobile absence verified at 390×844. Command Center regression checks at both representative sizes: opening, search filtering, Escape and focus return work; its implementation is untouched.
- Typecheck, lint and diff check pass. Captured browser error/warning logs are empty. Browser theme/viewport emulation was reset. No build, backend checks or broader route/device matrix performed.
- Remaining legacy overlays: Study Hub resource detail, Marketplace detail/create, Profile menu and navigation drawer. Task 01D is recommended for authenticated shell structure/hierarchy only; it was not started.
