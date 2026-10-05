# RBU CampusOS

<div align="center">

![RBU CampusOS](https://img.shields.io/badge/RBU-CampusOS-0ea5e9?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMi41TDIwIDcuMlYxNi44TDEyIDIxLjVMNCAxNi44VjcuMkwxMiAyLjVaIi8+PHBhdGggZD0iTTEyIDYuNVYxNy41Ii8+PHBhdGggZD0iTTEyIDYuNUwxNyA5LjVWMTQuNUwxMiAxNy41Ii8+PHBhdGggZD0iTTEyIDYuNUw3IDkuNVYxNC41TDEyIDE3LjUiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxLjgiLz48L3N2Zz4=)

**A student-centric digital operating system for Ramdeobaba University** — One campus. One interface. Everything connected.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rbu--campus--os.vercel.app-0ea5e9?style=flat-square)](https://rbu-campus-os.vercel.app/)
[![Build Status](https://img.shields.io/badge/build-passing-22c55e?style=flat-square)](https://github.com/neilsiroya/rbu-campusOS/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-0ea5e9?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## Overview

RBU CampusOS is a **student-first digital operating system** that unifies campus academics, community, discovery, services, and opportunities into a single coherent experience. Built with a modern React/Next.js stack, it emphasizes a polished, responsive, and accessible interface designed for real student workflows.

### Design Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Immersive & Spatial** | Layered glass surfaces, aurora backgrounds, depth-aware cards |
| **Calm & Technical** | Restrained motion (150–500ms), natural cubic-bezier easing, no bounce/rotation |
| **Deliberate Typography** | Geist font family, clamp-based responsive scales, negative tracking on display text |
| **Light/Dark Parity** | Sophisticated near-white canvas (not inverted dark), OKLCH color tokens |
| **Accessibility First** | Semantic HTML, focus-visible, 44px touch targets, prefers-reduced-motion |

---

## Features

### 🎓 Academic Command Center
- **Dashboard** — Personalized greeting, XP progress, campus pulse, upcoming events, marketplace/study hub previews, quick actions, academic preview, Campus AI quick ask
- **Timetable** — Week view with day filtering, demo schedule data
- **Attendance** — Percentage tracking with visual progress bars
- **Assignments** — Personal checklist with session-persistent completion state
- **Exams** — Preparation board with dates, slots, rooms, and focus topics
- **Notes/Study Hub** — Peer-shared resources (PYQs, notes, cheat sheets) with upvotes, tags, branch/year filtering
- **Campus AI** — Natural-language campus knowledge companion (rooms, events, marketplace, study materials, shuttle, timetable)

### 👥 Community & Social
- **Campus Feed** — Posts, announcements, questions, achievements with reactions (like/fire/insightful) and threaded replies
- **Confessions** — Fully anonymous board with alias system, reactions (relate/hug/wild), replies, reporting affordance
- **Events** — Discovery hub (technical, cultural, workshop, competition, club) with featured event, filters, detail panel, interest tracking
- **Clubs** — Communities with descriptions, member counts, halls, next events, join/explore actions
- **People** — Public directory (name, branch, year, interests, clubs) with search/filter
- **Lost & Found** — Listings with kind (lost/found), category, location, date, status, session-persistent creation
- **Messaging** — Inbox, conversations, search, unread indicators (foundation)

### 🔍 Discovery & Opportunities
- **Marketplace** — Peer-to-peer exchange (for sale, for rent, free, lend/borrow) with categories, conditions, pricing units, safety guidelines
- **Internships** — Discovery listings with org, type, deadline, save actions
- **Hackathons** — Sprints/competitions with dates, location, prizes, interest tracking
- **Placements** — Hiring board with company, role, stage, deadline, tracking

### 🏫 Campus Utilities
- **Map** — Schematic campus map with labeled buildings, search, filter by kind (academic/lab/facility/service/social), detail panel
- **Facilities** — Labs, library, sports, halls, classrooms, cafeterias with hours, location, notes
- **Services** — Registrar, student support, transport, maintenance, library desk, IT helpdesk with contacts and hours
- **Settings** — Theme (light/dark/system), preferences (email, sounds, visibility, anonymous composer)

---

## Tech Stack

| Category | Stack |
|----------|-------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict) |
| **UI Runtime** | React 19 |
| **Styling** | Tailwind CSS 4 + OKLCH design tokens |
| **Animation** | Framer Motion + native CSS animations |
| **UI Primitives** | Base UI (Headless) + shadcn-style components |
| **Icons** | Lucide React |
| **Themes** | next-themes (class strategy, system-aware) |
| **Auth** | Supabase (`@supabase/ssr`) |
| **Data** | Demo data (`lib/campus-data.ts`) + `sessionStorage` for ephemeral interactions |
| **Deployment** | Vercel |
| **Quality** | ESLint 9, TypeScript strict, `npm run build` |

---

## Project Structure

```text
rbu-campus-os/
├── app/                          # App Router pages & layouts
│   ├── (app)/                    # Authenticated campus routes
│   │   ├── dashboard/            # Command center
│   │   ├── feed/                 # Campus conversation
│   │   ├── confessions/          # Anonymous board
│   │   ├── events/               # Discovery hub
│   │   ├── clubs/                # Communities
│   │   ├── people/               # Directory
│   │   ├── lost-found/           # Listings
│   │   ├── marketplace/          # Peer exchange
│   │   ├── map/                  # Schematic map
│   │   ├── facilities/           # Labs, library, sports
│   │   ├── services/             # Admin, support, IT
│   │   ├── notes/                # Study hub
│   │   ├── timetable/            # Week view
│   │   ├── attendance/           # Tracking
│   │   ├── assignments/          # Checklist
│   │   ├── exams/                # Prep board
│   │   ├── internships/          # Discovery
│   │   ├── hackathons/           # Sprints
│   │   ├── placements/           # Hiring board
│   │   ├── notifications/        # Alerts
│   │   ├── settings/             # Theme + prefs
│   │   ├── profile/              # Identity
│   │   ├── campus-ai/            # Knowledge companion
│   │   └── ... (academics, gaming, hostels, sports)
│   ├── auth/                     # Login / Signup
│   └── layout.tsx                # Root layout + providers
├── components/
│   ├── layout/                   # AppShell, Header, Sidebar, CommandSearch, menus
│   ├── ui/                       # Button, Input, Card, Toast, etc.
│   ├── os/                       # BrandMark, PageIntro, FilterChips, EmptyState, DemoNotice
│   ├── dashboard/                # CampusPulse, QuickActions, XPProgress, AcademicPreview, CampusAI*
│   ├── feed/                     # PostCard, PostComposer
│   ├── confessions/              # ConfessionCard, ConfessionComposer
│   ├── profile/                  # ProfileHeader, CampusFootprint, AcademicRecord, TelemetryGrid
│   ├── map/                      # MapVisualization
│   ├── settings/                 # SettingsRail, ConfigRow
│   ├── placeholders/             # Placeholder
│   └── CursorSpotlight.tsx       # Liquid cursor (theme-aware, reduced-motion)
├── lib/
│   ├── campus-data.ts            # All demo data (types + seed)
│   ├── nav.ts                    # Navigation groups + searchable routes
│   ├── session-store.ts          # useSessionItems hook (sessionStorage)
│   ├── supabase.ts               # Browser client
│   ├── toast-context.tsx         # Toast provider
│   ├── utils.ts                  # cn, formatRelativeTime
│   └── schema.ts                 # Intended Supabase schema (docs)
├── proxy.ts                      # Next.js middleware (auth gate)
├── globals.css                   # OKLCH tokens, glass surfaces, typography, animations
├── next.config.ts
├── package.json
├── tsconfig.json
└── .github/                      # Workflows (CI)
```

---

## Getting Started

### Prerequisites
- **Node.js 20+**
- **npm** (or pnpm/yarn)

### Local Development

```bash
# Clone
git clone https://github.com/neilsiroya/rbu-campusOS.git
cd rbu-campusOS

# Install dependencies
npm ci

# Start dev server (Turbopack)
npm run dev
```

Open `http://localhost:3000` (or `3001` if port 3000 is busy).

### Environment Variables

Supabase is required for authentication. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> These are **public** keys (browser-safe) and must be prefixed with `NEXT_PUBLIC_`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build (typecheck + compile) |
| `npm run start` | Run production build |
| `npm run lint` | ESLint 9 (flat config) |
| `npm run typecheck` | `tsc --noEmit` (strict) |

---

## Design System (globals.css)

### Color Tokens (OKLCH)
- **Light**: Near-white canvas (0.985), pure white cards, teal primary (0.42), subtle glass layers
- **Dark**: Deep slate (0.095), elevated surfaces (0.13–0.16), bright teal primary (0.72)
- **Glass**: `--glass` (0.55), `--glass-strong` (0.78), `--glass-rich` (0.92) with backdrop-filter
- **Semantic**: success/danger/accent/muted/border/input/ring per theme

### Typography Scale
```css
.text-display-xl  /* clamp(3rem, 6vw, 4.5rem) */
.text-display-lg  /* clamp(2.25rem, 4.5vw, 3.5rem) */
.text-display-md  /* clamp(1.75rem, 3.5vw, 2.5rem) */
.text-display-sm  /* clamp(1.5rem, 2.5vw, 2rem) */
.text-h1 .text-h2 .text-h3 .text-h4
.text-body-lg .text-body .text-body-sm
.text-meta        /* uppercase mono */
.text-caption
```

### Surface System
- `.surface` — Card background + border
- `.surface-elevated` — Shadow + border
- `.glass` / `.glass-strong` / `.glass-rich` — Backdrop blur layers
- `.intelligence-surface` — Primary-tinted gradient card
- `.command-surface` — Strong glass for search/dialogs
- `.data-surface` — Muted data cards

### Interaction Cards
```css
.interactive-card   /* -2px lift, border enhancement, soft shadow */
.featured-card      /* -4px lift, more depth for hero cards */
```
- Hover: `translateY(-2px)`, border-primary/35%, shadow
- Active: `translateY(0)`, reduced shadow, 80ms
- Focus-visible: ring-primary/55%
- Disabled: opacity 0.5, pointer-events none

### Animation System
| Class | Duration | Easing | Use Case |
|-------|----------|--------|----------|
| `.motion-micro` | 150ms | cubic-bezier(0.16,1,0.3,1) | Micro feedback |
| `.motion-interaction` | 220ms | same | Button hover, card lift |
| `.motion-entrance` | 450ms | same | Content reveal |
| `.motion-state` | 500ms | same | Large state changes |

### Entrance Animations
- `.stagger-in > *` — Cascading fade+slide (60ms stagger)
- `.text-reveal > *` — Word/line fade-up (80ms stagger)
- `.clip-reveal > *` — Clipped headline reveal

---

## Deployment

- **Platform**: Vercel (auto-deploy from `main`)
- **CI**: GitHub Actions run `lint` → `typecheck` → `build` on push/PR
- **Live**: https://rbu-campus-os.vercel.app/

---

## Development Notes

- **No real backend yet** — All community data is demo seed (`lib/campus-data.ts`) + `sessionStorage` for ephemeral writes (posts, confessions, listings, reactions, saves, interests)
- **Supabase Auth only** — No database tables created; `lib/schema.ts` documents intended schema
- **Middleware** (`proxy.ts`) gates `(app)/` routes behind Supabase Auth
- **Accessibility**: Semantic HTML, ARIA where needed, 44px touch targets (coarse pointer), focus-visible rings, prefers-reduced-motion disables all transitions/animations/backdrop-filter
- **Responsive breakpoints**: 390px / 768px / 1024px / 1280px / 1440px

---

## Phase 20 — 20-Phase Visual Redesign Summary

The CampusOS redesign was rolled out in 20 phases. Highlights:

- **Motion language** (P1–P3, P9): a single token set (`--motion-*`) drives every
  component; `Reveal`, `Stagger`, `ViewTransition`, `Magnetic`, `Spotlight`,
  `HoverLift`, `TypingEffect`, `CountUp`, and `BlurText` are the primitives.
- **Glass system** (P4, P10): elevation scale L1–L5 (`glass-l1`…`glass-l5`), tints,
  and interaction states wired into Header, Sidebar, dock, and cards.
- **Navigation** (P6–P7, P16): sidebar + header upgrade, shared-element view
  transitions, and an `lg`-collapsed sidebar so 768–1023px gets full-width content.
- **Light/Dark parity** (P11): success/warning/error/info surfaces, focus ring,
  selection, placeholder, and disabled tokens for both themes.
- **States** (P12): unified `EmptyState`, `LoadingState`, `ErrorBoundary`.
- **Micro-interactions** (P13): ripple, elevate, border-glow, shine sweep, tilt.
- **Typography** (P14): display/h1–h6/body/meta/caption scale composed from base.
- **Accessibility** (P15): skip link, focus trap helpers, live regions, high-contrast
  paths, `.touch-target`, and reduced-motion coverage across every utility.
- **Responsive audit** (P16): runtime overflow sweep at 390/393/412/768/1024/1280/1440,
  bottom-dock targets at 44px+, fixed content-column collapse via `SharedElement` flex classes.
- **Performance** (P17): three.js/@react-three/fiber split into on-demand dynamic islands.
- **DX** (P18): `dev:clean` / `verify` scripts, file-level JSDoc on shared components.
- **Cross-browser QA** (P19): repaired invalid rim/ring CSS that produced no focus
  rings, added OKLCH → HSL fallbacks, and solid fills where `backdrop-filter` is absent.

**Conventions** (P20):

- Motion is tokenized — drive durations/eases from `--motion-*`, never inline magic numbers.
- Glass surfaces always respect `prefers-reduced-contrast` / missing `backdrop-filter`.
- Big WebGL islands (`CampusCore`, `CampusLiquidMetal`, `SpatialCampusMap`) are loaded
  via `next/dynamic(ssr:false)` with a pump-primed skeleton and an aria-labeled status.
- `SharedElement` needs explicit flex classes from its parent; never rely on an inner wrapper.
- The Supabase session cookie is `base64-{base64url(JSON.stringify(session))}` —
  see `lib/supabase.ts`; auth-gated routes run through `proxy.ts`.

---

## License

All rights reserved. This repository is publicly available for reference and viewing. The source code may not be copied, modified, redistributed, or used commercially without permission from the author.

---

<div align="center">

**Built with precision by [Neil Siroya](https://github.com/neilsiroya)**

*An independent student initiative — modern campus experience, web technologies, AI-oriented UX, full-stack product thinking.*

</div>