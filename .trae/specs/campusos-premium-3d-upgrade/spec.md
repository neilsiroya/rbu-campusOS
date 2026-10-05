# RBU CampusOS — Premium 3D Immersive Upgrade
## Product Requirements Document

## Overview
- **Summary**: Transform the existing RBU CampusOS Next.js application into an extraordinary, production-quality, immersive 3D university operating system. Preserve the soul, identity, routes, and backend contracts; upgrade the visual language, spatial depth, material system, motion coherence, and interaction craft across the entire product.
- **Purpose**: Deliver a memorable, premium CampusOS experience that feels like Apple-level product polish combined with editorial design, spatial computing atmosphere, and a coherent native liquid-material identity. The product must remain highly usable for 30+ minute sessions without visual fatigue.
- **Target Users**: RBU students, faculty, and campus visitors interacting with the CampusOS web application on desktop, laptop, tablet, and mobile devices.

## Goals
- Deliver a signature **Campus Core** identity object featuring a native liquid-metal material system with hover/press/focus states and subtle data responsiveness.
- Upgrade the application shell and 28 existing routes with a consistent spatial hierarchy, editorial card variety, and coherent motion language (not a wall of identical cards).
- Establish a 5-layer spatial system: DOM content → depth/shadows/3D-transforms → interactive spotlight/glare → WebGL/R3F identity + map → cinematic scroll.
- Produce a cinematic landing hero that communicates "This is the operating system of my university" on first impression.
- Strengthen the command center (Cmd+K), navigation active surfaces, dashboard information hierarchy, events, campus AI, and people/clubs/opportunities surfaces.
- Provide progressive WebGL enhancement with adaptive quality tiers, visibility pausing, disposal correctness, reduced-motion support, and high-quality 2D fallbacks.
- Pass `npm run lint`, `npm run typecheck`, and `npm run build` cleanly. No Supabase/auth breakage.

## Non-Goals
- Do not replace or hollow out the existing Supabase backend, authentication system, database schema, or server actions.
- Do not remove demo data, existing routes, or populated pages.
- Do not introduce GSAP, Lenis, Embla, postprocessing, Matter.js, React Bits, or Aceternity as *new* install dependencies. Only use what is already in package.json unless a dependency is genuinely unavailable. (Current package.json already includes Three, R3F, Drei, Framer Motion, Zustand, next-themes, shadcn/Base UI, Lucide.)
- Do not build a disconnected marketing site or 3D portfolio demo. Every enhancement must live inside the existing CampusOS shell.
- Do not add purple/black AI aesthetics, neon cyberpunk, terminal themes, generic stock photography, testimonials, pricing tiers, or rainbow gradients.
- Do not turn every list and every page into full WebGL. Dense academic information stays DOM-first.

## Background & Context
The existing codebase already contains a strong foundation:
- globals.css with oklch CampusOS emerald/teal identity, design tokens, motion tokens, glass surfaces, 5 glass elevation levels (L1–L5), and comprehensive typography scale (display/heading/body/meta).
- Zustand `useOSStore` with mode switching (normal | focus | immersive), `QualityTier`, and `triggerSpatialReset`.
- `CampusCore` (procedural icosahedron with noise topology, 3 orthogonal orbital rings with spatial data nodes, seeded atmospheric particle cloud, theme-aware lights, HUD with 4 telemetry chips, expand/collapse, reset orientation).
- `ImmersiveCanvas` (with fallback DOM renderer), `SceneErrorBoundary`, `useAdaptiveQuality`, `useVisibilityPause` hooks already scaffolded.
- `AppShell`: Sidebar with Framer Motion `layoutId` animated active pill, Header, bottom mobile dock, immersive overlay.
- `CommandSearch` (Cmd+K): 8 search categories, commands for immersive/focus/normal modes + spatial reset, keyboard arrow nav + Enter execute.
- Dashboard: Standard hero + Focus Mode variant, spatial core banner, CampusPulse feed, ConfessionPreview, QuickActions, AcademicPreview, CampusAIPreview, CampusAIQuickAsk.
- 28 nested routes in app/(app) covering academics, assignments, attendance, events, clubs, people, map, marketplace, lost-found, notes, gaming, sports, hostels, services, facilities, hackathons, internships, placements, feed, confessions, notifications, profile, settings, campus-ai, timetable, exams.
- lib/campus-data.ts with typed demo data for CURRENT_STUDENT, FEED_POSTS, CONFESSIONS, EVENTS, TIMETABLE, ASSIGNMENTS, ATTENDANCE, CLUBS, PEOPLE, MARKETPLACE_LISTINGS, STUDY_RESOURCES, FACILITIES, etc.
- CursorSpotlight, CampusBackground, ViewTransitionProvider already integrated in root layout.

The specification document ("You are an AI operating inside opencode... 107 sections") defines the product philosophy, visual language, interaction tiers, performance requirements, and anti-AI-slop rules that must guide every change.

## Functional Requirements

### Identity & Material
- **FR-1 CampusLiquidMetal**: Create a reusable native liquid-metal component. Not a generic sphere. The surface must feel polished, reflective, dimensional, fluid, technological, and restrained. Subtle chromatic dispersion driven by material (not psychedelic).
- **FR-2 Liquid Interaction States**: Support hover (eased pointer), press (localized deformation + ripple + energy), focus (accessible visual state), touch, and keyboard. Never map raw mouse to extreme movement.
- **FR-3 Liquid Placement**: Primary use = Campus Core; secondary = Campus AI launch surface; potential = Immersive Mode overlay. NEVER placed on every card, every button, or every nav item.
- **FR-4 Campus Core Data Response**: Derive visual intensity (topology noise, ring speed, emissive) from academic state derived through campus-data metrics (attendance ratio, assignment load, event count). Response must be abstract, elegant, and non-literal.

### Application Shell & Navigation
- **FR-5 Spatial Navigation Continuity**: Navigation active surfaces should feel physically/spatially continuous. Animated background or layoutId-based indicator that travels between selections without jarring jumps.
- **FR-6 Mobile Navigation Dedicated Design**: Bottom nav is not a simple desktop shrink. Gesture-friendly 44px targets, safe-area handling, clear active state.
- **FR-7 Breadcrumb/Contextual Secondary Nav**: For deep routes (academics → course, events → detail) expose a contextual secondary nav where useful.

### Dashboard & Information Hierarchy
- **FR-8 Dashboard Information Tiers**: Information ordered as: (1) WHAT MATTERS NOW → (2) WHAT IS NEXT → (3) WHAT CAN I DO → (4) WHAT IS HAPPENING AROUND CAMPUS. Not a wall of identical cards.
- **FR-9 Card Role Variety**: Support at least 5 card roles visually differentiated — minimal info, editorial, interactive (lift + spotlight), featured (spotlight + glare), spatial/3D. Not 12 identical rounded cards.
- **FR-10 Focus Mode**: Hyper-focused quiet view with priority next session, assignment queue, attendance margin. Exists already; ensure spatial continuity with dashboard entry/exit.

### Command Center
- **FR-11 Cmd+K Robustness**: Group sections (Commands, Pages, Academic, Events, People, Clubs, Marketplace, Study Hub, Facilities). Add recent actions + contextual actions. Support empty state (intelligent copy), loading skeleton, route navigation, and command feedback.
- **FR-12 Accessible Command**: Properly labeled combobox, arrow nav, Enter execute, Esc dismiss, visible focus, and no "developer terminal" aesthetic.

### Landing / First Impression
- **FR-13 Cinematic Hero**: Spatial introduction. Not "Welcome to CampusOS" generic SaaS hero. Enormous CampusOS typography, dynamic date/time, live academic information fragments (timetable, attendance, upcoming deadline), Campus Core, integrated navigation.
- **FR-14 Scroll Continuity**: Selected editorial sections below hero with campus conversation → spatial map → week/events → campus-aware intelligence. Closing operating-system call-to-action card.

### Key Route Upgrades
- **FR-15 Events**: Featured event strong treatment, standard quieter, Disclosure/inline expansion (no giant modal for information that should expand in-place). AnimatedGroup entrance + contextual spotlight on featured.
- **FR-16 Clubs**: Identity-rich presentation, image hierarchy, membership state, upcoming activity. Expandable details in-place.
- **FR-17 People**: Directory feel, subtle hover/reveal, profile navigation, search/filter that works.
- **FR-18 Academics + Attendance + Assignments + Exams**: Strong data/metric surfaces, premium tables (sort, hover, row expand, mobile card transformation), clear deadline status.
- **FR-19 Campus AI**: First-class OS capability. Idle / thinking / searching / retrieving / composing / completed / error states. Calm, fast, useful, structured result surfaces.
- **FR-20 Map / Campus**: Spatial campus representation, usable camera (clamp + reset + touch), clear labels + list alternative, sensible fallback 2D representation.

### Loading / Empty / Error States
- **FR-21 Initial Loading**: Brief, CampusOS identity mark + subtle progress. Never block navigation on WebGL.
- **FR-22 Intelligent Empty States**: "No assignments yet.", "Your academic runway is clear.", etc. Not "No data found."
- **FR-23 Explanatory Errors**: What happened, user data safety, what to do next. No raw stack traces to users.

## Non-Functional Requirements

### Visual Identity & Design Intelligence
- **NFR-1 Editorial + Restrained**: Strong hierarchy, whitespace, large typography, controlled asymmetry, deep charcoal (dark), warm off-white paper (light), one strong CampusOS emerald accent.
- **NFR-2 NOT Generic**: Reject purple/black AI, pastels, rainbow gradients, neon, cyberpunk, terminal UI, excessive cards, generic bento grids, giant radial blobs, excessive pill controls.
- **NFR-3 Visual Fatigue Free**: 30-minute sessions. Calm routine work contrasted with spectacular signature moments.

### Typography
- **NFR-4 Typographic Hierarchy**: Clear separation between navigation labels, page titles, section headings, metadata, labels, large numerals, data, AI responses, cards, utility controls. Preserve existing Geist/type tokens.
- **NFR-5 Number Importance**: Large numerals, CGPA, percentages, credits feel important.

### Motion System
- **NFR-6 Motion Preset Consistency**: Micro / Hover / Interaction / Standard / Emphasis / Page / Cinematic timing and easing unified across the application. Use existing --motion-* tokens in globals.css.
- **NFR-7 Motion Not Everything**: Fast, smooth, physical, subtle, predictable animations. Springs where physicality improves UX. No huge entrance animations or slow fades everywhere.

### 3D & WebGL
- **NFR-8 5-Layer Depth**: DOM → shadows/parallax/transforms → spotlight/glare → WebGL (Campus Core + map) → cinematic (selected sections only).
- **NFR-9 Quality Tiers**: high (desktop) / medium (laptop/tablet) / low (mobile) / fallback (no WebGL). Adaptive DPR, resolution scaling, mobile simplification.
- **NFR-10 Visibility Pause & Cleanup**: Pause rendering when document.hidden, when section is offscreen, when Immersive Mode is disabled. Correct disposal of geometries, materials, textures, render targets, listeners.
- **NFR-11 WebGL Fallback**: If WebGL unavailable, high-quality 2D/CSS fallback shows equivalent information. No broken canvas or empty black box.
- **NFR-12 Postprocessing Restraint**: Subtle bloom only. No over-bloom, no extreme chromatic aberration, no effect that destroys readability. Never backdrop-filter over a continuously-repainting WebGL canvas.
- **NFR-13 Deliberate Lighting + Materials**: Key + fill + rim + subtle ambient. No default Three.js demo lighting. Liquid material roughness/metalness/emissive deliberate and physically coherent.

### Performance
- **NFR-14 Frame Rate Smoothness**: On a mid-tier laptop, application pages feel smooth. No constant global animation loops; no invisible expensive scenes.
- **NFR-15 No Memory Leaks**: WebGL resources disposed; observers/listeners cleaned up.
- **NFR-16 Lazy Mounting**: 3D scenes loaded asynchronously; shell usable first, 3D transitions in.

### Accessibility
- **NFR-17 Keyboard Everything**: Semantic HTML, visible focus, ARIA where appropriate, no interaction requiring pointer.
- **NFR-18 Reduced Motion Honest**: prefers-reduced-motion → remove unnecessary transforms, reduce stagger, simplify WebGL, disable cinematic scroll, remove decorative cursor, preserve *all* information + functional transitions.
- **NFR-19 3D Alternatives**: Essential 3D data readable outside canvas. Map/list alternative for spatial views.
- **NFR-20 Touch + Safe Area**: 44px min targets, mobile no-hover dependency, safe-area insets.

### Responsive
- **NFR-21 Intentional Breakpoints**: 390, 393, 412, 768, 1024, 1280, 1440. Desktop is not scaled-up mobile; mobile is not squeezed desktop.
- **NFR-22 Mobile Transformation**: Tables → cards; complex nav → bottom dock; 3D → simplified; physics → none; decorative → removed.
- **NFR-23 No Horizontal Overflow**: Mobile pages never scroll horizontally accidentally.

### Build & Quality
- **NFR-24 TypeScript Strict**: `npm run typecheck` exits 0.
- **NFR-25 Lint Clean**: `npm run lint` exits 0.
- **NFR-26 Build Success**: `npm run build` exits 0.
- **NFR-27 No Auth Breakage**: Login/Signup flows, Supabase signOut, route protection intact.
- **NFR-28 Demo Data Preserved**: Campus data still used. Nothing hollowed out.

### Anti-Slop
- **NFR-29 Anti-AI-Slop Pass**: Post-implementation pass removing: random gradients, excessive glass, giant glow, meaningless particles, giant blobs, unnecessary bento, repeated generic cards, excessive roundness, excessive animated text, multiple cursor systems, unnecessary 3D, meaningless parallax, fake functionality, decorative icons everywhere, repeated animations, purple/neon stereotypes.
- **NFR-30 Anti-3D-Slop**: No random rotating spheres, floating abstract blobs, generic planets, generic AI particles everywhere, massive glass orbs, rotating text. Every 3D object has a conceptual purpose tied to CampusOS.
- **NFR-31 Authored Feel**: Site looks authored, not composed from component templates.

## Constraints
- **Technical**: Next.js 16 + React 19 + App Router RSC, shadcn/Base UI (base-nova style), Tailwind v4, existing globals.css tokens, Framer Motion 13, Zustand 5, Three 0.186, React Three Fiber 9, Drei 10, next-themes, Supabase SSR. Do not add new dependencies unless demonstrably absent and required.
- **Business**: Existing routes preserved. Existing Supabase/auth preserved. Demo data preserved. Existing pages not emptied.
- **Dependencies**: New installs only when genuinely necessary and unavailable in current package.json. Zero bloat.
- **Identity**: CampusOS emerald/teal/charcoal/paper palette. Reject purple/black AI, neon, cyberpunk, terminal themes.

## Assumptions
- User runs `npm run dev` / `npm run build` from the project root.
- Supabase environment variables are configured externally; no schema changes are required for UI upgrade.
- Mobile testing done via viewport widths; no physical device lab available.
- Browser QA available through integrated browser tools.

## Acceptance Criteria

### AC-1: Liquid Metal Component Built-in
- **Type**: `rule`
- **Given**: The existing `components/immersive/` directory and CampusOS emerald palette
- **When**: A `CampusLiquidMetal` (or equivalent native component) is implemented and consumed by the Campus Core
- **Then**: The signature object uses Three/R3F, shows fluid/reflective/metal qualities, subtle chromatic dispersion, and supports hover + press + focus + touch + eased pointer interaction
- **Pass Condition**: Component renders on dashboard + landing in both light and dark modes without error; pointer interaction deforms subtly (not wildly); press produces ripple/deformation; focus ring visible and keyboard-accessible
- **Evidence**: File at `components/immersive/CampusLiquidMetal.tsx` (or equal); DevTools no WebGL errors; screenshot of core in both modes

### AC-2: Campus Core Data Responsive
- **Type**: `rule`
- **Given**: Existing `useOSStore.activeCoreDataMetric` + campus-data attendance/assignments/events
- **When**: Campus Core renders with real demo metrics
- **Then**: Topology noise intensity, orbital speed, or emissive subtly shift proportional to attendance ratio + assignment load (derived, abstract, non-literal)
- **Pass Condition**: Changing `activeCoreDataMetric` in OS store visibly shifts the Campus Core character; lower attendance = calmer core, higher assignments = more activity
- **Evidence**: Code links in CampusCore showing `visualIntensity` derived from `attendancePercent + activeAssignments`; manual toggle verification

### AC-3: WebGL Progressive Enhancement with Quality Tiers
- **Type**: `rule`
- **Given**: `useAdaptiveQuality.ts` + `useVisibilityPause.ts` already scaffolded
- **When**: Application is opened on mobile/low-power, on tab switch, or in non-immersive mode
- **Then**: DPR scales down, scene pauses on document.hidden, scene pauses when offscreen; ImmersiveCanvas fallback renders DOM alternative when canvas fails
- **Pass Condition**: Tab away → render loop paused; fallback visible when WebGL disabled; no memory leaks from repeated mount/unmount
- **Evidence**: `useAdaptiveQuality` returns tier "low" when `matchMedia('(max-width: 767px)')`; `useVisibilityPause` pauses when `document.hidden`; disposal function calls observed in component cleanup

### AC-4: Navigation Active State Spatial Continuity
- **Type**: `rubric`
- **Dimension**: Navigation craft — how the active indicator moves between sidebar items and between mobile dock items
- **Scale**: 1-5
- **Anchors**: 1 = No animated indicator, abrupt jump; 3 = Basic slide or fade, some delay; 5 = Spring/layoutId indicator smoothly travels, background animates, active dot + label weight changes, no flicker when routing, focus visible.
- **Pass Threshold**: >= 4
- **Evidence**: Sidebar video/inspection; mobile dock active state inspection; Cmd+K route navigation feels continuous

### AC-5: Dashboard Non-Generic Information Hierarchy
- **Type**: `rubric`
- **Dimension**: Dashboard hierarchy and card role variety
- **Scale**: 1-5
- **Anchors**: 1 = Wall of identical rounded cards, no priority order; 3 = Some differentiation, 2 sizes, some icons; 5 = 4 distinct tiers of information (Now → Next → Do → Around), 5+ card visual roles, large numerals feel important, no repeated identical cards, Focus Mode entry/exit is spatially continuous
- **Pass Threshold**: >= 4
- **Evidence**: Visual audit across light + dark; dashboard screenshot; card type inventory (count of distinct card surface styles)

### AC-6: Command Center Groups + Recent + Empty State
- **Type**: `rule`
- **Given**: Existing CommandSearch with 8 categories
- **When**: Cmd+K opened with empty query, then typed query, then with no results
- **Then**: Commands section first; grouped section labels visible; when empty query, show recent commands (or popular default); when no matches, show intelligent empty copy not "No results"
- **Pass Condition**: No-query view has Commands + Recent/Popular grouped; no-match state shows suggestions (e.g., "Try 'immersive', 'focus', 'lab-4'"); keyboard arrows navigate; Enter executes
- **Evidence**: Screenshots of empty, populated, and no-match states; Cmd+K keyboard nav confirmed

### AC-7: Landing Cinematic Hero
- **Type**: `rubric`
- **Dimension**: Landing first-impression quality and product-identity communication
- **Scale**: 1-5
- **Anchors**: 1 = Generic "Welcome to CampusOS" SaaS hero with gradient blob; 3 = Nice type + CTA but generic; 5 = Architectural display typography with ONE CAMPUS / ONE IDENTITY / EVERY EXPERIENCE, live date/time, real academic fragments (CGPA, attendance, upcoming class, next deadline), Campus Core integrated as a system-status object, immediate clarity that this is a university OS
- **Pass Threshold**: >= 4
- **Evidence**: Landing screenshot desktop light, desktop dark, mobile; first impression checklist

### AC-8: Events Route with Disclosure + Featured Treatment
- **Type**: `rule`
- **Given**: EVENTS demo data and app/(app)/events/page.tsx
- **When**: User visits /events, views featured card, and expands a normal event
- **Then**: One featured event with stronger visual treatment (spotlight + glare + deeper lift); normal events quieter; expansion happens inline using Disclosure/accordion pattern (not a giant modal)
- **Pass Condition**: Featured card visually distinct; expand in-place shows date/location/registration/club info; collapsed state still readable; no horizontal overflow mobile
- **Evidence**: Events page screenshot (featured + 2 normal expanded); mobile 390px snapshot

### AC-9: Clubs, People, Academics Pages Structured and Interactive
- **Type**: `rule`
- **Given**: 3 existing routes with demo data
- **When**: User visits each
- **Then**: Clubs show identity + membership pill + upcoming activity; People has search/filter that filters real demo data; Academics has strong metric surfaces (CGPA, attendance bars, assignment countdown, upcoming exams), premium tables with sort/hover and mobile transformation
- **Pass Condition**: No empty/hollow pages; all cards use typed demo data; people search filters by name/branch; academics tables have sortable headers and become cards at 390px
- **Evidence**: 3 screenshots; search filter action on People; table to card transformation on Academics mobile

### AC-10: Campus AI States + Structured Results
- **Type**: `rule`
- **Given**: app/(app)/campus-ai/page.tsx and CampusAIPreview
- **When**: User opens AI and triggers a "thinking" state then a completed response
- **Then**: Idle, thinking (subtle non-terminal), retrieving, composing, completed, error states visible; answers are calm, structured; no typing-effect on every paragraph; error states explain what to do
- **Pass Condition**: 6 distinct AI states render with appropriate motion; error state copy includes what-happened / data-safe / next-action
- **Evidence**: AI state machine code + screenshots of thinking + completed + error

### AC-11: Map Spatial with Camera Controls + List Alternative
- **Type**: `rule`
- **Given**: SpatialCampusMap existing component and app/(app)/map/page.tsx
- **When**: User opens /map, drags camera, uses reset button, toggles list alternative
- **Then**: Camera clamped (no disorienting spins); touch support; reset returns to default; list alternative lists facilities/buildings with links; 2D fallback shown when WebGL disabled
- **Pass Condition**: OrbitControls with min/max distance + polar angle clamp; reset button centers; list panel visible or toggleable; no broken canvas
- **Evidence**: Camera bounds in code; reset button action; list screenshot

### AC-12: Loading, Empty, Error State Copy Quality
- **Type**: `rule`
- **Given**: Routes that may be empty (no notifications, no saved resources)
- **When**: A section has no items or an error occurs
- **Then**: Intelligent, situationally appropriate copy: "Your academic runway is clear.", "No events on your calendar.", "Nothing demanding your attention." Error states: what happened / data safe / next step
- **Pass Condition**: At least 6 distinct empty states across the application use contextual CampusOS-appropriate copy; error.tsx / global-error.tsx explain without stack traces
- **Evidence**: Empty state screenshot inventory (assignments-empty, notifications-empty, events-empty, etc.) + 404 + error

### AC-13: Reduced Motion Respected
- **Type**: `rule`
- **Given**: prefers-reduced-motion: reduce media query
- **When**: User enables reduced motion in OS
- **Then**: Unnecessary transforms removed, stagger gone, WebGL simplified (lower quality tier + no decorative cursor particle follower + no parallax), functional transitions preserved, all content still readable
- **Pass Condition**: globals.css reduced-motion block + per-component checks with `useReducedMotion()` everywhere there was decorative motion; screenshot comparison shows calm still product
- **Evidence**: Code search for useReducedMotion; DevTools media forced reduced-motion walkthrough

### AC-14: Mobile Intentional (390px) — No Horizontal Overflow
- **Type**: `rule`
- **Given**: All main routes at 390px width
- **When**: Resized to 390×844
- **Then**: No horizontal scrollbar; bottom dock visible with 44px touch targets; tables transform to cards; 3D scenes simplified; no hover-only interactions break UX
- **Pass Condition**: `window.innerWidth=390` on dashboard/events/academics has `document.documentElement.scrollWidth === clientWidth`; all buttons ≥44px
- **Evidence**: Visual snapshot of 5 key routes at 390px; overflow check on each

### AC-15: Lint, Typecheck, Build Pass
- **Type**: `rule`
- **Given**: The modified repository
- **When**: `npm run lint`, `npm run typecheck`, `npm run build` run
- **Then**: All commands exit with code 0
- **Pass Condition**: No eslint errors; tsc --noEmit clean; next build completes successfully
- **Evidence**: Full terminal output of all three commands

### AC-16: Auth/Supabase Unbroken
- **Type**: `rule`
- **Given**: app/auth/login, app/auth/signup, sidebar logout button, Supabase RLS
- **When**: User signs in and signs out
- **Then**: Login redirects to dashboard; sidebar logout calls Supabase signOut and redirects; no TypeScript errors in supabase.ts or login/signup pages
- **Pass Condition**: Auth flows code paths unchanged and functional; route gates still present
- **Evidence**: Static code review of auth files showing no breaking changes

### AC-17: Demo Data Fully Preserved, Typed, Centralized
- **Type**: `rule`
- **Given**: lib/campus-data.ts typed demo data
- **When**: Routes consume data
- **Then**: All routes use typed campus-data exports. No UI components hardcode demo string values. Transition path Demo → Supabase clear.
- **Pass Condition**: Grep for `title: "Test"` / lorem / "Sample" yields zero. Dashboard card count matches data length.
- **Evidence**: Grep output; dashboard code showing imports from campus-data.ts

### AC-18: Anti-Slop Pass — Authored CampusOS Identity
- **Type**: `rubric`
- **Dimension**: Overall authored feel and absence of AI-slop patterns
- **Scale**: 1-5
- **Anchors**: 1 = Purple/neon/glass-orbs everywhere, stock photos, generic pill buttons, decorative icons on every heading; 3 = Some generic effects but mostly functional; 5 = Deep charcoal + paper light, restrained emerald accent only, 3D used for meaningful identity/map only, editorial structure, precise metadata, thin dividers, no giant radial blobs, no rainbow gradients, decorative elements sparse and purpose-driven, visual contrast between calm work and spectacular signature moments
- **Pass Threshold**: >= 4
- **Evidence**: Full visual audit (5 screenshots: landing, dashboard, events, academics, map); pattern inventory of rejected slop patterns confirmed absent

### AC-19: Accessibility — Keyboard + Focus + Contrast
- **Type**: `rule`
- **Given**: App shell, dashboard, command center
- **When**: Navigated via keyboard only (Tab / Shift+Tab / Enter / Esc / Arrow keys)
- **Then**: Every interactive control is reachable; visible focus ring on each; Cmd+K opens and is operable with keyboard; sidebar items tabbable; 3D components expose DOM HUD with equivalent data
- **Pass Condition**: Keyboard walkthrough completes full user journey from landing → login → dashboard → Cmd+K → events → logout; no keyboard trap; focus visible always
- **Evidence**: Manual keyboard walkthrough checklist; focus style in :focus-visible

### AC-20: Correct Disposal — No WebGL Memory Leaks
- **Type**: `rule`
- **Given**: ImmersiveCanvas + CampusCore + Map scenes
- **When**: Component mounted, unmounted, remounted 10 times
- **Then**: No orphan geometries/materials/textures/render targets; listeners cleaned up; observers disconnected; RAF cancelled
- **Pass Condition**: Code inspection of component cleanup functions shows dispose() calls on all GPU resources and removeEventListener / disconnect on observers; no PROJ errors in console after 10 mount cycles
- **Evidence**: Cleanup code blocks + console.log screenshot after stress test

## Open Questions
- [ ] Are there specific route pages (gaming/sports/hostels) that should be lower priority than academics/events/people/clubs? Prioritize assumed unless feedback.
- [ ] Should the "Campus AI" actually integrate with an LLM, or remain a first-class OS UI shell with canned/structured demo responses? Default: keep demo-response shell consistent with existing demo-data approach. Backend LLM is out of scope unless explicitly approved.
- [ ] Hero landing: confirm the ONE CAMPUS / ONE IDENTITY / EVERY EXPERIENCE tagline should remain as-is. Default: preserve exactly.
