# RBU CampusOS

A student-first campus operating system for Ramdeobaba University, designed to bring academics, community, discovery, and daily campus workflows into a single experience.

[🚀 Live demo](https://rbu-campus-os.vercel.app/)

RBU CampusOS combines a modern campus dashboard with utility-driven modules such as timetable, assignments, attendance, events, placements, internships, facilities, and student community spaces. The product is built with a modern React/Next.js stack and emphasizes a polished, responsive interface for mobile and desktop users.

---

## ✨ Core features

- Academic dashboard with important student information at a glance
- Campus AI assistant experience for contextual campus support
- Omni-search and fast navigation across the app
- Community features such as confessions and student feed
- Opportunities board for placements, internships, hackathons, and events
- Student utilities including timetable, notes, services, and facilities
- Responsive, glassmorphism-inspired interface with theme support

---

## 🧰 Tech stack

| Category | Stack |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| UI components | shadcn/ui, Base UI |
| Icons | Lucide React |
| Backend | Supabase |
| Deployment | Vercel |

---

## 🏗️ Project structure

```text
rbu-campus-os/
├── app/                  # App Router pages and layouts
│   ├── (app)/            # Main campus app routes
│   └── auth/             # Login and signup routes
├── components/           # Reusable UI and feature components
├── lib/                  # Shared utilities, config, and data
├── public/               # Static files/assets
├── proxy.ts              # Middleware/proxy logic
├── next.config.ts        # Next.js configuration
├── package.json          # Scripts and dependencies
├── package-lock.json     # Locked dependency list
├── tsconfig.json         # TypeScript config
├── .github/              # GitHub workflows and templates
├── README.md             # Project overview and setup guide
└── .gitignore            # Git ignore rules
```

---

## 🛠️ Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run locally

```bash
git clone https://github.com/neilsiroya/rbu-campusOS.git
cd rbu-campusOS
npm ci
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Environment variables

Supabase is required for authentication and authenticated campus routes. Add the following values to a local `.env.local` file to test those flows:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key used by the frontend |

These values are intentionally public and must be prefixed with `NEXT_PUBLIC_` so the browser can access them.

---

## 📜 Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Run the TypeScript checker |

---

## 🚦 Current status

The project is in active frontend development with a demo-first campus experience. Most pages are implemented as polished interfaces and route-level views, while backend persistence and live data integration continue to evolve.

---

## 📦 Deployment

The application is deployed to Vercel using the repository's main branch. GitHub Actions also run lint, type checking, and production build validation on pushes and pull requests.

Live app:
https://rbu-campus-os.vercel.app/

---

## 👨‍💻 Author

**Neil Siroya**

This project is an independently developed student initiative focused on building a modern campus experience using web technologies, AI-oriented UX, and full-stack product thinking.

## ⚖️ License

All rights reserved.

This repository is publicly available for reference and viewing. The source code may not be copied, modified, redistributed, or used commercially without permission from the author.
