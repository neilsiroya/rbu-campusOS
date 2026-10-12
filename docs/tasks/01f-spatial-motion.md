# Task 01F — CampusOS Spatial Motion and Interaction Architecture

## Objective

Establish the reusable spatial, motion and interaction architecture that will power the next generation of CampusOS.

Tasks 01A–01E established the static design foundation:

- semantic tokens
- typography
- surfaces
- controls
- dialogs
- application shell
- navigation

Task 01F is the transition from a static interface system into a spatial digital environment.

CampusOS should begin to feel dimensional, responsive and continuous rather than like a collection of conventional web pages.

This task must produce a visibly meaningful improvement, not merely change easing values or add generic entrance animations.

However, this is still an architecture task.

Do not attempt the complete cinematic landing redesign or complete Dashboard redesign here. Those are the immediately following flagship tasks.

---

# Creative direction

The long-term CampusOS target is an immersive, experimental, premium digital experience influenced by studios such as Basement Studio.

Interpret that influence through principles rather than imitation.

CampusOS should eventually feel:

- spatial
- layered
- tactile
- responsive
- cinematic where appropriate
- technologically advanced
- editorial
- precise
- alive

It should NOT become:

- a generic animated SaaS dashboard
- a collection of floating cards
- random WebGL objects
- a Three.js demo
- a glassmorphism showcase
- excessive parallax
- a collection of animation presets
- motion applied everywhere simply because it can be

Every spatial or motion effect must have an interface purpose.

---

# Required context

Before implementation:

1. Read `AGENTS.md`.
2. Read `docs/STATE.md`.
3. Read `docs/PRODUCT.md`.
4. Read `docs/DESIGN.md`.
5. Read `docs/ARCHITECTURE.md`.
6. Read `docs/DECISIONS.md`.
7. Read Tasks 01D and 01E.
8. Read this task.
9. Audit all currently active motion code.
10. Audit Framer Motion usage.
11. Audit native Web Animations usage.
12. Audit CSS transitions/animations.
13. Audit the pointer spotlight.
14. Audit route entrance behavior.
15. Audit any view-transition helpers.
16. Audit current Three/R3F usage and confirm it remains Map-specific.
17. Inspect package.json before making any tooling decision.
18. Inspect `git status` and `git diff`.

Do not assume extraneous packages in node_modules are approved dependencies.

---

# 1. Motion inventory

Before implementing new behavior, identify the existing systems responsible for:

- route entrances
- shell transitions
- navigation state transitions
- dialogs
- menus/popovers
- cards/surfaces
- hover states
- pointer response
- reduced-motion behavior
- map WebGL
- any unused motion/view-transition helpers

Determine which systems should:

- remain
- be consolidated
- be replaced
- be deferred

Do not preserve conflicting motion systems merely because they already exist.

---

# 2. Motion responsibility model

Establish clear ownership.

Preferred responsibilities:

### CSS

Use for:

- simple hover transitions
- focus/pressed transitions
- small material changes
- opacity/color/border transitions
- inexpensive micro-interactions

### Framer Motion

Use for:

- component layout transitions
- presence
- meaningful interactive motion
- selected shared-layout relationships
- gesture-driven interactions where useful
- reusable spring behavior

### Native browser APIs

Use where they provide a simpler or more performant solution than React animation.

### GSAP

Do NOT add GSAP during this task merely because it exists extraneously in the local install.

If the audit demonstrates that future cinematic landing choreography genuinely requires GSAP, document that recommendation for Task 02A.

Do not change dependencies during 01F.

### Three / R3F

Do not expand Three.js beyond its existing Map use during 01F.

Task 01F defines how future WebGL layers should integrate with the interface, but does not introduce decorative 3D scenes.

---

# 3. Spatial model

Define a small reusable spatial model for CampusOS.

The interface should conceptually contain layers such as:

### Base plane

Persistent application/environment background.

### Navigation plane

Persistent orientation and movement through CampusOS.

### Workspace plane

Primary page content.

### Raised interactive plane

Contextual surfaces that temporarily gain prominence.

### Floating plane

Menus, command interfaces and lightweight floating UI.

### Overlay plane

Dialogs and modal experiences.

Use existing Task 01A/01B depth and layer semantics wherever possible.

Do not create arbitrary z-index values throughout components.

---

# 4. Depth as interaction

Depth should communicate state.

Examples:

- selected content may move subtly forward
- background workspace may recede when a modal becomes dominant
- interactive surfaces may respond subtly to pointer proximity
- navigation transitions may communicate movement between contexts
- overlays should clearly occupy a different spatial layer

Depth must not merely mean larger box shadows.

Potential tools include restrained combinations of:

- scale
- translation
- perspective
- opacity
- blur
- clipping/masks
- surface material changes
- relative movement

Use these carefully.

---

# 5. Route continuity

Replace the feeling of:

click → old page disappears → new page appears

with intentional continuity.

Audit the existing route entrance implementation.

Create a reusable route transition policy suitable for the authenticated application.

Transitions should be:

- fast
- directional only when direction has semantic meaning
- interruption-safe
- compatible with browser navigation
- compatible with main scroll reset
- compatible with focus management
- accessible
- reduced-motion aware

Avoid generic page fade presets.

Do not create slow cinematic transitions for routine navigation.

---

# 6. Shared-element strategy

Investigate whether shared-element continuity is useful for selected CampusOS interactions.

Examples may eventually include:

- event card → event detail
- profile/avatar → profile context
- map location → facility information
- feed item → focused content
- search result → destination

Task 01F should establish the strategy and reusable infrastructure only where justified by current architecture.

Do not retrofit every route with shared elements.

Do not fake shared elements using fragile absolute-position hacks.

If browser View Transitions are useful, evaluate progressive enhancement and compatibility rather than assuming universal support.

---

# 7. Shell continuity

Apply the spatial system to selected persistent shell interactions.

The shell should remain visually stable while content changes.

Refine only useful motion around:

- navigation selection
- workspace changes
- utility surfaces
- drawer presentation
- Command Center presentation if shared infrastructure affects it

Do not redesign their static visual appearance.

Do not undo Tasks 01D/01E.

---

# 8. Surface interaction language

Establish restrained spatial response for selected high-value interactive surfaces.

Potential behavior:

- subtle pointer-relative depth
- controlled lift/compression
- layered content response
- contextual reveal
- surface emphasis

Do not apply tilt to every card.

Do not make ordinary text rows move in 3D.

Do not create novelty interactions that slow everyday use.

Select only a small representative set.

---

# 9. Pointer-responsive behavior

The existing bounded pointer spotlight should be audited.

Preserve native cursor behavior.

Determine whether pointer response should become part of the spatial system.

Any pointer-relative effect must:

- remain subtle
- remain bounded
- avoid constant React rerenders where possible
- disable appropriately for coarse pointers
- disable or simplify for reduced motion
- avoid interfering with selection/clicking
- avoid following the pointer across the entire site as a gimmick

---

# 10. Perspective

Introduce perspective only where it communicates spatial hierarchy.

Do not globally apply perspective to the application.

Do not rotate entire pages.

Do not create permanently tilted interfaces.

Define reusable perspective/depth values if implementation requires them.

Perspective must remain compatible with readable UI.

---

# 11. Masks and reveals

Establish a restrained reveal language suitable for future cinematic sections.

Potential techniques:

- clipping
- masking
- directional reveals
- layered text/image entrances

Do not heavily deploy this across existing pages.

Create only enough implementation to prove the system.

The flagship landing task will use this language much more aggressively.

---

# 12. Typography in motion

Typography will become an important part of the future immersive CampusOS identity.

Define principles for:

- heading reveals
- section transitions
- numeric/data changes
- navigation label transitions

Avoid:

- letter-by-letter animation everywhere
- constant text movement
- unreadable distortion
- random scrambling
- gimmicky hacker effects

Do not comprehensively animate current page typography.

---

# 13. Motion tokens

Establish a concise reusable motion vocabulary.

This may include semantic values for:

- immediate
- fast
- standard
- expressive

and reusable easing/spring behavior.

Do not create dozens of arbitrary durations.

Motion values should express purpose rather than component names.

---

# 14. Reduced motion

Reduced motion is mandatory.

For `prefers-reduced-motion`:

- remove large translations
- remove perspective motion
- remove pointer-following spatial effects
- remove unnecessary scale
- preserve state communication
- preserve immediate orientation
- retain simple opacity/material changes where appropriate

The reduced-motion experience must remain polished rather than appearing broken.

---

# 15. Performance architecture

Spatial design cannot make CampusOS feel slow.

Avoid:

- layout-thrashing animations
- unnecessary React state on pointermove
- animating expensive properties without justification
- permanent requestAnimationFrame loops
- unnecessary WebGL canvases
- multiple full-screen effects
- excessive blur
- excessive backdrop-filter
- unbounded observers/listeners

Prefer compositor-friendly properties where practical.

Document any continuous animation loop introduced and justify it.

---

# 16. Future WebGL integration contract

Do NOT create the immersive WebGL experience yet.

Instead establish/document how future Tasks 02A/02B should integrate WebGL if used.

The contract should address:

- canvas ownership
- layering relative to DOM
- pointer-event strategy
- responsive quality
- reduced motion
- device capability fallback
- lazy loading
- route lifecycle
- GPU cleanup
- accessibility
- static fallback
- avoiding multiple competing canvases

The existing Map remains its own functional WebGL surface.

---

# 17. Representative implementation

01F must visibly prove the system.

Apply the new spatial/motion architecture only to a controlled representative set.

Required:

### Authenticated shell

Demonstrate route continuity without destabilizing the persistent shell.

### Navigation

Demonstrate restrained state continuity using the 01E navigation system.

### One prominent Dashboard surface

Demonstrate useful spatial surface interaction without redesigning the Dashboard.

### Command Center or another existing floating surface

Demonstrate layer hierarchy if the shared architecture naturally applies.

### One mobile interaction

Demonstrate that spatial behavior adapts rather than simply disappearing badly.

The goal is to prove the language, not redesign all pages.

---

# 18. Visual significance requirement

The resulting representative interactions must be visibly distinguishable from the pre-01F application.

A user should be able to perceive:

- improved continuity
- depth hierarchy
- more intentional movement
- better tactile response

without being told what changed.

If implementation only changes durations/easing while the interface appears essentially identical, this requirement is not satisfied.

At the same time, do not artificially exaggerate motion simply to satisfy this requirement.

---

# 19. Landing boundary

Inspect the landing only enough to understand how the motion architecture can later support it.

Do NOT redesign the landing during 01F.

Do NOT add a hero WebGL scene.

Do NOT add cinematic scroll choreography.

Do NOT replace its content.

Task 02A will be the complete immersive landing redesign.

---

# 20. Dashboard boundary

Do NOT redesign Dashboard information architecture during 01F.

The existing Dashboard remains a representative spatial consumer only.

Task 02B will rebuild the authenticated flagship workspace.

---

# Preserve

Preserve:

- routes
- auth
- Supabase
- application state
- Task 01D shell
- Task 01E navigation hierarchy
- dialog accessibility
- drawer accessibility
- focus management
- scroll behavior
- mobile safe areas
- Command Center behavior
- Map functionality
- current product functionality
- disclosures
- theme support

---

# Out of scope

Do NOT:

- redesign the landing
- redesign Dashboard
- redesign individual product pages
- change navigation information architecture
- restructure the application shell
- add decorative 3D objects
- create a global Three.js canvas
- add random particles
- add blobs
- add spheres
- add toruses
- add floating metallic objects
- add WebGL merely to claim the site is 3D
- install GSAP
- install React Spring
- install animation dependencies
- reconcile extraneous dependencies
- modify Supabase
- modify authentication
- fix ProfileMenu identity
- implement Settings preference consumers
- begin Task 02A
- begin Task 02B

---

# Validation

Run:

- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Browser validation should include:

### Desktop

1440×900

### Mobile

390×844

### Short desktop

1280×500 where shell/route behavior is affected

Validate representative:

- Dashboard
- Feed or Events
- Map regression
- Command Center
- mobile navigation/drawer

Test:

- route transitions
- rapid route changes
- browser back/forward where practical
- scroll reset
- focus placement
- keyboard navigation
- pointer interactions
- reduced motion
- coarse-pointer/mobile behavior
- dialog layering
- drawer layering
- light theme
- dark theme

Do not run the complete Task 00 matrix.

---

# Acceptance criteria

Task 01F is complete only when:

- [ ] existing motion systems were inventoried
- [ ] motion responsibilities are documented
- [ ] conflicting/redundant active motion behavior is consolidated where appropriate
- [ ] reusable spatial-layer model exists
- [ ] reusable motion vocabulary/tokens exist
- [ ] route continuity policy exists
- [ ] representative route continuity is implemented
- [ ] persistent shell remains stable during route movement
- [ ] focus behavior remains correct
- [ ] scroll-reset behavior remains correct
- [ ] browser navigation does not obviously break transitions
- [ ] selected surface depth behavior is implemented
- [ ] pointer behavior has coarse-pointer fallback
- [ ] reduced-motion behavior is implemented
- [ ] reduced-motion experience remains polished
- [ ] perspective is restrained and purposeful if used
- [ ] no arbitrary decorative 3D was introduced
- [ ] no unnecessary continuous animation loop was introduced
- [ ] no new dependency was added
- [ ] Dashboard representative interaction visibly demonstrates the system
- [ ] navigation visibly demonstrates the system
- [ ] floating/overlay hierarchy demonstrates the system where appropriate
- [ ] mobile interaction demonstrates an adapted spatial response
- [ ] representative experience is visibly more dimensional/continuous than before
- [ ] Map remains functional
- [ ] dialogs remain correctly layered
- [ ] drawer remains correctly layered
- [ ] light mode was checked
- [ ] dark mode was checked
- [ ] reduced motion was checked
- [ ] desktop was checked
- [ ] mobile was checked
- [ ] no product functionality was intentionally changed
- [ ] typecheck passes
- [ ] lint passes
- [ ] `git diff --check` passes
- [ ] no obvious new runtime errors were introduced
- [ ] future WebGL integration contract is documented
- [ ] task checklist is accurate
- [ ] `docs/STATE.md` is updated

---

# State handoff

When complete, update `docs/STATE.md` with:

- motion systems retained/replaced
- motion responsibility model
- spatial layer model
- motion tokens
- route transition architecture
- shared-element strategy
- pointer/depth interaction strategy
- reduced-motion behavior
- performance decisions
- representative consumers
- future WebGL integration contract
- known issues
- important files changed

Then recommend:

### Task 02A

Complete immersive/spatial landing experience.

### Task 02B

Complete immersive authenticated Dashboard/workspace experience.

Do not begin either task.

Task 02A and Task 02B are the first flagship visual transformation tasks and should use the architecture established here rather than treating 01F as the final visual result.
