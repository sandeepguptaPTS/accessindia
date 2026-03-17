# TODOs

Deferred items from the design audit (2026-03-17). All items resolved.

## P0

### ~~1. CSS variable for gold hover color~~ ✅
~~The hover shade `#c49a3a` was hardcoded in 8+ files.~~
Done: Extracted to `--gold-hover` CSS variable in `globals.css`, replaced across all 7 component files.

### ~~2. Gemini retry logic~~ ✅
~~Add exponential backoff to `generateText()` and `generateJSON()` in `src/lib/ai/gemini.ts`.~~
Done: `withRetry()` added with exponential backoff (1s, 2s, 4s cap, max 3 attempts).

### ~~3. Backend test coverage~~ ✅
~~Add 3 test files: `vector-search.test.ts`, `structured-lookup.test.ts`, `import-report.test.ts`.~~
Done: 3 test files, 42 new tests covering cosine similarity edge cases, FTA country matching, certification JSON parsing, deterministic warnings, and LLM response regex parsing.

## P1

### ~~4. Chat widget responsive width~~ ✅
~~The floating chat widget overflows on screens narrower than 360px.~~
Done: Changed to `w-[calc(100vw-2rem)] sm:w-[360px]` for responsive sizing.

### ~~5. Extract COUNTRIES constant~~ ✅
~~Deduplicate 30-country list from `chat-widget.tsx` and `product-input-form.tsx`.~~
Done: Extracted to `src/lib/constants.ts`, imported in both files.

### ~~6. Skip-to-content link~~ ✅
~~Add a visually-hidden skip-to-content link for keyboard/screen-reader users (WCAG 2.4.1).~~
Done: Added `.skip-to-content` CSS class in `globals.css` and `<a href="#main-content">` in `layout.tsx`.

### ~~7. WCAG AA contrast verification on gold-on-navy~~ ✅
~~Verify that `--gold` (#D4A843) on `--navy` (#0D1B3E) meets WCAG AA contrast ratio.~~
Done: Verified 7.63:1 contrast ratio — passes WCAG AAA (exceeds AA 4.5:1 and AAA 7:1). No adjustment needed.

## P2

### ~~8. Dead code cleanup~~ ✅
~~`Geist_Mono` font import in `layout.tsx` and marquee CSS animation in `globals.css`.~~
Done: Removed `Geist_Mono` import and `geistMono.variable` from layout. Replaced marquee animation with skip-to-content styles.

### ~~9. Database indexes~~ ✅
~~Add indexes on `hs_code` for `duty_rates`, `fta_rates`, `anti_dumping_duties`, and `dgft_licensing`.~~
Done: 4 indexes added in `schema.ts` (`CREATE INDEX IF NOT EXISTS`).

## Additional fixes (from eng review failure modes)

### ~~10. Zero-vector NaN bug~~ ✅
~~`cosineSimilarity` in `vector-search.ts:21` divided by zero without guard.~~
Done: Added `denom === 0` guard, returns 0 instead of NaN. Tests updated to verify.

### ~~11. Null duty breakdown force-cast~~ ✅
~~`import-report/route.ts:98` used `!` non-null assertion on `context.dutyBreakdown`.~~
Done: Replaced with nullish coalescing (`??`) providing a zero-valued fallback `DutyBreakdown`.
