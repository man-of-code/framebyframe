# Frame by Frame — Design System

**Status:** Locked Oct 22, 2026. Implementers must not re-decide anything in this file.
**Companion:** `docs/prd.md` (product + functional spec). **Content source:** `Frame by Frame Research Ledger, Curriculum and PRD.md`.

Direction: **Night Interior** — a cold, desaturated cinema base with a single warm accent reserved for progress and achievement. Modern and high-contrast enough to stop a scroll; quiet and legible enough to read for forty minutes on a phone.

---

## 1. Why this direction

The reference set (Black Girl Film School, Ukrainian Film School, the two minimal film-school landings) is warm editorial: oversized type, warm blacks, high-contrast stills, generous negative space. The chosen palette is cold. Cold alone reads as developer tooling, not film school. The resolution is **teal-and-orange**: a cold blue-black base carrying all structural UI, and one warm amber reserved exclusively for progress, completion, and capstone state. The learner's own achievement is the only thing on the site that is warm. This is a semantic rule, not a decorative one — see §3.3.

---

## 2. Color

All tokens are **semantic**. Both modes define identical token names. No component references a raw hex value.

### 2.1 Dark mode (default)

| Token | Hex | Use |
|---|---|---|
| `--bg-base` | `#07090D` | Page background |
| `--bg-raised` | `#0D1118` | Cards, week sections, resource cards |
| `--bg-overlay` | `#121823` | Dialogs, popovers, command palette, mobile sheet |
| `--bg-inset` | `#05070A` | Code blocks, input wells, table header |
| `--bg-hover` | `#141A24` | Row/card hover |
| `--border-subtle` | `#1B2230` | Internal dividers, table rules |
| `--border-default` | `#273243` | Card borders, input borders |
| `--border-strong` | `#3A4859` | Focused input, emphasized card |
| `--text-primary` | `#E8EDF5` | Headings, body copy — 15.8:1 on base |
| `--text-secondary` | `#A7B4C6` | Supporting copy, descriptions — 9.0:1 |
| `--text-tertiary` | `#6E7E93` | Meta, timestamps, counts — 4.76:1 (AA floor; never go lighter in weight than 400 at this value) |
| `--accent-primary` | `#6AB8FF` | Links, primary action, focus ring, selected filter — 9.4:1 |
| `--accent-primary-hover` | `#8AC8FF` | |
| `--accent-primary-active` | `#4A9FE8` | |
| `--accent-primary-wash` | `rgba(106,184,255,0.12)` | Selected chip fill, active nav background |
| `--accent-primary-edge` | `rgba(106,184,255,0.32)` | Selected chip border |
| `--accent-warm` | `#F2A65A` | **Progress and completion only** — 9.8:1 |
| `--accent-warm-wash` | `rgba(242,166,90,0.14)` | Completed-week fill, progress bar track fill |
| `--accent-warm-edge` | `rgba(242,166,90,0.36)` | |
| `--status-ok` | `#5BD6A8` | Validation passed, link check green, done-when met |
| `--status-warn` | `#C9A227` | Gray-area badge, email-gated resource, unverified fee |
| `--status-danger` | `#FF6B6B` | Dead link, destructive action, import failure |
| `--status-paid` | `#A78BFA` | Paid / benchmark-only badge |
| `--grain-opacity` | `0.025` | See §5 |
| `--vignette` | `radial-gradient(ellipse at 50% 0%, transparent 35%, rgba(0,0,0,0.55) 100%)` | Hero and letterbox containers |

### 2.2 Light mode

Daylight reading mode. Cool off-white, never pure white — pure white next to a dark-mode-first type scale reads as a blown highlight.

| Token | Hex | Notes |
|---|---|---|
| `--bg-base` | `#F7F8FA` | |
| `--bg-raised` | `#FFFFFF` | Cards lift *up* in light mode, *down* in dark |
| `--bg-overlay` | `#FFFFFF` | with `--shadow-overlay` |
| `--bg-inset` | `#EDF0F4` | |
| `--bg-hover` | `#EFF2F6` | |
| `--border-subtle` | `#E2E7ED` | |
| `--border-default` | `#CDD5DF` | |
| `--border-strong` | `#9FACBB` | |
| `--text-primary` | `#0E141C` | 16:1 |
| `--text-secondary` | `#3D4A5C` | 8.9:1 |
| `--text-tertiary` | `#5E6B7D` | 5.5:1 |
| `--accent-primary` | `#0B63CE` | 5.4:1 — the dark-mode blue fails on light, do not reuse it |
| `--accent-primary-hover` | `#0A56B3` | |
| `--accent-primary-active` | `#084A9B` | |
| `--accent-primary-wash` | `rgba(11,99,206,0.08)` | |
| `--accent-primary-edge` | `rgba(11,99,206,0.28)` | |
| `--accent-warm` | `#A35A09` | For warm **text and icons** (5.6:1). `#F2A65A` stays the warm **fill** color in both modes |
| `--accent-warm-wash` | `rgba(242,166,90,0.18)` | |
| `--status-ok` | `#0E7A5A` | |
| `--status-warn` | `#8A6D0B` | |
| `--status-danger` | `#C0362C` | |
| `--status-paid` | `#6D48C9` | |
| `--grain-opacity` | `0` | Grain is **off** in light mode — see §5.3 |

**Cost disclosure:** a real light mode roughly doubles visual QA. Every card, badge, chart, grain surface, and focus state must be checked twice. Dark is the default and ships first; light mode is a P1 that must not block launch.

### 2.3 shadcn/ui variable mapping

Map our semantic tokens onto shadcn's required names in `globals.css`. Convert hex to the project's color format (HSL for shadcn on Tailwind v3, oklch for Tailwind v4) — keep our token names as the source of truth and define shadcn's names *from* them.

| shadcn var | Our token |
|---|---|
| `--background` | `--bg-base` |
| `--foreground` | `--text-primary` |
| `--card` / `--popover` | `--bg-raised` / `--bg-overlay` |
| `--card-foreground` / `--popover-foreground` | `--text-primary` |
| `--primary` | `--accent-primary` |
| `--primary-foreground` | `#07090D` dark / `#FFFFFF` light |
| `--secondary` | `--bg-inset` |
| `--muted` | `--bg-inset` |
| `--muted-foreground` | `--text-tertiary` |
| `--accent` | `--accent-primary-wash` |
| `--destructive` | `--status-danger` |
| `--border` | `--border-default` |
| `--input` | `--border-default` |
| `--ring` | `--accent-primary` |
| `--radius` | `0.5rem` |

### 2.4 Color rules

1. `--accent-warm` is reserved. It appears on: progress bars, completed week markers, the filmstrip's exposed frames, capstone stage completion, and the capstone-complete ceremony. It never appears on a link, a button, a filter, or a nav item.
2. Color is never the only signal. The gray-area badge carries an icon and the word "gray area." The paid badge carries a currency glyph. Completed state carries a check mark, not just amber fill.
3. No gradient carries meaning. Gradients are atmosphere only (hero, letterbox vignette).
4. Elevation: dark mode lifts with **border + lighter surface**, never with a drop shadow (shadows are invisible on `#07090D`). Light mode lifts with shadow: `--shadow-raised: 0 1px 2px rgba(14,20,28,0.06), 0 2px 8px rgba(14,20,28,0.04)`.

---

## 3. Typography

### 3.1 Families (self-hosted woff2, subset to latin + latin-ext + Devanagari for the display face only)

| Role | Family | Why |
|---|---|---|
| Display | **Archivo Expanded** 600/700 | Wide letterforms read as a film title card. Instantly distinguishes the landing from the Inter-everything default and carries the "cinematic" brief without a single image. |
| Body / UI | **Inter** variable | Nothing beats it for dense tables, filter chips and 16px body on a 360px Android screen. Deliberately unexciting — the display face does the talking. |
| Mono | **JetBrains Mono** 400/500 | The curriculum is full of specs: `24fps`, `1/48s`, `-14 LUFS`, `ProRes 422 LT`, `WK 07 / 16`. Mono makes them scannable and doubles as the timecode motif. |

Preload the display face only (`<link rel="preload" as="font" crossorigin>`). Inter and JetBrains Mono use `font-display: swap`. Fallback stack: `Archivo Expanded, "Arial Black", system-ui` / `Inter, system-ui, -apple-system, sans-serif` / `"JetBrains Mono", ui-monospace, monospace`.

### 3.2 Scale (mobile → desktop via `clamp`)

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `--text-display` | `clamp(2.75rem, 9vw, 6rem)` | 0.95 | `-0.03em` | Landing H1 only |
| `--text-h1` | `clamp(2rem, 5vw, 3rem)` | 1.1 | `-0.02em` | Page titles, week titles |
| `--text-h2` | `clamp(1.5rem, 3.2vw, 2rem)` | 1.2 | `-0.015em` | Module headers, Watch/Read/Do section heads |
| `--text-h3` | `1.25rem` | 1.3 | `-0.01em` | Card titles |
| `--text-body-lg` | `clamp(1.0625rem, 1.4vw, 1.1875rem)` | 1.65 | `0` | Week prose, About |
| `--text-body` | `1rem` (16px floor, never smaller on mobile) | 1.6 | `0` | Default |
| `--text-sm` | `0.875rem` | 1.5 | `0` | Card meta, helper text |
| `--text-eyebrow` | `0.75rem` | 1.2 | `0.14em` | Uppercase labels: `MODULE 4 · CINEMATOGRAPHY` |
| `--text-mono` | `0.875rem` | 1.5 | `0` | Specs, timecode, week numerals |

Measure: body copy capped at `65ch`, hard max `72ch`. Headings may run wider.

### 3.3 Typographic motifs

- **Week numerals as timecode.** `WK 07 / 16` in mono, `--text-tertiary`, with the current week's number in `--accent-warm`. Appears in the nav rail, week header, and dashboard.
- **Eyebrow + display pairing.** Every page title is preceded by a mono uppercase eyebrow (module, week, or section). This is the single most load-bearing editorial device in the system — it does the work the Dribbble refs get from photography, which this site does not have.
- **Hours in mono.** `~8 hrs core` renders mono so heavy weeks are visually scannable down a list.

---

## 4. Layout, spacing, motion

**Spacing scale (4px base):** `4 8 12 16 24 32 48 64 96 128`. Tokens `--space-1` … `--space-10`.

**Containers:** `--container-prose: 42rem` (week/about reading), `--container-app: 76rem` (plan, library, dashboard). Page gutters `16px` mobile, `24px` tablet, `48px` desktop.

**Breakpoints:** `360` (floor, must not horizontal-scroll) · `640` · `768` (nav switches from bottom tabs to left rail) · `1024` · `1440`.

**Radii:** `--radius-sm: 6px` (chips, badges), `--radius-md: 10px` (cards, inputs), `--radius-lg: 16px` (panels, sheets), `--radius-full` (avatars, pills). Nothing is fully square; nothing is a blob.

**Z-index scale:** `10` sticky header · `20` left rail / bottom tabs · `30` dropdown / popover · `40` sheet / drawer · `50` dialog · `60` toast. Grain overlays sit at `1` inside their own stacking context and are never global.

**Motion:**

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default for everything entering |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Position changes |
| `--dur-fast` | `150ms` | Hover, checkbox, chip toggle |
| `--dur-base` | `220ms` | Card state, accordion, popover |
| `--dur-slow` | `420ms` | Route transition, sheet |
| `--dur-ceremony` | `900ms` | Capstone stage completion, week completion |

Animate `transform` and `opacity` only. Never animate `width`, `height`, `top`, or `margin`. Hover states change color, border, or shadow — **never scale**, because scale on a card in a filter grid shifts neighbours and makes the library feel unstable.

**`prefers-reduced-motion: reduce`** → all durations collapse to `1ms` except opacity fades which collapse to `--dur-fast`; WebGL renders one static frame or swaps to its poster; the ceremony animation becomes a static state change.

---

## 5. Grain

### 5.1 Verdict

**Use it, on dark mode surfaces only.** It is justified on two grounds:

1. **Functional.** The dark palette carries large low-contrast gradient fields (hero vignette, letterbox fades, card washes). 8-bit sRGB gradients across dark values band visibly, and band worst on the mid-range Android panels this learner actually uses. A 2–3% noise overlay dithers that banding away. This is the same mechanism that makes film scans look smooth where digital gradients do not.
2. **Semantic.** The site is about the photographic image. Grain references the medium at zero image-asset cost — important for a site that has no photography budget.

### 5.2 Where it fails (these are the constraints, not caveats)

| Failure | Rule |
|---|---|
| Over body text — noise at 2–3% reduces effective contrast and fights subpixel antialiasing | Grain is **never** in the same stacking layer as text. Content renders in a child above the overlay. |
| In light mode — noise on near-white reads as JPEG compression or a dirty screen, not film | `--grain-opacity: 0` in light mode. Light mode gets a flat paper-tone wash (`--bg-base: #F7F8FA` already carries it) instead. |
| At 2×/3× DPR with an unscaled tile — either invisible mush or moiré | Tile sized in **CSS pixels** (`background-size: 128px 128px`) so the browser scales it with DPR as intended. |
| Animated grain — continuous full-screen repaint, measurable battery cost on phones | **Static only.** No flicker, no projector-gate animation. |
| Global `body::after` overlay — repaints on every scroll, covers everything including text | Grain is applied per-surface via a `.grain` utility, never globally. |

### 5.3 Implementation

```css
.grain { position: relative; isolation: isolate; }
.grain::before {
  content: ""; position: absolute; inset: 0; z-index: 1;
  background-image: var(--grain-tile);      /* inline SVG feTurbulence data URI, 128px */
  background-size: 128px 128px;
  opacity: var(--grain-opacity);            /* 0.025 dark, 0 light */
  pointer-events: none;
  mix-blend-mode: overlay;
}
.grain > * { position: relative; z-index: 2; }
```

Applied to: landing hero, letterbox image containers, week header panel, capstone ceremony surface, module cards on `/plan`. **Not** applied to: library resource cards (dense, text-heavy, hundreds on screen), tables, forms, or anything inside `--container-prose`.

---

## 6. Cinematic treatment without WebGL

Everything in this section is CSS-only and carries the look on every route the learner works in. This — not the shaders — is what makes the site feel cinematic 95% of the time.

| Device | Implementation | Where |
|---|---|---|
| **Filmstrip progress rail** | The 16-week plan rendered as a strip of frames with sprocket perforations (`repeating-linear-gradient`). Completed weeks are "exposed" (`--accent-warm-wash` fill + check), the current week is outlined in `--accent-warm`, future weeks are empty with `--border-subtle`. Extension weeks 13–16 are visually separated by a splice gap. | Desktop left rail, mobile `/plan` header, dashboard |
| **Letterbox containers** | `aspect-ratio: 2.39/1` with thin `--bg-inset` bars and `--vignette` applied | Week page headers, landing hero, module cards |
| **Vignette** | `--vignette` radial gradient, plus `box-shadow: inset 0 0 120px rgba(0,0,0,0.5)` on hero | Hero, letterbox containers |
| **Bleach-bypass imagery** | `filter: saturate(0.65) contrast(1.12)` on any photography, with full saturation on hover for interactive stills | Any future imagery |
| **Timecode numerals** | Mono, tabular-nums, `--text-tertiary` | Week numbers, hour estimates, progress counts |
| **Slate rule** | A 2px `--accent-warm` left border on the active assignment card, echoing a clapper stripe | Week assignment card |

---

## 7. ThreeUI — governance

ThreeUI is the **atmosphere layer only**. It is not the UI kit. The catalog (verified against `MengTo/threeui` `src/shaders/`, 47 Community families) contains decorative WebGL scenes plus a handful of shader-skinned controls. It contains **no** checkbox, table, filter chip, form input, or layout primitive — and this app is overwhelmingly checkboxes, filters, and dense reading surfaces. shadcn/ui builds the interface; ThreeUI decorates three specific moments.

### 7.0 Vendored, not installed (verified Oct 22, 2026)

**Do not `npm install @designcodeio/threeui`.** The published package (v1.2.0) declares two pinned Three.js copies as real dependencies — `"three128": "npm:three@0.128.0"` and `"three165": "npm:three@0.165.0"` — *plus* `three: ">=0.149 <1"` as a peer dependency. Installing it drops three Three.js copies into `node_modules`.

None of the four components below import Three.js. Their import graphs were checked directly: `crt` is hand-rolled raw WebGL1 (`canvas.getContext("webgl")` with inline GLSL strings in `crtShaders.ts`), `lumen-cta` is pure CSS, `spark-badge` is canvas/DOM, and `articleHeadingDecode.ts` has no imports at all. Combined source is ~47KB uncompressed (~12–15KB gzipped).

**Therefore: vendor the source files into `src/vendor/threeui/`** with the upstream MIT notice and a `SOURCE.md` recording the commit they were copied from. This avoids the triple-Three.js install, avoids the full-HTML-document asset-copy problem, and keeps the bundle honest. The tradeoff — no upstream updates — is acceptable for four decorative files. Upstream license: MIT.

### 7.1 Approved surfaces (exhaustive — do not add more without a spec change)

| Surface | Component | Files to vendor | Notes |
|---|---|---|---|
| First-run landing hero (`/` with no stored progress) | **`crt`** (`CrtBackground`) | `CrtBackground.tsx`, `crtRenderer.ts`, `crtShaders.ts`, `crtScreens.ts` (~40KB) | Phosphor/scanline is literally about the image-making medium and pairs with the product name. `crtRenderer` **throws** when WebGL is unavailable (`"CRT requires WebGL"`) — the mount must be wrapped in try/catch with the poster fallback. Alternative if it reads too retro: `condensation` (also three-free, same raw-WebGL pattern). |
| Landing primary CTA | **`lumen-cta`** | `LumenCta.tsx`, `lumen-cta.css` (~2.2KB) | Pure CSS, no canvas. Only on the first-run landing; everywhere else the primary action is a shadcn `Button`. |
| Capstone-complete ceremony | **`spark-badge`** | `SparkBadge.tsx` (~1.4KB) | Fires once, when the final capstone stage flips to `done`. The single most emotionally important moment in the app. |
| `/about` heading, and the landing H1 | **`article-headings`** | `articleHeadingDecode.ts` (~3.3KB) | **Verified three-free and import-free.** A DOM text-decode effect over a character pool, so it is cheap enough for any route. Still honours reduced-motion by rendering the final string immediately. |

Explicitly **not** used: every full-screen background other than the hero one, `shader-buttons`, `circle-buttons`, `rectangle-buttons`, `liquid-metal-button`, `skeuomorphic-toggle`, `uplink-loader`. Loading states are CSS skeletons; toggles and buttons are shadcn.

### 7.2 Hard rules

1. **One WebGL surface mounted at a time, app-wide.** Enforce with a module-level singleton guard that refuses a second mount and logs in dev.
2. **Forbidden routes:** `/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone` (except the one-shot completion ceremony), and `/` in returning-learner state. No exceptions.
3. **Lazy only.** `React.lazy` + dynamic import for the canvas components, so the hero chunk never enters the app-shell graph. A build assertion fails if any vendored canvas module appears in the main chunk, or if `three` appears in the bundle at all (it should never be installed — see §7.0).
4. **Never blocks LCP.** Hero headline, eyebrow, and CTA paint from the static poster. The canvas fades in afterwards over `--dur-slow`.
5. **Poster-first on constrained devices.** Serve a static WebP first-frame poster instead of mounting the canvas when any of: viewport `< 768px`, `navigator.hardwareConcurrency <= 4`, `navigator.deviceMemory <= 4`, `connection.saveData === true`, or `prefers-reduced-motion: reduce`. Phones get the *look*, not the render loop — this is how "equal weight to mobile and desktop" is honoured without cooking the device.
6. **Pause aggressively.** `IntersectionObserver` pauses the render loop off-screen; `visibilitychange` pauses on tab blur. A paused loop must not `requestAnimationFrame`.
7. **FPS guard.** Sample frame time for 2s after mount; if sustained below 30fps, unmount the canvas and swap to the poster. (ThreeUI ships a `PreviewFpsMeter` worth reading for reference.)
8. **No full-HTML-document components.** Several ThreeUI components render complete HTML docs and expect runtime files at root-relative URLs. None of the four approved components do, and that is part of why they were chosen. Do not substitute a component that does.
9. **WebGL context loss.** `crtRenderer` throws rather than returning null when `getContext("webgl")` fails. Wrap the mount in try/catch and also handle the `webglcontextlost` event by unmounting to the poster. The learner never sees an error.

### 7.3 Performance budgets

| Scope | JS (gzipped, first load) | Target |
|---|---|---|
| App shell + any learning route (`/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`) | **≤ 160KB** | Lighthouse mobile ≥ 90, LCP < 2.0s on throttled 4G |
| First-run landing + `/about` (lazy canvas chunk, loaded after LCP) | **+ ≤ 25KB** | Lighthouse mobile ≥ 90; LCP paints from the poster regardless |

The 160KB figure is deliberately *tighter* than the original PRD's 200KB: WebGL is quarantined to two routes and, per §7.0, Three.js is never installed at all.

The +25KB figure replaces an earlier +260KB allowance that assumed Three.js. Since all four approved components are three-free and total ~12–15KB gzipped, the atmosphere layer is close to free. **Do not spend the difference** — it was never headroom, it was a wrong assumption.

---

## 8. Accessibility (non-negotiable)

- Contrast verified in **both** modes. Every value in §2 is pre-checked; any new color must be checked before merge.
- Focus: `outline: 2px solid var(--accent-primary); outline-offset: 2px`. Never `outline: none` without a replacement. Focus is visible on every interactive element including cards and filmstrip frames.
- Touch targets ≥ **48×48px** with ≥ 8px separation. The week checklist checkbox has a 48px hit area even though the visual box is 20px.
- Skip-to-content link as the first focusable element.
- Keyboard: the week checklist is arrow-navigable; the library command palette opens on `/` and `⌘K`; Escape closes every overlay; tab order matches visual order.
- `aria-live="polite"` on progress changes ("Week 7 complete, 7 of 16") and on library result counts.
- Icon-only buttons carry `aria-label`. Icons come from **Lucide** only — no emoji, ever.
- All imagery has alt text; decorative canvases and grain overlays are `aria-hidden`.
- `prefers-reduced-motion` honoured per §4.

---

## 9. shadcn/ui component inventory

Install only these: `button` · `checkbox` · `card` · `badge` · `tabs` · `accordion` · `dialog` · `command` · `sheet` · `progress` · `separator` · `tooltip` · `sonner` · `select` · `toggle-group` · `scroll-area` · `skeleton` · `switch` · `alert` · `table` · `popover` · `collapsible` · `textarea`.

Mapping to app needs: `command` → library fuzzy search · `toggle-group` → library filter chips · `sheet` → mobile nav + mobile filters · `progress` → week/capstone progress (restyled to the filmstrip) · `textarea` → per-assignment notes · `table` → library's accessible table alternative to the card grid · `sonner` → export/import and link-check feedback.
