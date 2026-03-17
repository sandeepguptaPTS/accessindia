# TODOs

Deferred items from the design audit (2026-03-17).

## 1. CSS variable for gold hover color
The hover shade `#c49a3a` is hardcoded in 8+ files. Extract to a CSS variable (e.g. `--gold-hover`) in `globals.css`.

## 2. Chat widget responsive width
The floating chat widget overflows or clips on screens narrower than 360px. Add a responsive width/max-width rule.

## 3. Skip-to-content link
Add a visually-hidden skip-to-content link as the first focusable element in the layout for keyboard/screen-reader users (WCAG 2.4.1).

## 4. WCAG AA contrast verification on gold-on-navy
Verify that `--gold` (#D4A843) on `--navy` (#0D1B3E) meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text). Adjust if needed.

## 5. Dead code cleanup
- `Geist_Mono` font import in `layout.tsx` — unused, can be removed
- Marquee CSS animation in `globals.css` — no longer used after trusted-by section was made static
