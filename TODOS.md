# TODOs

Deferred items from the design audit (2026-03-17).

## P0

### 1. CSS variable for gold hover color
The hover shade `#c49a3a` is hardcoded in 8+ files. Extract to a CSS variable (e.g. `--gold-hover`) in `globals.css`.

### ~~2. Gemini retry logic~~ ✅
~~Add exponential backoff (max 3 attempts) to `generateText()` and `generateJSON()` in `src/lib/ai/gemini.ts`.~~
Done: `withRetry()` added with exponential backoff (1s, 2s, 4s cap).

### ~~3. Backend test coverage~~ ✅
~~Add 3 test files: `vector-search.test.ts`, `structured-lookup.test.ts`, `import-report.test.ts`.~~
Done: 3 test files added covering cosine similarity edge cases (including zero-vector NaN bug), FTA country matching, certification JSON parsing, deterministic warnings, and LLM response regex parsing.

## P1

### 4. Chat widget responsive width
The floating chat widget overflows or clips on screens narrower than 360px. Add a responsive width/max-width rule.

### ~~5. Extract COUNTRIES constant~~ ✅
~~Deduplicate 30-country list from `chat-widget.tsx` and `product-input-form.tsx` into `src/lib/constants.ts`.~~
Done: Extracted to `src/lib/constants.ts`, imported in both files.

### 6. Skip-to-content link
Add a visually-hidden skip-to-content link as the first focusable element in the layout for keyboard/screen-reader users (WCAG 2.4.1).

### 7. WCAG AA contrast verification on gold-on-navy
Verify that `--gold` (#D4A843) on `--navy` (#0D1B3E) meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text). Adjust if needed.

## P2

### 8. Dead code cleanup
- `Geist_Mono` font import in `layout.tsx` — unused, can be removed
- Marquee CSS animation in `globals.css` — no longer used after trusted-by section was made static

### ~~9. Database indexes~~ ✅
~~Add indexes on `hs_code` for `duty_rates`, `fta_rates`, `anti_dumping_duties`, and `dgft_licensing` in `schema.ts`.~~
Done: 4 indexes added in `schema.ts` (`CREATE INDEX IF NOT EXISTS`).
