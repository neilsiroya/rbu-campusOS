# RBU CampusOS — Current Project State

Last audited: 2026-10-08. Repository baseline: `e6db0dd`.

## Active task 

`docs/tasks/01a-design-tokens.md`

Current objective: establish one authoritative CampusOS visual-token and typography foundation before redesigning shared components or individual pages.

## Current frontend architecture

- Next.js 16.3.4 App Router, React 19.2.8, TypeScript, Tailwind 4; 30 page routes: landing, two auth pages, 27 protected pages. Search is a shared command dialog.
- Root providers: next-themes, Framer Motion reduced-motion policy, custom toast context, global cursor spotlight. Protected layout adds AppShell and route scroll/focus/entrance handling.
- Supabase SSR/browser authentication and `proxy.ts` protect routes. Most product content is static sample data; mutations use a shared sessionStorage store. Campus AI is a disclosed local keyword guide, not a model integration.
- Fixed-height app shell: desktop sidebar, separately scrolling content, mobile drawer/dock, shared header/search/profile/notifications. All destination routes were reached; the short-height sidebar scrolls to its final item.

## Existing reusable systems / preserve

Retain route contracts, auth and safe-return handling, sample data and its disclosures, shared session state, notification read state, and assignment state shared with Dashboard. Preserve useful `BrandMark`, `PageIntro`, `FilterChips`, `EmptyState`, `DemoNotice`, `SessionStorageNotice`, Base UI buttons/inputs/dialog behavior, and theme support while reviewing their presentation.

The active landing has a campus SVG topology, raised sample schedule, one main entry CTA, and a destination directory. No landing WebGL canvas or blob was found. Preserve that product connection. Preserve the bounded pointer spotlight's native-cursor behavior and reduced-motion/coarse-pointer fallbacks. The map's selectable places list, dynamic canvas, demand rendering, quality limits, and error fallback are useful foundations.

## Installed creative tooling

Active: Framer Motion 13.5.1, Three 0.186.1 / R3F 9.8.1 / Drei 10.7.9 (map), Base UI 1.8.0, Lucide 1.52.0, shadcn 4.21.1 generated primitives/CSS, next-themes 0.4.6, Zustand 5.0.15, Tailwind 4.3.3 and tw-animate-css.

`npm ls` reports extraneous local creative packages including GSAP, Motion 12, Lenis, postprocessing, cmdk, Spline, shadergradient, OGL and others. Their lockfile entries also remain despite absence from root dependencies; no direct application imports were found. React Spring was not installed in the queried core/three/root packages. No attributable React Bits, Aceternity, or external Motion Primitives integration was found. See Task 00 for versions and usage distinctions. No dependency changes were made.

## Confirmed problems and relevant debt

- **Browser confirmed:** Confessions composer exceeds short viewports without internal scrolling: dialog y=-3.7 to 503.7 at 1280×500 and y=-22.7 to 522.7 at 390×500; overflow-y is visible. Normal 390×844 fits. A shared constrained/scrollable dialog policy is needed.
- **Runtime warnings:** Next.js reports smooth scrolling on html without `data-scroll-behavior="smooth"`; map emits a `THREE.Clock` deprecation warning. No crash established. Motion's warning during deliberate reduced-motion emulation is expected test feedback.
- **Source mismatch:** header ProfileMenu always uses `CURRENT_STUDENT`; `/profile` loads authenticated metadata. The header can misidentify the signed-in person.
- **Source mismatch:** saved preference flags have no consumers outside Settings. In particular, anonymous-composer availability is not controlled by its setting. Theme selection is separate and implemented.
- Competing global CSS systems: legacy green/glass/token utilities, neutral overrides, and landing-specific styles. Duplicate typography names, mixed font variables, inconsistent radii, and hardcoded motion/layer values complicate predictable reuse.
- Newer row/workspace layouts coexist with older rounded card grids, uppercase micro-labels, icon/gradient decoration, and repeated dialog/form styling. Dashboard's dominant academic content also warrants review against the community-first product definition.
- Unreferenced immersive blob/core/overlay components and old dashboard components remain. View-transition names/helper exist, but no caller of `useViewTransition` was found; active route motion is a Web Animations entrance, not verified shared-element routing.
- Several hook lint rules are disabled. Passing checks do not establish visual, accessibility, or production-integration correctness.

## Verification boundary

`npm run typecheck`, `npm run lint`, and `node --test tests/auth.test.cjs` completed successfully; auth suite: 16/16. These tests use mocks, not a live Supabase account. No production build or backend audit was performed.

Browser samples: 1440×900 desktop, 1280×800 laptop, 768×1024 tablet, 390×844 mobile, and 1280×500 / 390×500 short views. Protected-page samples had no root/main horizontal overflow; Confessions dialog vertical clipping was reproduced. Matched browser/page dimensions resolved screenshot scaling during signed-in QA. No hydration error or uncaught application exception was captured in the sampled run; warnings above remain. No exhaustive device matrix, screen-reader/contrast certification, fault-injected WebGL fallback, production performance benchmark or every-control test is claimed. Cold dev compilation delays are not production timings.

## Reconsider and recommended Task 01 scope

For Task 01, define one authoritative semantic token/style hierarchy: typography/font delivery, neutral light/dark colors, spacing, surface/depth levels, radius, borders, focus, and layers. Standardize shared controls, filters, notices, dialogs, page headers and navigation states. Include bounded dialog height/internal scrolling and readable small labels. Assign clear responsibilities to CSS, Framer Motion and map WebGL; retain reduced-motion and mobile fallbacks. Specify desktop/mobile/short-height acceptance evidence and a small representative validation set before page redesigns.

Reconsider obsolete immersive-mode architecture, overlapping style/motion systems, indiscriminate card grids, decorative effects, and unnecessary creative dependencies. Dependency reconciliation and functional defect fixes need explicitly scoped later work. Do not begin those changes during this audit.

## Modified files / next action

Only `docs/STATE.md` and `docs/tasks/00-frontend-audit.md` are updated for this audit. Pre-existing untracked `.agents/`, `.codex/`, and the unusual filename shown by Git were left untouched.

Task 00 is ready for review. The next task is the proposed Design Foundation scope above, only when separately authorized. Do not begin `01-design-foundation.md` as part of this audit. Leave functional fixes and dependency reconciliation for scoped implementation work.
