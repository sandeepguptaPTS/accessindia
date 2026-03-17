# Design System — AccessIndia.ai

## Product Context
- **What this is:** Professional advisory portal for import compliance into India, with AI-powered compliance search tool
- **Who it's for:** Foreign CFOs, compliance managers, and companies importing goods into India
- **Space/industry:** Trade compliance advisory, regulatory consulting, professional services
- **Project type:** Marketing site + web app (compliance search tool)

## Aesthetic Direction
- **Direction:** Luxury/Refined
- **Decoration level:** Minimal — typography and whitespace do the work
- **Mood:** Authoritative, trustworthy, serious. The site should feel like a top-tier consulting firm — McKinsey, not a startup. Clean, high-contrast, no playfulness.
- **Reference sites:** McKinsey.com (navy + gold, serif/sans pairing), Bain.com (dark palette, serif headings), Tradewin.net (compliance vertical)

## Typography
- **Display/Hero:** Georgia — authoritative serif that renders perfectly everywhere. Used for all h1 and h2 headings.
- **Body:** Inter — clean, professional, highly legible. Loaded via `next/font/google` as `--font-inter`.
- **UI/Labels:** Inter (semibold) — buttons, navigation, badges, CTAs at 14px/600.
- **Data/Tables:** System monospace (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`) — HS codes, duty amounts, tariff data. Supports tabular-nums natively.
- **Code:** Same system monospace stack.
- **Loading:** Inter via `next/font/google` (automatic subset, variable font). Georgia is a system font (no loading needed).
- **Scale:**
  - Hero h1: 48px (text-5xl) / line-height 1.15
  - Page h1: 36-48px (text-4xl md:text-5xl) / line-height 1.15
  - Section h2: 30px (text-3xl) / line-height 1.3
  - Section h3: 20px (text-xl) / line-height 1.4
  - Body: 16px (text-base) / line-height 1.7
  - Body large: 18px (text-lg) / line-height 1.7
  - Small/captions: 14px (text-sm) / line-height 1.5
  - Labels/badges: 11-12px (text-xs) / uppercase tracking-wider

## Color
- **Approach:** Restrained — navy + gold with neutral grays. Color is rare and meaningful.

### Brand
| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0D1B3E` | Primary surfaces (hero, footer), heading text, cards |
| Deep Blue | `#1A3A6B` | Hover states, CTA variants (no longer used for trust bar) |
| Gold | `#D4A843` | Accent — CTAs, focus rings, badges, value headings |
| Gold Hover | `#c49a3a` | Gold button hover state |
| Light BG | `#F4F6FA` | Alternating section backgrounds |
| White | `#FFFFFF` | Primary content background |

### Neutrals (Tailwind gray scale)
| Token | Hex | Usage |
|-------|-----|-------|
| Gray 100 | `#F3F4F6` | Subtle backgrounds |
| Gray 200 | `#E5E7EB` | Borders, dividers |
| Gray 300 | `#D1D5DB` | Input borders, separators |
| Gray 400 | `#9CA3AF` | Placeholder text, disabled |
| Gray 500 | `#6B7280` | Secondary text (light contexts) |
| Gray 600 | `#4B5563` | Body text — primary readable gray |
| Gray 700 | `#374151` | Emphasis text |

### Semantic
| Token | Color | Background | Usage |
|-------|-------|------------|-------|
| Success | `#059669` | `#ECFDF5` | FTA savings, form success, "FREE" badge |
| Warning | `#D97706` | `#FFFBEB` | Beta disclaimer, pre-shipment badges, amber alerts |
| Error | `#DC2626` | `#FEF2F2` | Risk summary, anti-dumping duties, mandatory cert badges |
| Info | `#2563EB` | `#EFF6FF` | Regulatory notes, informational |

### Key Contrast Ratios
| Combination | Ratio | WCAG |
|-------------|-------|------|
| White on Navy | 12.9:1 | AAA |
| Gold on Navy | 6.4:1 | AA |
| White/70 on Navy | 8.4:1 | AAA |
| Navy on White | 12.9:1 | AAA |
| Gray 600 on White | 7.0:1 | AAA |
| Navy on Light BG | 11.8:1 | AAA |

### Dark Mode
Not implemented. Not needed for this product — the audience (foreign CFOs) uses this during business hours. If added later: darken surfaces to #0B1425, reduce gold saturation 10%, use #111D35 for cards.

## Spacing
- **Base unit:** 4px (Tailwind default)
- **Density:** Comfortable — generous whitespace appropriate for professional services
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)
- **Section padding:** `py-16 md:py-20` (64px / 80px) — standardized across all pages
- **Content max-width:** `max-w-5xl` for all page heroes and body content (`max-w-6xl` for contact page)
- **Full-width sections:** `max-w-7xl` only for homepage grid layouts (What We Do, Why Us)

## Layout
- **Approach:** Grid-disciplined
- **Grid:** Single column for content pages, 2-3 columns for homepage feature sections
- **Max content width:** `max-w-5xl` (1024px) for text content (`max-w-6xl` for contact), `max-w-7xl` (1280px) for full-width homepage sections
- **Header:** Light frosted glass (`bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50`), sticky. Dark navy text for nav links, navy "Get a Quote" CTA. Readable on all background colors.
- **Hero pattern:** Navy background, left-aligned h1 (serif text-4xl md:text-5xl), subtitle (text-lg text-white/70 max-w-2xl). Hero + trust bar wrapped in `min-h-[calc(100dvh-4rem)]` flex container so both fit within first viewport.
- **Trust bar:** Same navy background as hero, separated by subtle gold border (`border-t border-[var(--gold)]/20`). Sits at bottom of first viewport.
- **Section alternation:** White → Light BG → White (avoid stacking navy sections)
- **Border radius:**
  - sm: 4px (badges inline)
  - md: 8px (buttons, inputs, small cards)
  - base: 10px (0.625rem — shadcn default)
  - lg: 12px (cards)
  - 2xl: 16px (feature cards, team cards)
  - full: 9999px (avatar circles, pill badges)

## Motion
- **Approach:** Minimal-functional — transitions aid comprehension, nothing decorative
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** hover/focus(200ms) counter-animation(2000ms via RAF)
- **What animates:**
  - Button/link hover: background-color, 200ms ease
  - Input focus: border-color + box-shadow, 200ms ease
  - Homepage number counters: count-up from 0 via requestAnimationFrame, 2000ms, triggered by IntersectionObserver
  - Chat widget open: height transition
- **What does NOT animate:** Page transitions, scroll effects, entrance animations, parallax

## Accessibility
- **Focus states:** `outline: 2px solid var(--gold); outline-offset: 2px` on `:focus-visible` (WCAG 2.4.7)
- **Skip-to-content:** Visually hidden link, appears on keyboard focus (WCAG 2.4.1)
- **Touch targets:** Footer links and contact links padded to 44px+ effective height
- **Counter SSR fallback:** Numbers render final values server-side; animate from 0 after hydration

## CSS Variables
Defined in `globals.css` `:root`:
```css
--navy: #0D1B3E;
--deep-blue: #1A3A6B;
--gold: #D4A843;
--gold-hover: #c49a3a;
--light-bg: #F4F6FA;
```

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-17 | Initial design system formalized | Locked in existing Navy/Gold/Inter/Georgia system. Validated against McKinsey, Bain, Tradewin, and other compliance advisory firms — palette and approach are well-positioned for the professional services space. |
| 2026-03-17 | No font changes | Georgia + Inter pairing is strong. Georgia reads as authoritative without being stuffy. Inter is already loaded and works well at all sizes. |
| 2026-03-17 | Semantic colors formalized | Success/Warning/Error/Info were used ad-hoc via Tailwind classes. Now documented as part of the system. |
| 2026-03-17 | Hero pattern standardized | All pages now use consistent left-aligned, max-w-5xl, py-16 md:py-20 hero pattern. |
| 2026-03-18 | Header → frosted glass | Switched from solid navy to light frosted glass (`bg-white/80 backdrop-blur-xl`) with dark navy text. Readable on all background colors (dark hero, white sections, light CTA areas). |
| 2026-03-18 | Hero + trust bar viewport fit | Wrapped hero and trust bar in viewport-height flex container. Trust bar background changed from deep-blue to navy with gold border for seamless look. |
