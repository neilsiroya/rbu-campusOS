# RBU CampusOS

A student-built campus companion for Ramdeobaba University, bringing academics, community, opportunities, and campus discovery into one interface.

CampusOS is an interactive product prototype. **Authentication uses Supabase; campus content uses demo data and browser-local state.** Signing in does not connect the app to university records or turn local interactions into shared data.

## Explore the app

| Area | Available today | Scope |
| --- | --- | --- |
| Dashboard & academics | Overview, timetable, attendance, assignment checklist, exam board | Sample academic data; checklist changes stay in this browser session |
| Feed & confessions | Compose posts, react, and reply | Local demo interactions; no publication, moderation service, or anonymity guarantee |
| Events & clubs | Browse an event agenda, filter, view details, and save interest | Local preferences; no registration or membership request is sent |
| Marketplace & lost-and-found | Search, filter, inspect, create listings, and save marketplace interest | Session-local records; no payments or messaging service |
| Study Hub | Browse resources, filter by branch/year/type, add descriptions, upvote, and download text summaries | Demo catalogue; downloads are generated summaries, not attached course documents; no upload service |
| Campus map & directories | Find buildings, inspect a schematic map, browse people, facilities, and services | Sample locations and directory records; no GPS navigation or live availability |
| Opportunities | Internship, hackathon, and placement discovery with save/track actions | Sample listings; no applications or deadline reminders are sent |
| Gaming & sports | Tournament discovery, saved tournaments, sample scores, and facility information | No live scores, matchmaking, or facility booking |
| Profile, notifications & settings | Supabase account metadata, demo alerts, theme controls, and local preferences | Account identity is real when authenticated; campus data and notification preferences remain a demo |
| Campus AI | Keyword-based answers and links to campus sections | Runs locally against sample data; no language-model API or live retrieval |
| Hostels | Campus living directory links | Hostel groups and room services are not connected |

The interface supports neutral light and graphite dark themes, responsive navigation, keyboard focus styles, and reduced-motion handling. The landing uses a code-drawn conceptual campus topology with layered interface planes. The map includes a searchable place list alongside its optional 3D view. Neither diagram is a surveyed map of RBU.

The cursor spotlight follows fine mouse pointers, responds over controls, and fades after inactivity. It preserves the native cursor, never intercepts clicks, stops its animation loop when settled, and is disabled for reduced motion, touch-primary devices, and forced colors.

## Run locally

Use **Node.js 20.9 or newer** and npm. The repository includes `package-lock.json`; use `npm ci` for a reproducible install.

```bash
git clone https://github.com/neilsiroya/rbu-campusOS.git
cd rbu-campusOS
npm ci
```

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-project-public-anon-key
```

These values are intentionally available to the browser. Use the project's public anon key, **never a service-role key or another secret**. `.env.local` is ignored by Git.

Configure Supabase email/password authentication and set its authentication Site URL to your app URL (`http://localhost:3000` for local development). If email confirmation is enabled, confirm the account through the email link, then return to CampusOS to sign in. Signup stores name, branch, and year as Supabase user metadata; no campus database schema is required for the current app.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). The development script explicitly uses port 3000 and binds to `0.0.0.0`; it does not automatically switch to port 3001. Stop the process using port 3000 if startup reports that the port is occupied.

The landing page and authentication pages can render without Supabase configuration. Campus routes require a valid Supabase session, and sign-in is unavailable when configuration is missing. There is no credential-free demo login.

## Data and authentication boundaries

- `lib/campus-data.ts` supplies most sample content. Some pages also define their own demo records. Dates, scores, counts, contacts, and academic figures are illustrative.
- `lib/session-store.ts` keeps supported interactions in `sessionStorage`. They survive a reload in the same tab while storage is available, but do not sync between users, devices, or independent tabs. Treat them as temporary data, not a backup or an account record.
- Session data is scoped to the browser session rather than the Supabase account. Do not enter sensitive information into demo forms. If browser storage is blocked, supported pages show a notice and changes may be lost on reload.
- Search text, open panels, and the Campus AI conversation are transient interface state. Theme selection is managed separately by `next-themes`.
- `lib/supabase.ts` creates the browser authentication client. `proxy.ts` validates users with Supabase and protects campus routes. The profile reads available account metadata; other demo student details are not a verified academic record.
- The repository contains no campus database migrations, production content API, file-storage integration, or chat backend. Supabase Auth alone does not provide those features.

## Commands and checks

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server on port 3000 |
| `npm run dev:clean` | Remove `.next` and restart development; useful after stale build-cache errors |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run build` | Create a production build |
| `npm run verify` | Run typecheck followed by the production build |
| `npm run start` | Serve an existing production build on port 3000 |
| `node --test tests/auth.test.cjs` | Run offline authentication and return-path regression tests |

Run the full current validation sequence before submitting changes:

```bash
npm run lint
node --test tests/auth.test.cjs
npm run verify
```

[CI](.github/workflows/ci.yml) runs dependency installation, lint, typecheck, offline auth regression tests, and build for pushes and pull requests targeting `main`. Its build reads the two public Supabase values from repository Actions secrets. The auth tests cover authentication boundaries without contacting Supabase. There is no automated browser test suite, and a successful build does not verify interactive flows.

For UI changes, also check the affected flow on desktop and mobile, in both themes. Check keyboard navigation, reduced motion, empty search results, reload persistence, and browser console errors. Test the map's place list when WebGL is unavailable.

## Repository guide

```text
app/
  page.tsx                    Public landing page
  layout.tsx                  Root layout and providers
  globals.css                 Theme tokens, shared surfaces, typography, motion
  auth/login/                 Email/password sign-in
  auth/signup/                Account creation
  (app)/                      Campus routes and shared app layout
components/
  layout/                     App shell, navigation, search, and account menus
  dashboard/                  Dashboard sections
  map/                        Dynamically loaded spatial campus map
  webgl/                      Canvas, quality, and rendering helpers
  motion/                     Shared motion primitives
  os/                         Page introductions, notices, filters, empty states
  ui/                         Shared UI primitives
  placeholders/               Unimplemented-section screen
lib/
  campus-data.ts              Demo types and records
  nav.ts                      Navigation and searchable destinations
  session-store.ts            Browser-session data hook
  notifications.ts            Shared demo notification read state
  supabase.ts                 Supabase browser client
  auth-redirect.ts            Validated internal authentication return paths
public/images/                Campus artwork
tests/auth.test.cjs            Offline authentication regression tests
proxy.ts                      Authentication gate and session refresh
next.config.ts                Next.js configuration and response headers
.github/workflows/ci.yml       Continuous-integration checks
```

The app uses Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI, Framer Motion, Lucide, and `next-themes`. Three.js and React Three Fiber power the campus map.

## Deployment

Configure both `NEXT_PUBLIC_SUPABASE_*` values in the deployment environment before building, and update the Supabase authentication Site URL for that deployment. Public environment values are included in the client build; changing them requires rebuilding.

On Vercel, use the repository's Next.js configuration. `next.config.ts` enables standalone output outside Vercel and leaves Vercel to handle its own file tracing. Deployment configuration and a passing CI run do not establish that a live deployment is healthy; verify sign-in, protected routes, and the primary interactions on the deployed URL.

## Ownership

Created by [Neil Siroya](https://github.com/neilsiroya) as an independent student initiative.

All rights reserved. The repository is available for reference and viewing; copying, modification, redistribution, and commercial use require the author's permission.
