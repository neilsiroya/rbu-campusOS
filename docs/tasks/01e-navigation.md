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

- [x] all protected navigation destinations were inventoried
- [x] every valid destination remains reachable
- [x] navigation grouping reflects CampusOS product hierarchy
- [x] destination ordering is intentional
- [x] community/campus identity is not subordinated to academic-dashboard framing
- [x] desktop navigation hierarchy is coherent
- [x] navigation items share one visual language
- [x] active route is immediately understandable
- [x] active route does not rely solely on color where practical
- [x] hover state is coherent
- [x] focus-visible state is coherent
- [x] pressed state is coherent
- [x] group labels are readable and restrained
- [x] icons are visually consistent
- [x] mobile drawer shares the same information architecture
- [x] mobile drawer accessibility remains intact
- [x] mobile dock contains an intentional high-value subset
- [x] complete navigation remains reachable on mobile
- [x] dock active states are coherent
- [x] desktop/laptop navigation was validated
- [x] mobile navigation was validated
- [x] short-height sidebar was validated
- [x] light mode was validated
- [x] dark mode was validated
- [x] representative routes from each major group were tested
- [x] active state remains correct after client navigation
- [x] shell has no obvious regression
- [x] Command Center has no obvious regression
- [x] Notifications has no obvious regression
- [x] Profile menu has no obvious regression
- [x] representative dialog layering has no obvious regression
- [x] Map layout has no obvious regression
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
## Implementation inventory - 2026-10-12

Before edits: 27 protected page routes, all flat (no nested/deeper page to exercise). 26 were in NAV_GROUPS; Profile was available through the header menu. Desktop and drawer rendered the same list. Existing sidebar/dock matching was exact-or-segment-prefix; breadcrumb title matching was exact-only. There are no disabled navigation destinations or destination badges. Existing Lucide associations are retained; all destination icons now use 16px / 1.75 stroke.

| Route | Original label | Icon | Original group | Desktop / drawer | Original dock label |
| --- | --- | --- | --- | --- | --- |
| `/dashboard` | Dashboard | LayoutDashboard | Overview | Yes / Yes | Home |
| `/feed` | Campus Feed | Newspaper | Community | Yes / Yes | No |
| `/confessions` | Confessions | Ghost | Community | Yes / Yes | No |
| `/events` | Events | Calendar | Community | Yes / Yes | No |
| `/clubs` | Clubs | Users | Community | Yes / Yes | No |
| `/people` | People | UserRound | Community | Yes / Yes | No |
| `/lost-found` | Lost & Found | Search | Community | Yes / Yes | No |
| `/map` | Campus Map | Map | Campus & Exchange | Yes / Yes | Map |
| `/marketplace` | Marketplace | ShoppingBag | Campus & Exchange | Yes / Yes | No |
| `/facilities` | Facilities | Building2 | Campus & Exchange | Yes / Yes | No |
| `/services` | Services | LifeBuoy | Campus & Exchange | Yes / Yes | No |
| `/hostels` | Hostels | Building2 | Campus & Exchange | Yes / Yes | No |
| `/notes` | Study Hub | BookOpen | Knowledge & Academics | Yes / Yes | No |
| `/academics` | Academics | GraduationCap | Knowledge & Academics | Yes / Yes | Academics |
| `/timetable` | Timetable | Clock3 | Knowledge & Academics | Yes / Yes | No |
| `/attendance` | Attendance | ClipboardList | Knowledge & Academics | Yes / Yes | No |
| `/assignments` | Assignments | FileText | Knowledge & Academics | Yes / Yes | No |
| `/exams` | Exams | GraduationCap | Knowledge & Academics | Yes / Yes | No |
| `/sports` | Sports | Trophy | Student Life | Yes / Yes | No |
| `/gaming` | Gaming | Gamepad2 | Student Life | Yes / Yes | No |
| `/internships` | Internships | Briefcase | Opportunities | Yes / Yes | No |
| `/hackathons` | Hackathons | Zap | Opportunities | Yes / Yes | No |
| `/placements` | Placements | GraduationCap | Opportunities | Yes / Yes | No |
| `/campus-ai` | Campus AI | Sparkles | System & AI | Yes / Yes | AI |
| `/notifications` | Notifications | Bell | System & AI | Yes / Yes | No |
| `/settings` | Settings | Settings | System & AI | Yes / Yes | No |
| `/profile` | Profile | UserRound (new main-nav entry) | Profile menu only | Via Profile menu / via header menu | No |

Final order: standalone Dashboard (Home, without a redundant visible group heading); Campus life: Campus Feed, Events, Clubs, People, Confessions, Sports, Gaming; Discover: Campus Map, Facilities, Services, Hostels, Lost & Found, Marketplace; Academics: Study Hub, Academics, Timetable, Attendance, Assignments, Exams; Opportunities: Internships, Hackathons, Placements; Personal: Notifications, Profile, Campus AI, Settings.

Campus activity and participation precede utilities and academics. Discover places location and services together before exchange. Study Hub leads academic tools. Personal collects alerts, identity and platform utilities. The dock shares the exact labels/icons for Dashboard, Campus Feed, Events, Campus Map, plus More. Every original destination remains in the shared hierarchy; Profile is now also directly listed. Command Center continues deriving its route index from this configuration.

Current-page treatment is a neutral inset surface with a static edge mark and semibold label, exposed through aria-current. One segment-aware, most-specific matcher serves sidebar, dock and breadcrumb. Hover, inset keyboard focus and pressed surfaces share 01A tokens. Items are 40px desktop / at least 44px drawer and dock; labels retain semantic 14px navigation / 12px compact typography. Existing travelling spring indicators and redundant dot were replaced with static markers; route/drawer motion and shell structure are unchanged.

## Verified completion - 2026-10-12

- Completed: Dashboard, Campus Feed and Campus Map at 1440x900 dark; Study Hub and Internships at 1280x800 light; Profile/Settings at 1280x500 light; Confessions, Events and Campus Feed at 390x844 light/dark. All sampled root/main regions have no horizontal overflow. Map canvas rendered at 752x458 CSS pixels. No nested protected page exists, so nested matching is source-reviewed only.
- Desktop/laptop click and keyboard routes select the expected current destination and reset/focus main. Sidebar scroll reaches Settings at short height (visible y=390.8-430.8); its inset focus outline is visible. Main scroll remains independent. Real pointer hover and pressed states and dock keyboard focus/pressed feedback were observed.
- Mobile drawer: all 27 links remain in the shared list. Keyboard opening, initial close focus, forward/reverse wrapping, Escape, close button, backdrop dismissal, focus return and background inertness/interception pass. Drawer navigation to Confessions and dock navigation to Events/Feed pass. Full labels wrap on mobile; dock icons are aligned, and the in-flow dock reserves approximately 77px, with main ending at its top. Existing safe-area rules are retained; no physical notched device test is claimed. Responsive shell logic/breakpoints are unchanged, so no additional tablet pass is required.
- Command Center keyboard opening, Profile filtering and Escape/focus return pass. Notifications and Profile menu open/dismiss and return focus. Confessions dialog remains y=105.8-738.2 at 390x844; its backdrop intercepts both header and dock, initial alias focus and Escape/trigger return pass. No product data mutated.
- Typecheck and lint passed; diff check passed before final documentation. Captured logs have no errors, only existing smooth-scroll and THREE.Clock warnings.
- Final return-to-Dashboard check passed on desktop and mobile, including keyboard and pointer, correct current markers and main-content focus. The initial mobile center click hit the Next.js development badge (confirmed by hit testing); clicking an unobstructed part of the same link succeeds. This dev-only overlay obstruction remains, without application changes. Cold development compilation also caused navigation-tool timeouts; no production timing claim is made.
- Final typecheck, lint and diff check pass. Source inventory comparison confirms 27 distinct navigation entries for 27 protected pages, with no missing destinations. Docs are UTF-8. Original dark theme retained and viewport/device emulation reset. No production build or repeated full audit was run.
- Remaining debt: development badge overlap, existing ProfileMenu identity mismatch, unused Settings preferences, existing smooth-scroll/THREE.Clock warnings, and deferred route/drawer/global spatial motion. No new application navigation regression found in the representative set. Task 01F should define route continuity, shared-shell interaction motion and selected useful surface depth while preserving accessibility/reduced motion; it has not been started.
