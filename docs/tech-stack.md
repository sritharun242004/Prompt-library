# PromptVault — Tech Stack

**Version:** 1.0  
**Last updated:** 2026-04-29  
**Stack type:** Full-stack TypeScript monorepo  

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Monorepo Setup](#monorepo-setup)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Database](#database)
6. [Search Architecture](#search-architecture)
7. [Static Data Pipeline](#static-data-pipeline)
8. [Auth & Security](#auth--security)
9. [Development Environment](#development-environment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PromptVault                          │
│                  (npm workspaces)                       │
│                                                         │
│   ┌──────────────────┐     ┌──────────────────────┐    │
│   │    frontend/     │     │      backend/        │    │
│   │                  │────▶│                      │    │
│   │  React + Vite    │     │   Hono + Drizzle     │    │
│   │  Tailwind CSS    │     │   PostgreSQL         │    │
│   │  :5173           │     │   :3000              │    │
│   └──────────────────┘     └──────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

The project is structured as a monorepo with two workspaces:

| Workspace | Path | Role |
|-----------|------|------|
| Frontend | `frontend/` | React SPA — UI, routing, static prompt data |
| Backend | `backend/` | REST API — auth, prompt CRUD, search, import scripts |

---

## Monorepo Setup

| Tool | Version | Purpose |
|------|---------|---------|
| **npm Workspaces** | npm 10+ | Links `frontend/` and `backend/` under a single root |
| **concurrently** | ^9.1.2 | Single command to run both dev servers simultaneously |

**Root `package.json` scripts:**
```json
"dev":   "concurrently \"npm run dev -w frontend\" \"npm run dev -w backend\"",
"build": "npm run build -w frontend"
```

---

## Frontend

### Core

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18 | UI component framework |
| **Vite** | 6 | Dev server, HMR, production bundler |
| **TypeScript** | 5.9 | Static type checking across all source files |

> React and React-DOM are installed as explicit dependencies (not just peer deps) due to the Figma Make template convention.

### Routing

The app uses a **custom `useState`-based router** in `App.tsx` rather than React Router, despite React Router 7 being installed. Routes are plain strings (`"home"`, `"library"`, `"detail:42"`, `"library:image"`).

### Styling

| Tool | Version | Purpose |
|------|---------|---------|
| **Tailwind CSS** | 4 | Utility-first CSS via `@tailwindcss/vite` plugin |
| **clsx** | 2.1 | Conditional class name composition |
| **tailwind-merge** | 3.2 | Merge conflicting Tailwind classes safely |
| **tw-animate-css** | 1.3 | Additional CSS animation utilities |

### UI Component Libraries

| Tool | Purpose |
|------|---------|
| **Radix UI** (20+ primitives) | Unstyled, accessible headless components — accordion, dialog, dropdown, tabs, tooltip, select, checkbox, popover, and more |
| **Lucide React** | Icon set — 487+ consistent SVG icons |
| **Motion** (`motion/react`) | Declarative animations — hover lifts, spring physics, page transitions |
| **Sonner** | Toast notification system |
| **class-variance-authority (CVA)** | Variant-based component styling (Shadcn/ui pattern) |

### Forms & Validation

| Tool | Version | Purpose |
|------|---------|---------|
| **React Hook Form** | 7.55 | Performant uncontrolled form state management |
| **Zod** | 3.24 | Schema-based runtime validation (shared with backend) |

### Data Visualisation & Rich UI

| Tool | Purpose |
|------|---------|
| **Recharts** | SVG charts for the dashboard page |
| **Embla Carousel** | Touch-friendly carousel component |
| **react-dnd + html5-backend** | Drag-and-drop interactions |
| **react-responsive-masonry** | Masonry grid layout |
| **react-resizable-panels** | Resizable panel layouts |
| **date-fns** | Lightweight date formatting utilities |
| **canvas-confetti** | Confetti burst effects |
| **vaul** | Drawer/bottom-sheet component |
| **cmdk** | Command palette (Cmd+K) |
| **input-otp** | OTP input field component |

### API Client Layer

Located at `frontend/src/app/lib/api.ts`. All HTTP calls go through a single `apiFetch<T>()` function that:
- Injects the JWT `Bearer` token from `localStorage`
- Parses error responses uniformly
- Is typed end-to-end with TypeScript generics

**Exported API modules:**

| Module | Endpoints |
|--------|-----------|
| `authApi` | `login`, `register`, `logout` |
| `promptsApi` | `save`, `copy` |
| `submissionsApi` | `submit` |
| `profileApi` | `stats` |
| `libraryApi` | `categories`, `tags`, `list`, `search`, `getById` |

---

## Backend

### Core

| Tool | Version | Purpose |
|------|---------|---------|
| **Hono** | 4.6 | Lightweight, fast HTTP framework |
| **@hono/node-server** | 1.13 | Adapts Hono to run on Node.js |
| **TypeScript** | 5.7 | Static typing for all routes and schemas |
| **tsx** | 4.19 | Execute TypeScript files directly — used for import scripts |
| **dotenv** | 16.4 | Load environment variables from `.env` |

### API Routes

| Mount | File | Description |
|-------|------|-------------|
| `/api/auth` | `routes/auth.ts` | Register, login, logout |
| `/api/prompts` | `routes/prompts.ts` | CRUD for user-created prompts |
| `/api/submissions` | `routes/submissions.ts` | Community prompt submissions |
| `/api/profile` | `routes/profile.ts` | User stats and saved prompts |
| `/api/admin` | `routes/admin.ts` | Admin-only bulk import management |
| `/api/library` | `routes/prompt-library.ts` | Read-only library of imported prompts |
| `/health` | `index.ts` | Health check endpoint |

### Validation

| Tool | Purpose |
|------|---------|
| **Zod** | Schema definitions for all request bodies and query params |
| **@hono/zod-validator** | Hono middleware that validates and injects typed query/body into handlers |

### Data Import Scripts

| Script | Purpose |
|--------|---------|
| `scripts/import-prompts.ts` | Reads `prompts_master.xlsx`, normalises 350 image-generation prompts, bulk-inserts into `pl_prompts` + `pl_prompt_platforms` |
| `scripts/seed-text-prompts.ts` | Seeds 35 Website / Text / Content generation prompts (placeholder until real data arrives) |
| `prompt_library.sql` | Standalone SQL file to bootstrap the library schema — run once before import |

---

## Database

### Engine

| Tool | Version | Purpose |
|------|---------|---------|
| **PostgreSQL** | 14+ | Primary relational database |
| **Drizzle ORM** | 0.44 | Type-safe query builder and schema definition |
| **postgres.js** | 3 | Native PostgreSQL driver (used by Drizzle) |
| **drizzle-kit** | 0.31 | Schema diffing and migration management |

**Supported hosts:** Supabase · Neon · self-hosted PostgreSQL

### Schema Overview

The Drizzle schema (`backend/src/db/schema.ts`) defines 20 tables:

| Group | Tables |
|-------|--------|
| **Users** | `users`, `userSubscriptions` |
| **Prompts** | `prompts`, `promptPlatforms`, `promptVariables`, `promptTags`, `tags` |
| **Library (imported)** | `pl_prompts`, `pl_prompt_platforms` *(raw SQL, outside Drizzle)* |
| **Engagement** | `savedPrompts`, `copyEvents`, `viewEvents`, `reviews`, `helpfulVotes` |
| **Submissions** | `submissions`, `builtPrompts`, `improvedPrompts`, `bulkImports` |
| **Billing** | `pricingPlans`, `userSubscriptions` |
| **System** | `categories`, `platforms`, `notifications` |

### PostgreSQL Extensions

| Extension | Purpose |
|-----------|---------|
| **`pg_trgm`** | Trigram-based fuzzy search — `similarity(title, query) > 0.15` catches typos and partial words |
| **`unaccent`** | Strips accents before indexing — "café" matches "cafe" |

### Full-Text Search Column

The `pl_prompts` table has a generated stored column:

```sql
search_vec TSVECTOR GENERATED ALWAYS AS (
  to_tsvector('english',
    unaccent(coalesce(title, ''))        || ' ' ||
    unaccent(coalesce(base_prompt, ''))  || ' ' ||
    unaccent(coalesce(category, ''))     || ' ' ||
    unaccent(coalesce(sub_category, '')) || ' ' ||
    unaccent(coalesce(prompt_type, ''))  || ' ' ||
    unaccent(array_to_string(tags, ' '))
  )
) STORED
```

Auto-updates on every INSERT/UPDATE — no manual maintenance needed.

### Indexes

| Index | Type | Column | Purpose |
|-------|------|--------|---------|
| `idx_pl_prompts_search` | GIN | `search_vec` | Full-text `@@` operator |
| `idx_pl_prompts_tags` | GIN | `tags` | Array overlap `&&` operator |
| `idx_pl_prompts_title_trgm` | GIN | `title gin_trgm_ops` | Fuzzy `similarity()` |
| `idx_pl_prompts_category` | B-tree | `category` | Category filter scans |
| `idx_pl_platforms_prompt` | B-tree | `prompt_id` | Platform join lookups |

---

## Search Architecture

```
User query
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Full-text search (PRIMARY)                         │
│  search_vec @@ plainto_tsquery('english', query)    │
│  Ranked by ts_rank() — uses GIN index, very fast    │
└───────────────────────┬─────────────────────────────┘
                        │ returns 0 results?
                        ▼
┌─────────────────────────────────────────────────────┐
│  Fuzzy fallback (AUTOMATIC)                         │
│  similarity(title, query) > 0.15                    │
│  Catches typos, partial words, misspellings         │
│  Uses pg_trgm GIN index                             │
└─────────────────────────────────────────────────────┘
```

The API returns a `mode` field (`"fulltext"` | `"fuzzy"` | `"none"`) so the frontend can show a "fuzzy match" badge when the fallback fires.

**Search endpoint:** `GET /api/library/prompts/search?q=portrait&mode=both&category=Art+%26+Illustration&page=1`

---

## Static Data Pipeline

Because the backend may not always be running during development, the frontend ships a pre-built static dataset generated from `prompts_master.xlsx` at build time.

| File | Size (gzip) | Purpose |
|------|-------------|---------|
| `lib/library-data.ts` | ~40 KB | 350 prompt cards — title, category, image path, tags, rating |
| `lib/library-platforms.ts` | ~481 KB | 350 × 6 platform prompt versions — **lazy loaded** as a separate chunk, only when a detail page opens |
| `lib/prompt-images.ts` | ~6 KB | Slug → `/images/imageN.jpeg` mapping for all 348 images |
| `public/images/` | ~30 MB | 348 JPEG images served directly by Vite as static assets |

**Generation scripts** (run from project root):
```bash
# Regenerate after updating prompts_master.xlsx
node scripts/generate-library-data.js
```

**Data flow:**
```
prompts_master.xlsx
        │
        ├──▶ library-data.ts        (card info, no platform text)
        ├──▶ library-platforms.ts   (all platform versions, lazy)
        └──▶ prompt-images.ts       (slug → image URL map)

extracted_images/
        └──▶ frontend/public/images/  (static JPEG assets)
```

---

## Auth & Security

| Tool | Purpose |
|------|---------|
| **jose** | JWT creation (`SignJWT`) and verification (`jwtVerify`) — RS256 / HS256 |
| **bcryptjs** | Password hashing with salt rounds (never stored plain text) |
| **nanoid** | Cryptographically random unique IDs |

**Auth flow:**
```
POST /api/auth/register  →  hash password → store user → sign JWT → return token
POST /api/auth/login     →  verify password → sign JWT → return token

Protected routes:
  requireAuth middleware  →  verify JWT → attach user to context
  requireAdmin middleware →  requireAuth + check isAdmin flag
```

**Frontend storage:** JWT stored in `localStorage` under key `pv_token`. User object stored under `pv_user`.

---

## Development Environment

| Item | Value |
|------|-------|
| **OS** | Windows 11 (development) |
| **Node.js** | v25 |
| **Package manager** | npm 10+ |
| **Frontend port** | `localhost:5173` (Vite, auto-increments if busy) |
| **Backend port** | `localhost:3000` (Hono) |
| **Database** | Supabase / Neon / local PostgreSQL 14+ |

### Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL=postgresql://user:password@host:5432/promptvault
JWT_SECRET=<long-random-string>
PORT=3000
FRONTEND_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-...
```

### First-time Setup

```bash
# 1. Install all dependencies
npm install

# 2. Bootstrap the prompt library schema
psql $DATABASE_URL -f backend/prompt_library.sql

# 3. Import 350 image generation prompts from Excel
cd backend && npx tsx scripts/import-prompts.ts

# 4. Seed Website / Text / Content prompts
npx tsx scripts/seed-text-prompts.ts

# 5. Start both servers
cd .. && npm run dev
```

---

## Planned Upgrades

| Feature | Tool | Notes |
|---------|------|-------|
| **AI semantic search** | `pgvector` + OpenAI `text-embedding-3-small` | Schema upgrade path documented in `prompt_library.sql` |
| **Website generation prompts** | — | Seed data ready in `seed-text-prompts.ts`, UI shows "coming soon" |
| **Text generation prompts** | — | Same as above |
| **Content generation prompts** | — | Same as above |
| **Subscription billing** | Stripe or Razorpay | `pricingPlans` and `userSubscriptions` tables already in schema |
