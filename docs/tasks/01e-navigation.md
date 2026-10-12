# Task 01E — CampusOS Navigation Hierarchy and Interaction Language

## Objective

Establish the final shared navigation hierarchy, grouping, active-state system and interaction language for the authenticated CampusOS application.

Task 01D established the structural application shell.

Task 01E should now make navigation feel like part of CampusOS itself rather than generic dashboard navigation.

This task covers:

- desktop sidebar navigation
- mobile drawer navigation
- mobile dock navigation
- navigation grouping
- destination hierarchy
- active/current states
- hover/focus/pressed states
- compact destination presentation
- responsive consistency

It does NOT redesign product pages and does NOT introduce the global spatial-motion architecture.

---

# Required context

Before implementation:

1. Read `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/PRODUCT.md`.
4. Read `docs/DESIGN.md`.
5. Read `docs/DECISIONS.md`.
6. Read `docs/tasks/01d-app-shell.md`.
7. Read this task.
8. Inspect the current navigation route configuration.
9. Inspect Sidebar.
10. Inspect mobile drawer navigation.
11. Inspect mobile dock.
12. Inspect active-route detection.
13. Inspect navigation icons.
14. Inspect navigation accessibility behavior.
15. Inspect `git status` and `git diff`.

Read earlier task files only if implementation details from them are actually required.

Do not inspect individual page internals unless necessary to understand a route's product purpose.

---

# Product navigation principle

CampusOS is a digital campus operating system and community layer.

It is NOT primarily:

- an ERP
- an LMS
- an academic admin dashboard
- a collection of unrelated utilities

Navigation hierarchy should reinforce the product definition.

Community, campus life and discovery should feel central.

Academic tools and opportunities remain important but should not make the product read as an academic management dashboard.

Use `docs/PRODUCT.md` as the authority for product hierarchy.

Do not invent new product destinations.

---

# 1. Navigation inventory

Audit all existing protected destinations before changing grouping.

Identify:

- route
- current label
- icon
- current group
- desktop availability
- mobile drawer availability
- mobile dock availability
- active-route behavior

Every existing destination must remain reachable unless repository documentation explicitly marks it obsolete.

Do not silently remove routes.

---

# 2. Information hierarchy

Create a clear hierarchy based on actual CampusOS product areas.

A likely conceptual structure may include areas such as:

- Campus / Community
- Discover
- Academics
- Opportunities
- Personal / System

However, do NOT mechanically implement these names.

Derive the final grouping from:

- `docs/PRODUCT.md`
- current route inventory
- actual destination purpose
- navigation density

Prefer a small number of understandable groups.

Avoid excessive nested navigation.

---

# 3. Destination ordering

Within groups, establish intentional ordering.

Prioritize:

- frequent destinations
- community/campus identity
- primary workflows
- logical adjacency

Do not simply preserve historical file order if it produces poor product hierarchy.

Do not use alphabetical ordering unless it happens to support the product hierarchy.

---

# 4. Desktop sidebar

Using the Task 01D shell, refine navigation presentation.

The sidebar should feel:

- calm
- precise
- dense enough to be useful
- easy to scan
- distinctly CampusOS
- integrated into the navigation plane

Avoid:

- giant navigation pills
- every item inside a rounded rectangle
- glowing active items
- gradient active states
- oversized icons
- excessive separators
- decorative badges without meaning

Navigation should not look like a generic admin template.

---

# 5. Navigation item anatomy

Create one coherent item language.

Review:

- icon
- label
- optional metadata/badge where it already exists
- spacing
- hit target
- selected indicator
- focus state

The active destination should be immediately understandable without becoming visually dominant over the workspace.

Possible techniques include restrained combinations of:

- tonal surface change
- edge indicator
- typography change
- icon emphasis
- subtle depth

Do not use all techniques simultaneously unless justified.

---

# 6. Active route behavior

Audit active-route detection.

Ensure:

- exact routes behave correctly
- nested routes highlight the appropriate destination
- navigation state does not flicker unnecessarily
- active state is visually distinct in both themes
- active state does not depend solely on color where avoidable

Do not change route architecture.

---

# 7. Interaction states

Establish coherent:

- default
- hover
- focus-visible
- pressed
- active/current
- disabled if a real consumer exists

states.

Use Task 01A tokens and the existing control/surface foundations.

Motion must remain restrained.

Task 01F owns broader navigation motion.

---

# 8. Group labels

If group labels are useful, make them subtle but readable.

Avoid:

- tiny unreadable text
- excessive uppercase
- extreme tracking
- decorative labels
- labels that visually compete with destinations

Use semantic typography from Task 01A.

If a group is self-evident without a visible label, do not add one merely for consistency.

---

# 9. Icons

Audit icon consistency.

Use the existing icon system.

Ensure:

- consistent visual size
- consistent stroke treatment
- meaningful destination association
- no unnecessary decorative icons

Do not install another icon library.

Do not replace icons solely for novelty.

---

# 10. Mobile drawer

Desktop and mobile navigation should share information architecture.

The drawer should not become a separate navigation taxonomy.

Preserve the Task 01D drawer architecture and accessibility behavior.

Refine:

- hierarchy
- grouping
- destination presentation
- active state
- scanning
- spacing

Preserve:

- focus containment/wrapping
- Escape behavior
- backdrop dismissal
- focus return
- background blocking

---

# 11. Mobile dock

The dock should provide fast access to a deliberately small set of high-value destinations.

It should NOT attempt to reproduce the entire sidebar.

Audit the current dock destinations and determine whether they reflect the CampusOS product hierarchy.

Keep the number of persistent dock destinations intentionally limited.

A `More`/equivalent destination may continue to expose the complete navigation system through the drawer.

Do not invent new routes.

---

# 12. Mobile dock hierarchy

Dock items should have clear:

- inactive
- active
- pressed
- focus

states.

Avoid:

- oversized floating pill containers
- excessive blur
- glowing active icons
- animated bubbles
- generic iOS-clone treatment

The dock should belong visually to the CampusOS shell.

---

# 13. Cross-device consistency

A destination should retain:

- recognizable label
- recognizable icon
- logical grouping

across desktop and mobile wherever practical.

Do not create confusing device-specific terminology.

The mobile dock may expose only a subset, but the drawer should provide the full hierarchy.

---

# 14. Navigation density

CampusOS has many destinations.

Solve density through:

- hierarchy
- grouping
- spacing
- typography
- scanning

not by making text excessively small.

Do not hide important destinations solely to make the sidebar visually cleaner.

---

# 15. Product identity

Navigation should reinforce:

ONE CAMPUS. ONE IDENTITY. EVERY EXPERIENCE.

Do this through coherent hierarchy and presentation.

Do NOT literally repeat the tagline throughout navigation.

Do NOT add decorative branding copy merely to fill space.

---

# Motion boundary

Navigation may use simple existing transitions for:

- hover
- pressed
- active-state changes

Do not introduce:

- shared-element transitions
- animated route indicators that travel between destinations
- spring choreography
- GSAP
- React Spring
- elaborate Framer Motion sequences
- 3D navigation transforms
- parallax

Task 01F will define the motion/spatial architecture.

Do not pre-empt it.

---

# Preserve

Preserve:

- every valid route
- route contracts
- auth
- Supabase behavior
- shell structure from Task 01D
- independently scrolling sidebar
- mobile drawer accessibility
- mobile dock layout-space behavior
- Command Center
- notifications
- profile menu
- theme support
- focus behavior
- safe-area behavior
- reduced-motion behavior
- application data/state

---

# Out of scope

Do NOT:

- redesign product pages
- redesign landing
- restructure the Task 01D shell
- add product destinations
- remove valid destinations
- modify authentication
- modify Supabase
- fix ProfileMenu identity mismatch
- connect Settings preferences
- redesign Command Center
- redesign notifications
- redesign Profile
- introduce global page transitions
- introduce spatial navigation motion
- add WebGL
- add Three.js
- add GSAP
- add React Spring
- install dependencies
- reconcile dependencies
- delete legacy components
- begin Task 01F

---

# Representative validation

Because navigation is global, do not perform exhaustive page QA.

Validate navigation using representative routes from different groups.

At minimum test routes representing:

- Dashboard/home
- community/social
- discovery
- academic
- opportunity
- personal/system

Also test one nested/deeper route if the current routing structure contains one.

---

# Required viewports

Validate:

### Desktop
1440×900

### Laptop
1280×800

### Mobile
390×844

### Short desktop
1280×500

Tablet only needs regression inspection if shared responsive navigation logic changes.

Check both themes sufficiently to verify navigation materials and active states.

---

# Interaction validation

Explicitly test representative:

- click navigation
- keyboard navigation
- focus-visible
- hover
- pressed state
- active route
- active route after client navigation
- sidebar scrolling
- mobile drawer open/close
- drawer navigation
- drawer focus return
- mobile dock navigation
- More/drawer access
- route transition without stale active state

Do not mutate unrelated product data during testing.

---

# Regression checks

Check that navigation changes do not break:

- AppShell layout
- main scrolling
- short-height sidebar scrolling
- header
- Command Center
- Notifications
- Profile menu
- mobile safe areas
- mobile dock layout space
- representative dialog layering
- Map canvas layout

---

# Validation commands

Run:

- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Do not run a production build unless required to diagnose a problem.

Do not rerun the entire Task 00 QA matrix.

---

# Acceptance criteria

Task 01E is complete only when:

- [ ] all protected navigation destinations were inventoried
- [ ] every valid destination remains reachable
- [ ] navigation grouping reflects CampusOS product hierarchy
- [ ] destination ordering is intentional
- [ ] community/campus identity is not subordinated to academic-dashboard framing
- [ ] desktop navigation hierarchy is coherent
- [ ] navigation items share one visual language
- [ ] active route is immediately understandable
- [ ] active route does not rely solely on color where practical
- [ ] hover state is coherent
- [ ] focus-visible state is coherent
- [ ] pressed state is coherent
- [ ] group labels are readable and restrained
- [ ] icons are visually consistent
- [ ] mobile drawer shares the same information architecture
- [ ] mobile drawer accessibility remains intact
- [ ] mobile dock contains an intentional high-value subset
- [ ] complete navigation remains reachable on mobile
- [ ] dock active states are coherent
- [ ] desktop/laptop navigation was validated
- [ ] mobile navigation was validated
- [ ] short-height sidebar was validated
- [ ] light mode was validated
- [ ] dark mode was validated
- [ ] representative routes from each major group were tested
- [ ] active state remains correct after client navigation
- [ ] shell has no obvious regression
- [ ] Command Center has no obvious regression
- [ ] Notifications has no obvious regression
- [ ] Profile menu has no obvious regression
- [ ] representative dialog layering has no obvious regression
- [ ] Map layout has no obvious regression
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

- final navigation hierarchy/grouping
- important destination-ordering decisions
- desktop navigation result
- mobile drawer result
- mobile dock destination set
- active-state behavior
- representative routes validated
- remaining navigation debt
- known regressions/issues
- important files changed
- recommended Task 01F scope

Do not begin Task 01F.

Task 01F should define the CampusOS motion and spatial-interface system across route transitions, shared shell interactions and selected high-value surfaces without introducing arbitrary 3D decoration.