# RBU CampusOS

**A student-centric digital operating system for campus life at Ramdeobaba University.**

[🚀 Live Demo](https://rbu-campus-os.vercel.app/)

RBU CampusOS is a modern web platform designed to bring academic tools, campus information, student utilities, and community features into one unified interface.

The project is being developed as a personal student project with a focus on modern web development, AI-powered interfaces, and practical campus technology.

---

## ✨ Features

### 📊 Academic Dashboard
A centralized dashboard for viewing important academic information such as schedules, coursework, exams, and attendance.

### 🤖 Campus AI Assistant
An AI-oriented interface designed around answering campus-specific questions and helping students navigate university information.

### 🔎 Omnisearch
A command-based search and navigation system accessible through `Ctrl + K`, allowing users to quickly navigate through CampusOS.

### 💬 Anonymous Confessions
A privacy-focused interface for campus confessions featuring alias-based posting, privacy indicators, and interactive confession cards.

### 🛒 Student Marketplace & Resources
A unified interface for student listings and academic resources, designed to eventually provide a central place for students to exchange items and materials.

### 🎨 Modern UI
A responsive glass-morphic interface with dark and light themes, animated interactions, aurora backgrounds, cursor effects, and reusable UI components.

---

## 🚀 Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 — App Router |
| Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| UI | shadcn/ui, Base UI |
| Icons | Lucide React |
| Backend & Storage | Supabase |
| Deployment | Vercel |

---

## 🏗️ How It Works

RBU CampusOS follows a modular Next.js App Router architecture.

- **`app/`** contains the application's routes and page-level functionality.
- **`components/`** contains reusable UI components organized by feature and purpose.
- **`lib/`** contains shared utilities, data, helpers, and application logic.
- **Supabase** provides the backend infrastructure and storage used by the application.
- **Vercel** handles production deployment and automatically deploys changes pushed to the `main` branch.

The application is structured so that individual campus modules can be developed independently while sharing the same application shell, navigation, UI system, and backend infrastructure.

---

## 📁 Project Structure

```text
rbu-campus-os/
├── app/
│   ├── (app)/              # Main application routes (dashboard, modules)
│   └── auth/               # Authentication routes
│
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/             # Header, sidebar, app shell, navigation
│   ├── os/                 # System-level primitives and notices
│   └── ui/                 # Shared UI primitives
│
├── lib/                    # Utilities, helpers, data, and shared logic
├── public/                 # Static assets
│
├── proxy.ts                # Edge middleware (auth / routing gate)
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and project scripts
├── package-lock.json       # Locked dependency versions
└── tsconfig.json           # TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/neilsiroya/rbu-campusOS.git
cd rbu-campusOS
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:
http://localhost:3000

### Environment Configuration

Authentication and profile identity use Supabase and require the following environment variables in a local `.env.local` file:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public (anon) API key for your project |

Both values are public by design and must be tagged `NEXT_PUBLIC_` so the browser client can read them. Environment variables are intentionally not committed to the repository; the project runs as an anonymized demo without them.

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs ESLint checks |
| `npm run typecheck` | Runs the TypeScript type checker |

---

## 🗺️ Roadmap

### Completed
- Modern glass-morphic application shell
- Dashboard interface
- Dashboard urgency-card system
- Inline AI QuickAsk interface
- Campus AI interface
- Omnisearch and command navigation
- Toast notification system
- Confessions interface and composer
- Privacy-focused confession UI
- Dark and light themes
- Responsive layouts
- Supabase integration
- Production deployment on Vercel

### Planned
- Full backend integration for persistent data (Supabase).
- User profile customization and telemetry.
- Real-time notification system.
- Interactive campus map enhancements.
- Expanded attendance management
- Timetable and academic data integration
- Additional student utilities

---

## 📦 Deployment

The production application is deployed using Vercel.

The main branch is connected to the production deployment, allowing changes pushed to GitHub to trigger new deployments automatically.

Live application:
https://rbu-campus-os.vercel.app/

---

## 👨‍💻 Author

**Neil Siroya**

RBU CampusOS is an independently developed student project focused on building a modern digital experience for campus life while exploring full-stack development, AI, and modern web technologies.

## ⚖️ License

All Rights Reserved.

This repository is publicly available for viewing and reference. The source code may not be copied, modified, redistributed, or used commercially without permission from the author.
