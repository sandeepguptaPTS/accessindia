# AccessIndia.ai

Policy, regulatory, and import compliance consulting firm website with AI-powered compliance search.

**Live:** https://accessindia.vercel.app

## What's Here

- **Consulting website** — 7 pages: Home, About, Services, Vision, Contact, Search, Report
- **Compliance Search (Beta)** — enter a product, get HS classification, duty breakdown, certifications, and a full regulatory report
- **Floating chat widget** — conversational compliance assistant on every page
- **Contact form** — service-specific lead capture with validation

## Quick Start

```bash
npm install
npm run dev              # http://localhost:3000
```

Requires `GEMINI_API_KEY` in `.env.local` for the compliance search feature.

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · SQLite · Google Gemini 2.0-flash

## Docs

Full project documentation, architecture, conventions, and commands: **[CLAUDE.md](./CLAUDE.md)**

## Deploy

```bash
vercel --prod
```
