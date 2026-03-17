# AccessIndia.ai

Policy, regulatory, and import compliance consulting firm website with AI-powered compliance search tool. Users can browse consulting services, learn about the team, and use the beta compliance search to get HS classification, duty breakdowns, certifications, and import process reports.

**Live:** https://accessindia.vercel.app

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4, shadcn/ui (New York style), Lucide icons
- **Fonts:** Inter (sans), Georgia (serif headings)
- **Database:** SQLite (better-sqlite3) — local file `accessindia.db` (gitignored)
- **AI:** Google Gemini 2.0-flash (classification + report synthesis), gemini-embedding-001 (vectors)
- **Deployment:** Vercel (`vercel --prod`)

## Project Structure

```
src/
  app/
    page.tsx                    # Homepage (10 sections: hero, trust bar, what we do, etc.)
    layout.tsx                  # Root layout (header/footer/chat widget)
    search/page.tsx             # Compliance Search (Beta) — 3-step wizard
    about/page.tsx              # About Us (team, Omega QMS, ARM partnership)
    services/page.tsx           # 2 featured service cards + 3 accordion practices
    vision/page.tsx             # Vision statement + 7 numbered values (manifesto style) + messages
    contact/page.tsx            # Contact form + sidebar info + Google Maps link
    import-navigator/page.tsx   # Redirects to /search
    report/[id]/page.tsx        # Shareable report (SSR from SQLite)
    api/
      import-report/route.ts    # POST: full compliance report pipeline
      classify-hs/route.ts      # POST: standalone HS classification
      contact/route.ts          # POST: contact form → SQLite + console log
  components/
    home/                       # Homepage sections (hero, trust-bar, numbers, what-we-do, etc.)
    import-navigator/           # ProductInputForm, HSCodeSelector, ComplianceReportView
    layout/                     # Header, Footer, ChatWidget
    ui/                         # shadcn components (accordion, badge, button, card, etc.)
  lib/
    ai/
      classify-hs.ts            # 2-stage: vector search → Gemini selection
      import-report.ts          # Gemini report synthesis (risk summary + regulatory notes)
      embeddings.ts             # Gemini embedding API wrapper
      gemini.ts                 # Gemini client init
    db/
      client.ts                 # SQLite connection (singleton)
      schema.ts                 # Table creation (10 tables)
      seed.ts                   # CSV/JSON → SQLite seeding
    hooks/
      use-count-up.ts           # Animated counter hook (IntersectionObserver + RAF, SSR fallback)
    rag/
      context-builder.ts        # Assembles compliance context from DB
      structured-lookup.ts      # Direct DB queries (duties, FTAs, certs, DGFT)
      vector-search.ts          # Cosine similarity over HS code embeddings
    duty-calculator.ts          # Deterministic duty math (BCD + AIDC + SWS + IGST)
  types/
    compliance-report.ts        # ComplianceReport interface
    hs-code.ts                  # HSCode, ClassificationResult
    database.ts                 # DB entity types
data/                           # Seed data (CSVs + JSONs)
scripts/
  generate-embeddings.ts        # One-time: generate & store HS code embeddings
```

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static (server) | Homepage — hero, trust bar, services overview, numbers, clients, backed-by, search CTA |
| `/about` | Static (server) | Company info, team bios, Omega QMS foundation, ARM legal partnership |
| `/services` | Static (server) | 2 featured cards + 3 accordion practices with "Get a Quote" CTAs |
| `/vision` | Static (server) | Vision statement, 7 numbered values (manifesto style), messages |
| `/contact` | Client | Contact form with service pre-fill via `?service=` param |
| `/search` | Client | Compliance Search (Beta) — 3-step wizard, accepts `?q=` pre-fill |
| `/report/[id]` | Dynamic (server) | Shareable compliance report from SQLite |
| `/import-navigator` | Redirect | Redirects to `/search` |

## Key Patterns

- **Brand colors:** Navy `#0D1B3E`, Deep Blue `#1A3A6B`, Gold `#D4A843`, Light BG `#F4F6FA`
- **Duty calculation is deterministic** (`duty-calculator.ts`), not LLM-generated
- **HS classification is 2-stage:** vector similarity → Gemini selection. Confidence < 70% → user picks
- **Database auto-initializes** on first API call — schema creation + CSV/JSON seeding
- **Reports are persisted** in `generated_reports` table with UUID
- **Contact form** stores in `contact_leads` table, rate-limited (5/hr/IP), honeypot for bots
- **Chat widget** (bottom-right) provides conversational compliance flow using existing `/api/import-report`, animated open
- **Static pages are server components** (zero client JS) except homepage numbers section
- **USD→INR conversion** uses hardcoded rate of 83.5 in `duty-calculator.ts`
- **Focus states:** Global `focus-visible` ring using gold accent (`globals.css`) — WCAG 2.4.7 compliant
- **Counter SSR fallback:** Numbers section renders final values server-side; animates from 0 after hydration
- **Touch targets:** Footer links and contact links padded to 44px+ effective height
- **Homepage "Why Us":** Asymmetric 2+1 layout (large navy card + 2 border-left text blocks), not 3-column grid

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npx tsx scripts/generate-embeddings.ts   # Generate HS code embeddings (requires GEMINI_API_KEY)
vercel --prod            # Deploy to Vercel
```

## Environment

Single env var required in `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

## Data Expansion

To add more HS codes or duty rates:
1. Add rows to the relevant CSV/JSON in `data/`
2. Delete `accessindia.db` (or let seed detect new entries)
3. Run `npx tsx scripts/generate-embeddings.ts` to generate vectors for new codes

## Current State

- **Consulting website** — 7 pages (Home, About, Services, Vision, Contact, Search, Report)
- **Compliance Search (Beta)** — fully functional
- **Floating chat widget** — conversational compliance assistant on all pages
- **Contact form** — stores leads in SQLite
- Data coverage: ~41 sample HS codes across food, beverages, oils, electronics, equipment
- Official data sources: CBIC, DGFT, BIS, FSSAI

## Code Conventions

- Path alias: `@/*` maps to `src/*`
- Components use shadcn/ui primitives from `@/components/ui/`
- API routes return JSON with `status: "complete" | "needs_classification" | "error" | "success"`
- Client state managed with React hooks (no external state library)
- Navy/Gold brand palette (CSS variables: `--navy`, `--deep-blue`, `--gold`, `--light-bg`)
- Serif font (Georgia) for headings, Inter for body text

## gstack

- **Web browsing:** Always use the `/browse` skill from gstack for all web browsing tasks. Never use `mcp__claude-in-chrome__*` tools.
- **Available skills:**
  - `/plan-ceo-review` — CEO/founder-mode plan review
  - `/plan-eng-review` — Eng manager-mode plan review
  - `/plan-design-review` — Designer's eye review of a live site
  - `/review` — Pre-landing PR review
  - `/ship` — Ship workflow (merge, test, review, PR)
  - `/browse` — Fast headless browser for QA and site dogfooding
  - `/qa` — Systematically QA test and fix bugs
  - `/qa-only` — Report-only QA testing
  - `/qa-design-review` — Designer's eye QA with fixes
  - `/setup-browser-cookies` — Import cookies from real browser
  - `/retro` — Weekly engineering retrospective
  - `/document-release` — Post-ship documentation update
