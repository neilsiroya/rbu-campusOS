# RBU CampusOS — Current Project State

Last audited: 2026-10-08. Repository baseline: `e6db0dd`.

## Active task

`docs/tasks/01c-a-controls-notices.md`

Current objective: standardize CampusOS shared buttons, inputs, filters, notices and control states using the Task 01A token and Task 01B surface foundations. Dialog and overlay systems remain deferred to Task 01C-B.

### Task 01B completion — 2026-10-09

- Implemented `app/surfaces.css`, imported by `app/globals.css`: opt-in semantic base, section, contained, raised, inset, row and data surfaces; floating/overlay material definitions are available without migrating popovers or dialogs. Roles use Task 01A background, border, radius, depth and spacing tokens. Compact/normal/spacious density and interactive/selected/disabled styles are shared.
- Migrated only Dashboard, Notifications, Profile, Study Hub and Events. Open sections and divider rows reduce repeated boxes; raised surfaces distinguish prominent content; inset surfaces contain secondary information. Existing layouts, handlers, routes, auth, data, navigation and motion remain intact. Notifications no longer imply that the whole article is clickable.
- Legacy `components/ui/card.tsx` consumers are outside the representative set; legacy glass/card styles remain for unmigrated pages. Existing controls, notices, dialogs, small labels and page-specific styling remain staged work. Landing is unchanged.
- Source review and `git diff --check` completed; `npm run typecheck` and `npm run lint` passed. No build or broad test suite run. Implementation stayed unchanged during final browser validation.
- Browser validation completed after the user restored localhost: signed-in Dashboard, Notifications, Profile, Study Hub and Events in light/dark at 1440×900 and 390×844. Screenshot/computed-style checks confirm role hierarchy, restrained borders/depth, 0/4/8/12px radii and responsive density. No root/main or migrated-surface horizontal overflow. Verified Events hover/pressed/expanded selection, Dashboard link focus and Study Hub keyboard focus/resource selection. Disabled materials were source-reviewed; this set has no disabled surface consumer.
- Landing regression checks passed in both themes/sizes, with the previously recorded clipped one-pixel mobile internal width rounding and no root overflow. Captured browser error/warning logs were empty. Theme and viewport emulation were reset. No new regression was found in the representative set; existing issues below remain outside this task.
- Recommended Task 01C scope: shared controls, buttons, filters, notices and constrained/scrollable dialogs using the 01A tokens and 01B materials. Do not start Task 01C during this task.

### Task 01A completion — 2026-10-08

- `app/design-tokens.css` owns the light/dark semantic palette, four-pixel spacing rhythm with semantic aliases, five radius roles, border/divider/focus tokens, depth levels and documented layer values. Existing aliases remain for compatibility.
- Preserved neutral dark base/surface colors; light uses a cool near-white canvas, white surfaces and darker muted text. Brand blue remains `primary`; `accent` retains its existing quiet hover-surface meaning. Legacy glass colors now derive from neutral surfaces, while existing blur/motion composition is retained.
- `app/typography.css` consolidates the Tailwind text scale and eleven semantic roles: display, page title, section heading, UI heading, entity title, body, compact body, metadata, label, navigation and numeric values. Existing used names remain aliases. Arial/Helvetica UI and local monospace stacks replace unloaded Geist names and self-referential mappings. The generic smallest text size is 12px; arbitrary per-component small labels remain for later work.
- `app/globals.css` imports both foundations and no longer owns competing palettes or duplicated typography utilities. `app/campus-design.css` retains component/page composition; its palette overrides were removed and existing header/button values reference tokens. Focus uses an opaque 2px outline with 3px offset, retaining inset navigation treatment; keyboard focus was verified on links, buttons, text inputs and native selects in both themes.
- Verified: typecheck and lint passed; existing Tailwind/PostCSS compilation passed with zero warnings; git diff/check inspected. No TSX, dependency, data, auth, backend, animation or 3D changes. No production build or broader test suite run.
- Browser validation completed after the user restored the localhost tab: Landing, Dashboard, Notifications, Profile and Study Hub, light/dark at 1440×900 and 390×844. No root horizontal overflow; protected main regions fit. Landing has a clipped one-pixel internal width rounding difference on mobile without content extending beyond the viewport. No errors/warnings returned by captured browser log review. Theme and viewport emulation were reset.
- Final contrast adjustment: light `foreground-subtle` is `#606d80`, giving 4.60:1 against the inset surface; dark is 5.10:1. Focus/inset contrast is 5.68:1 light and 7.52:1 dark. Typecheck and lint passed again after this adjustment; HMR loaded the new token. These checks are not whole-app accessibility certification.
- Legacy debt remains: glass/surface composition, hardcoded component spacing/radius/layers, page-specific typography and motion systems. New tokens are a staged foundation, not a full consumer migration.
- Recommended Task 01B, only when separately authorized: establish shared surface/card/panel language using these tokens. Do not start it now.

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
- Task 01A consolidates foundational palettes and typography. Legacy glass/surface composition and landing-specific styles still coexist; component radius, spacing, motion and layer adoption remains staged.
- Newer row/workspace layouts coexist with older rounded card grids, uppercase micro-labels, icon/gradient decoration, and repeated dialog/form styling. Dashboard's dominant academic content also warrants review against the community-first product definition.
- Unreferenced immersive blob/core/overlay components and old dashboard components remain. View-transition names/helper exist, but no caller of `useViewTransition` was found; active route motion is a Web Animations entrance, not verified shared-element routing.
- Several hook lint rules are disabled. Passing checks do not establish visual, accessibility, or production-integration correctness.

## Task 00 verification boundary (historical)

`npm run typecheck`, `npm run lint`, and `node --test tests/auth.test.cjs` completed successfully; auth suite: 16/16. These tests use mocks, not a live Supabase account. No production build or backend audit was performed.

Browser samples: 1440×900 desktop, 1280×800 laptop, 768×1024 tablet, 390×844 mobile, and 1280×500 / 390×500 short views. Protected-page samples had no root/main horizontal overflow; Confessions dialog vertical clipping was reproduced. Matched browser/page dimensions resolved screenshot scaling during signed-in QA. No hydration error or uncaught application exception was captured in the sampled run; warnings above remain. No exhaustive device matrix, screen-reader/contrast certification, fault-injected WebGL fallback, production performance benchmark or every-control test is claimed. Cold dev compilation delays are not production timings.

## Modified files / exact next action

Task 01B changed areas: `app/surfaces.css`, `app/globals.css`, `app/(app)/dashboard/page.tsx`, `app/(app)/notifications/page.tsx`, `app/(app)/profile/page.tsx`, `app/(app)/notes/page.tsx`, `app/(app)/events/page.tsx`, `docs/STATE.md`, `docs/tasks/01b-surfaces-panels.md`. Existing untracked `.agents/`, `.codex/`, and the unusual filename reported by Git remain untouched.

Tasks 01A and 01B are complete; the Task 01B checklist is satisfied. Exact next task, only when separately authorized: Task 01C shared controls, buttons, filters, notices and dialogs using the established foundations. Stop here; functional fixes and dependency reconciliation remain separately scoped work.
