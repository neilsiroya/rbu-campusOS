# RBU CampusOS — Premium 3D Immersive Upgrade
## Implementation Plan

## Task 1: WebGL Foundation — Adaptive Quality, Visibility Pause, and Disposal Correctness
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Implement `useAdaptiveQuality.ts`: detect viewport width, devicePixelRatio, low-power preference; return `QualityTier` (high/medium/low/fallback)
  - Strengthen `useVisibilityPause.ts`: subscribe to `visibilitychange`, IntersectionObserver on container; return `isPaused`
  - Build a `useSceneCleanup` hook in lib/webgl that disposes geometries/materials/textures on unmount
  - Add disposal to ImmersiveCanvas + SceneErrorBoundary
  - Confirm fallback DOM renderer fires when `QualityTier.fallback` or WebGL context creation fails
- **Acceptance Criteria Addressed**: AC-3, AC-20
- **Test Requirements**:
  - `rule` TR-1.1: With DevTools device emulation at 390px width, useAdaptiveQuality returns tier "low" (DPR clamped to 1, quality tier string inspectable).
  - `rule` TR-1.2: Tab away → visibilitychange fires, useVisibilityPause returns isPaused=true; tab back → isPaused=false; render frames verified zero during pause via console probe.
  - `rule` TR-1.3: After 10 mount-unmount cycles of CampusCore, THREE.WebGLRenderer info.memory.geometries count does not grow (delta <= 0).
  - `rule` TR-1.4: ImmersiveCanvas fallback DOM renders when window.WebGLRenderingContext is forced undefined; shows telemetry HUD equivalent to the canvas.
- **Notes**: Foundation work. All 3D work downstream depends on this.

## Task 2: Motion System — CampusOS Abstractions and Consistency
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - In `components/motion/`, ensure these abstractions exist and are exported from index: `CampusReveal` (InView fade+translate), `CampusStagger` (staggered children), `CampusPageTransition` (AnimatePresence-like route transitions), `CampusAnimatedBackground` (AnimatedBackground primitive for nav), `CampusSpotlight` (card spotlight effect), `CampusGlare` (hover glare on featured), `CampusMagnetic` (high-value CTA only).
  - Audit globals.css motion tokens + CSS utility classes for the 7 tiers: MICRO, HOVER, INTERACTION, STANDARD, EMPHASIS, PAGE, CINEMATIC.
  - Ensure all new card interactions use --motion-duration-* tokens instead of raw ms values.
- **Acceptance Criteria Addressed**: NFR-6, AC-4, AC-18
- **Test Requirements**:
  - `rule` TR-2.1: `components/motion/index.ts` exports at least 5 components; grep for raw `duration: 300ms` or `transition: all 0.3s` in components directory outside of globals.css returns 0 matches (excluding node_modules).
  - `rule` TR-2.2: globals.css contains class/var for the 7 motion tiers and each tier has at least one consumer in layout or dashboard components.
  - `rubric` TR-2.3: Motion consistency across pages; scale 1-5; anchors 1=mixed speeds everywhere, 3=mostly consistent some jarring, 5=all interactions feel like one system; threshold >= 4; evidence=visual walkthrough of dashboard+events+landing.

## Task 3: CampusLiquidMetal Native Material Component
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Build `components/immersive/CampusLiquidMetal.tsx`. Use R3F + Drei + shader material techniques:
    - Subtle flowing material bands (time-domain noise)
    - Spectral highlights with subtle chromatic dispersion (not rainbow)
    - Pointer-driven deformation: eased normalized pointer (not raw coords) drives vertex displacement within radius
    - Press response: localized indent + ripple (onClick/onPointerDown)
    - Focus response: accessible rim highlight that pulses once on focus-visible
    - Touch: PointerEvents unified; no hover dependency
    - Light/dark two variants: adjust metalness, roughness, base color per theme
  - CampusOS emerald/teal palette. No psychedelics.
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-3.1: Component mounts in light and dark without console errors. Liquid surface visible; pointer moves → subtle (≤5% shape change) deformation; click → ripple + press deformation visible.
  - `rule` TR-3.2: Keyboard Tab focus produces a visible focus-visible rim; Enter/Space triggers press deformation + ripple.
  - `rubric` TR-3.3: Material quality and CampusOS identity fit; scale 1-5; anchors 1=plain sphere, 3=decent metal but generic, 5=fluid, reflective, restrained, feels like CampusOS not a library demo; threshold >= 4; evidence=screenshot both modes.

## Task 4: Campus Core — Liquid Metal Integration and Data Response
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 3
- **Description**:
  - Refactor `components/immersive/CampusCore.tsx` to use CampusLiquidMetal as the inner core (replace or wrap InnerTopologyCore).
  - Keep orbital rings and atmospheric cloud. Layer: liquid core inside + topology noise surface layer on top + rings + particles.
  - Derive `visualIntensity` from academic state wired through OS store activeCoreDataMetric: academic, connectivity, events, workload.
  - Ensure HUD telemetry chips remain DOM-accessible. Preserve expand/collapse + reset.
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `rule` TR-4.1: Setting `useOSStore.getState().setActiveCoreDataMetric('workload')` changes visual intensity (orbital speed OR deformation amplitude OR emissive intensity) measurably compared to 'academic'.
  - `rule` TR-4.2: HUD still shows all 4 metric chips with data from campus-data; Expand/Collapse + Reset buttons work.
  - `rubric` TR-4.3: Core visual presence quality; scale 1-5; anchors 1=just metal sphere, 3=nice but lacks identity, 5=signature living digital infrastructure object; threshold >= 4; evidence=dashboard+landing hero screenshots.

## Task 5: Navigation — Animated Background Active Indicator + Mobile Dock Polish
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - Sidebar: Replace current `layoutId="sidebar-active-pill"` approach with CampusAnimatedBackground (or AnimatedBackground from motion primitives if available) so the active background *slides* smoothly between items. Add secondary micro-indicator: the small dot already there.
  - Mobile bottom nav: Ensure the active state has the same animated background principle (even if smaller). Confirm all 5 items + More button meet 44x44px touch targets. Confirm safe-area padding-bottom env(safe-area-inset-bottom).
  - Breadcrumb contextual secondary nav for deep routes: detect current group from NAV_GROUPS and show 1-line breadcrumb in Header (desktop only, under the title).
- **Acceptance Criteria Addressed**: AC-4, FR-5, FR-6, FR-7
- **Test Requirements**:
  - `rule` TR-5.1: Clicking 2 different sidebar items sequentially → visible animated indicator translates smoothly; no jump; measured visual delay < 400ms.
  - `rule` TR-5.2: Mobile 390px: each bottom-nav button getBoundingClientRect height ≥ 44, width ≥ 44. body padding-bottom accounts for safe-area; no content behind dock.
  - `rule` TR-5.3: Desktop page with route like /academics shows breadcrumb: "CampusOS › Academics" (or appropriate group label from NAV_GROUPS).

## Task 6: Command Center (Cmd+K) — Grouping + Recent + Empty/Loading states
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - Add section grouping headings to hits list: Commands / Navigation / Marketplace / Study Hub / Events / Clubs / People / Facilities.
  - Add recent actions via sessionStorage (last 3 successful actions) shown when query empty.
  - Loading state: show shimmer skeleton row when query is processing.
  - Empty state copy: "Nothing found for \"{query}\". Try 'immersive', 'focus', 'notes', or 'lab-4'."
  - Polish glass-command dialog entrance animation (framer-motion or CSS motion tokens).
  - Confirm `Cmd+K` and `Ctrl+K` both work. Esc closes cleanly. focus ring on active option.
- **Acceptance Criteria Addressed**: AC-6, FR-11, FR-12
- **Test Requirements**:
  - `rule` TR-6.1: Empty query shows "Recent actions" (after at least one executed command) + "Popular commands" section; grouped section labels visible on populated result.
  - `rule` TR-6.2: `CmdOrCtrl+K` opens, Esc closes, arrow keys change active row, Enter executes the selected hit; aria-activedescendant stays synchronized.
  - `rule` TR-6.3: Typing query yielding zero hits shows intelligent copy with suggestions; never generic "No results".

## Task 7: Dashboard — Card Role Variety + Information Hierarchy Tiers
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 4
- **Description**:
  - Audit current dashboard: count distinct card surfaces. Target ≥ 5 visual roles:
    1. Greeting hero with Campus Core (spatial core banner already exists — strengthen layout asymmetry and telemetry prominence).
    2. Featured Event Card (featured-card variant: spotlight + glare + deeper lift).
    3. Interactive cards (CampusPulse, ConfessionPreview) — HoverLift + border response.
    4. Command surfaces (Marketplace pulse, Study Hub pulse) — glass-tint variants.
    5. Minimal info cards (QuickActions icons) — smaller radius, no hover lift, subtle border.
    6. Metric/surface data cards (Attendance bars, CGPA chip) — data-surface variant.
  - Ensure WHAT-MATTERS-NOW ordering: 1) Greeting + next-class + core → 2) Upcoming/urgent → 3) Quick actions → 4) Around-campus (feed, confessions, events).
  - Focus Mode: confirm spatial continuity (re-uses same greeting header, just swaps grid).
- **Acceptance Criteria Addressed**: AC-5, FR-8, FR-9, FR-10
- **Test Requirements**:
  - `rule` TR-7.1: Dashboard contains ≥ 5 visually distinct card surface styles (measurable by different class composition or radius/elevation/border combinations).
  - `rubric` TR-7.2: Information hierarchy clarity; scale 1-5; anchors 1=no priority random cards, 3=some order, 5=Now→Next→Do→Around unmistakably clear; threshold >= 4; evidence=screenshot + visual role count.
  - `rule` TR-7.3: Focus Mode toggle button shows/hides the quiet view without route change; no stale state.

## Task 8: Landing Page — Cinematic Hero + Section Continuity
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2, Task 4
- **Description**:
  - Upgrade `app/page.tsx` hero:
    - Keep ONE CAMPUS / ONE IDENTITY / EVERY EXPERIENCE tagline. Enlarge display typography (use text-display-xl, line-height tight, asymmetric layout).
    - Add live system info bar: current date/time via Intl, current-week academic week number, today-attendance live chip, next-class mini-card, upcoming-deadline chip.
    - Integrate Campus Core as the "spatial theater" right-hand panel (already there — ensure larger size "hero", expand mode, liquid metal).
    - Add staggered micro entrance animations via CampusStagger + reveal on headline words.
  - Section 2 (Architecture lanes): Keep current 4-column border-t design; tighten metadata.
  - Section 3 (Closing marquee card): Keep but make CTA magnetic (CampusMagnetic wrapper).
- **Acceptance Criteria Addressed**: AC-7, FR-13, FR-14
- **Test Requirements**:
  - `rubric` TR-8.1: Hero identity strength; scale 1-5; anchors 1=generic SaaS, 3=nice but feels templated, 5=immediate "this is university OS" feeling, architectural type, live info, spatial object; threshold >= 4; evidence=desktop screenshot light+dark.
  - `rule` TR-8.2: Live date/time and academic info chips render real data; time updates without page reload (setInterval ≤ 60s interval fine).
  - `rule` TR-8.3: No horizontal overflow at 390px on landing page. Test: document.documentElement.scrollWidth <= clientWidth.

## Task 9: Events Route — Featured Card + Disclosure Expand In-Place
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - `app/(app)/events/page.tsx`:
    - Feature first event from EVENTS marked featured. Render as featured-card: CampusSpotlight + CampusGlare, larger padding, gradient tint border-glow.
    - Remaining events as standard disclosure panels (using Base UI Accordion or internal Disclosure primitive if available).
    - Expanded event shows registration status, club, location map pin, add-to-calendar action.
    - Filter chips by category (Club/Cultural/Technical/Workshop/Competition) using FilterChips component.
    - PageIntro component header + count.
- **Acceptance Criteria Addressed**: AC-8, FR-15
- **Test Requirements**:
  - `rule` TR-9.1: Featured event visually distinct (spotlight + glare class present + size > standard); on mobile it's above the fold.
  - `rule` TR-9.2: Clicking non-featured event toggles inline expand/collapse; no modal overlay for details; expanded state preserved until collapse.
  - `rule` TR-9.3: Category filter chips filter EVENTS by category correctly; "All" returns full list.

## Task 10: Clubs + People Routes — Identity Richness and Working Filter/Search
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - **Clubs**: Identity header per club (image + category pill + member count + upcoming activity list). Expandable about/board/upcoming inline. Use PageIntro header.
  - **People**: Lucide-powered search/filter. Search box filters PEOPLE by partial name/branch/year match. Filter chips by year (1st/2nd/3rd/4th). Person card: profile initial or placeholder, name, branch+year metadata, subtle hover reveal (major field). Click → opens profile page (route exists already).
- **Acceptance Criteria Addressed**: AC-9, FR-16, FR-17
- **Test Requirements**:
  - `rule` TR-10.1: People search "aryan" returns correct demo match (case-insensitive substring). Year chips correctly filter PEOPLE.year.
  - `rule` TR-10.2: Clubs page has ≥3 card styles (featured top club + standard list + upcoming activity strip). No horizontal overflow mobile.
  - `rubric` TR-10.3: Identity richness and usability; scale 1-5; anchors 1=plain list, 3=some decoration, 5=each club feels distinct real entity, people directory useful; threshold >= 4.

## Task 11: Academics Routes — Metric Surfaces + Premium Tables (Sort, Hover, Mobile→Card)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - **Academics page**: Header (CGPA big number, credits progress bar, overall attendance) → 4 modules: Attendance, Assignments, Timetable, Exams.
  - **Premium table pattern** (reusable across Attendance/Assignments/Exams):
    - Desktop: sticky header, sortable columns (click header), row-hover subtle highlight.
    - Mobile (<640px): Transform rows → stacked cards. Column headers become card metadata labels.
  - **Timetable**: Weekday column grid (desktop) → today-then-list mobile.
  - Add NumberFlow-like transitions on key numeric metrics (attendance %, CGPA, credits).
- **Acceptance Criteria Addressed**: AC-9, FR-18
- **Test Requirements**:
  - `rule` TR-11.1: Attendance table header sort toggles ascending/descending; arrow indicator present; data reorders correctly.
  - `rule` TR-11.2: Resize to 390px — attendance/exam table rows render as cards (no horizontal scroll).
  - `rule` TR-11.3: CGPA 8.42 and attendance 88% appear as large numerals.

## Task 12: Campus AI — States and Structured Surfaces
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - `app/(app)/campus-ai/page.tsx` + CampusAIPreview component:
    - Add explicit state machine UI: Idle prompt bar → Thinking (subtle loading dots + text "Reasoning across campus knowledge…") → Retrieving ("Searching 1,204 resources…") → Composing → Completed (structured cards).
    - Structured responses: If query = "timetable today" → timetable fragment card; "events" → event cards; "professor X" → person card; "help" → FAQ bullets.
    - Canned demo responses (no LLM integration required). Keep answers calm, short, structured — not paragraph walls.
    - Error state: "Campus AI had trouble reaching the knowledge layer. Your conversation is safe. Try again in a moment or use Omnisearch above."
- **Acceptance Criteria Addressed**: AC-10, FR-19
- **Test Requirements**:
  - `rule` TR-12.1: Submit a demo query; sequence of Idle→Thinking→Retrieving→Composing→Completed visible (each state has distinct visual).
  - `rule` TR-12.2: Error state copy includes "what happened / data safe / next step". No stack traces.
  - `rubric` TR-12.3: AI shell visual quality; scale 1-5; anchors 1=terminal/hacker look, 3=basic chat, 5=calm OS-level capability, not a gimmick; threshold >= 4.

## Task 13: Map / Campus — Spatial with Bounded Camera + Reset + List Alternative
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 1, Task 2
- **Description**:
  - `components/map/SpatialCampusMap.tsx`:
    - Ensure OrbitControls have minDistance/maxDistance/polarAngle min/max clamp (no flip, no zoom through floor).
    - Reset camera button (bottom-right) returns to default pos/target.
    - Touch support via Drei OrbitControls (enableDamping, touches).
    - List alternative side panel: clickable facilities/buildings that also fly the camera to the target.
    - Fallback 2D: when fallback tier, show list + 2D floor plan image placeholder (no blank).
- **Acceptance Criteria Addressed**: AC-11, FR-20
- **Test Requirements**:
  - `rule` TR-13.1: OrbitControls polar clamp prevents flipping past straight-down or straight-up; zoom clamped between 2 and 15.
  - `rule` TR-13.2: Reset button returns camera to initial position within ≤0.5 unit tolerance of target pos.
  - `rule` TR-13.3: Fallback tier shows list + 2D representation; list items clickable.

## Task 14: Empty/Loading/Error State Inventory and Copy Pass
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - Audit routes with EmptyState: Assignments (0), Exams (0), Notifications (0), Marketplace (0), Lost & Found (0), Clubs none joined, People search 0 results, Notes (0), Events after filter 0, Omnisearch 0.
  - Replace any "No data found" or generic copy with CampusOS-appropriate empty copy. Use `components/os/EmptyState.tsx`.
  - app/loading.tsx (global loading + Suspense skeletons) — shimmer skeletons matching page shape.
  - app/error.tsx + global-error.tsx: what-happened / data-safe / next-action copy.
  - app/not-found.tsx: 404 with CampusOS personality + navigation suggestions.
- **Acceptance Criteria Addressed**: AC-12, FR-21, FR-22, FR-23
- **Test Requirements**:
  - `rule` TR-14.1: At least 6 routes/components use non-generic contextual empty copy (grep rules: string "No data found" → 0 matches, "Your academic runway is clear." → ≥1 match, "Nothing demanding your attention." → ≥1 match).
  - `rule` TR-14.2: error.tsx shows 3 distinct sections: what-happened, data safety, next action (with back/home buttons).
  - `rule` TR-14.3: 404 page shows suggestions + search/navigation links.

## Task 15: Reduced Motion Implementation Audit + Enforcement
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 3, Task 4, Task 7, Task 8
- **Description**:
  - Audit uses of `useReducedMotion` in components. Ensure decorative parallax, decorative cursor follower, cinematic scroll sequences, staggers check the hook.
  - WebGL tier demotion under reduced motion: `useAdaptiveQuality` → automatically lowers quality one tier + disables liquid pointer deformation (keeps static visual only).
  - Decorative cursor CursorSpotlight: when reduced motion, show static simple variant (no follow).
  - Functional transitions preserved: focus rings, dialog open/close, expand/collapse height change.
- **Acceptance Criteria Addressed**: AC-13, NFR-18
- **Test Requirements**:
  - `rule` TR-15.1: Forcing prefers-reduced-motion: reduce in DevTools → staggers disabled, decorative parallax disabled, cursor spotlight simplified; content still present.
  - `rule` TR-15.2: Dialog open/close and accordion expand still animate (functional transitions preserved).
  - `rule` TR-15.3: Grep count of `useReducedMotion()` across components ≥ 5 (indicating widespread adoption).

## Task 16: Mobile Intentional Design Pass (390px) — No Horizontal Overflow
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 5, Task 7, Task 8, Task 9, Task 10, Task 11
- **Description**:
  - Manual responsive pass on 10 key routes at 390×844: Landing, Dashboard, Events, Clubs, People, Academics, Assignments, Attendance, Campus AI, Map.
  - Check: no horizontal overflow (scrollWidth <= clientWidth); mobile dock content not hidden behind (safe area inset), tables → cards, hover-only info visible via tap, bottom spacing for dock.
  - Reduce decorative 3D complexity on mobile (auto quality tier low).
- **Acceptance Criteria Addressed**: AC-14, NFR-21, NFR-22, NFR-23
- **Test Requirements**:
  - `rule` TR-16.1: Each of the 10 key routes at 390px width passes scrollWidth ≤ clientWidth.
  - `rule` TR-16.2: Academics attendance/exam rows render as cards (not side-scrolling tables).
  - `rule` TR-16.3: Every tap target ≥ 44×44px. Bottom dock + header buttons + event cards + filter chips all meet.

## Task 17: Demo Data Centralization Audit — No Hardcoded Values
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - Grep across components for "lorem", "ipsum", "Sample", "Test Test", "Button 1", "User 123", "Card 1". Count offenders. Replace any found with data from campus-data.ts exports.
  - Move any inline arrays still in page components into lib/campus-data.ts (if reusable) or keep local but typed. Ensure transition to Supabase stays clean.
  - DemoNotice + SessionStorageNotice present on appropriate surfaces (dashboard header shows DemoNotice, forms show SessionStorageNotice).
- **Acceptance Criteria Addressed**: AC-17, NFR-28
- **Test Requirements**:
  - `rule` TR-17.1: Grep for /lorem|ipsum|Test Test|Button 1|User 123|Card 1/i → 0 matches outside node_modules.
  - `rule` TR-17.2: Dashboard card item counts match campus-data array lengths (FEED_POSTS.slice length = rendered, etc.).

## Task 18: Auth/Supabase Static Audit — No Breakage
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Read lib/supabase.ts, app/auth/login/page.tsx, app/auth/signup/page.tsx, sidebar logout handler, SessionStorageNotice.
  - Confirm no destructive changes: Supabase clients return type, signOut redirect intact, server-side session cookies intact, route protection logic unchanged.
  - No schema changes. No backend contract changes.
- **Acceptance Criteria Addressed**: AC-16, NFR-27
- **Test Requirements**:
  - `rule` TR-18.1: Code review of Supabase-related files shows no new schema modifications, no changes to signIn/signOut/signUp redirect logic beyond visual styling.
  - `rule` TR-18.2: Build includes routes for /auth/login, /auth/signup, and sidebar Log out button calls same handler as before (same type signature).

## Task 19: Anti-Slop Pass — Visual Review + Cleanup
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 1 — Task 17
- **Description**:
  - Visual pass across entire application. Remove/audit:
    - Random gradients used without purpose (keep only CampusOS emerald on semantic surfaces).
    - Excessive glass (L4/L5 only used on command palette + featured cards; not on every row).
    - Giant glows/border-glow (only on featured CTA; not on cards globally).
    - Meaningless particles (particles allowed ONLY in atmospheric cloud of Campus Core + Map scene, nowhere else).
    - Giant radial blobs → 0 instances.
    - Generic bento grids → avoid; use asymmetric editorial instead.
    - Excessive pill controls → chip/filter count ≤1 per section header.
    - Excessive rounded corners (keep 0.9rem global; large hero cards 2rem; tiny chips 0.5rem).
  - Final identity check: palette (charcoal + emerald + paper) consistent, NO purple, NO neon, NO rainbow gradients.
- **Acceptance Criteria Addressed**: AC-18, NFR-1, NFR-2, NFR-29, NFR-30, NFR-31
- **Test Requirements**:
  - `rubric` TR-19.1: Authored CampusOS identity review; scale 1-5; anchors 1=slop patterns everywhere, 3=some slop remains but mostly clean, 5=strong CampusOS personality everywhere, feels authored; threshold >= 4; evidence=full 5-page screenshot audit.
  - `rule` TR-19.2: Grep for #7c3aed|#a855f7|#d946ef|purple-500/ → 0 matches in globals.css and component styles (accented purple color absent from final product).
  - `rule` TR-19.3: Particle systems count ≤ 2 (CampusCore atmospheric + optional Map constellation). No other particle instances.

## Task 20: Build / Lint / Typecheck Final Pass
- **Status**: `pending`
- **Priority**: high
- **Depends On**: All tasks 1-19
- **Description**:
  - `npm run lint` → fix all eslint warnings/errors introduced.
  - `npm run typecheck` → fix all TypeScript strict errors.
  - `npm run build` → fix all next build errors including import ordering, server/client boundaries, unused imports.
  - After pass, re-run all three to confirm.
- **Acceptance Criteria Addressed**: AC-15, NFR-24, NFR-25, NFR-26
- **Test Requirements**:
  - `rule` TR-20.1: `npm run lint` → exit code 0, stdout ends with no warnings or errors.
  - `rule` TR-20.2: `npm run typecheck` → exit code 0, no TS errors.
  - `rule` TR-20.3: `npm run build` → exit code 0, successful Next.js build summary shown.

## Task 21: Browser QA — Desktop + Mobile, Light + Dark, Key Routes
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 20
- **Description**:
  - Using integrated browser tool:
    - Desktop (1280+) light: Landing, Dashboard, Events, Academics, Map, Campus AI, Cmd+K.
    - Desktop dark: same set.
    - Mobile 390 light: Landing, Dashboard, Events, Academics, Command.
    - Mobile 390 dark: same set.
  - Record: navigation works, cards interactive, no console errors, no horizontal overflow, Cmd+K opens, reduced motion enforced when toggled.
  - Fix any remaining issues as part of this task.
- **Acceptance Criteria Addressed**: AC-19, AC-14
- **Test Requirements**:
  - `rule` TR-21.1: Desktop light + dark routes render without console errors.
  - `rule` TR-21.2: Mobile 390 light + dark routes render without horizontal scroll.
  - `rule` TR-21.3: Keyboard-only walkthrough from landing → Cmd+K → Dashboard → Events → Logout succeeds; no keyboard trap.
