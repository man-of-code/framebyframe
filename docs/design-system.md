# Frame by Frame — Design System v2 ("Kinetoscope")

**Status:** Locked 2026-10-27. Replaces v1 "Night Interior" (in git history before commit `00afb5d`). Implementers transcribe; they do not re-decide. A value that is not here is a question for the user, not a choice.
**Companions:** `docs/prd.md` (product), `docs/redesign-plan.md` (phases R0–R5).

Direction: **Kinetoscope** — a Victorian playbill for the year cinema was born (1895), printed in pop-art halftone, read through a retro-futurist instrument panel, under an aurora sky. Loud at the edges, quiet where the learner reads.

---

## 1. Five styles, five jobs

A style appears only in its own layer. A surface that needs a style outside its layer is a spec change, not an implementation choice.

| Layer | Style | Owns | Never touches |
|---|---|---|---|
| **Structure & type** (lead) | Victorian playbill | Display face, page titles, fleurons, double rules, playbill frames, centred title blocks on hero-like headers | Body copy, tables, form controls |
| **Interaction & status** | Pop art | Buttons, chips, badges, toggles, checkboxes: flat saturated fills, ink outlines, hard offset shadows, Ben-Day halftone shadows | Anything behind text; long-form surfaces |
| **Data & numerals** | Retro-futurist | Mono HUD readouts (`WK 07 / 16`, hours, counts), corner-bracket frames, faint grid bands, the CRT hero canvas | Headings, prose |
| **Atmosphere** | Aurora | Large gradient fields behind the landing hero, route header bands, and the capstone ceremony | Cards, controls, anything carrying meaning |
| **Medium** | Retro film | Filmstrip rail, sprockets, splice gap, grain (dark only), clapper stripe | — |

**Where it is quiet:** resource cards, tables, the notes field, done-when lists and every `--container-prose` surface are plain: surface colour, a border, Inter text. The blend is the frame around the reading, never the reading.

---

## 2. Colour

All tokens are semantic, defined for both themes with identical names. Components never reference a raw hex. Token names carry over from v1 where the meaning carried over, so `--accent-primary` is **action** and `--accent-warm` is **brass**.

### 2.1 One hue per meaning

| Meaning | Hue | Token(s) | Notes |
|---|---|---|---|
| **Action** — links, primary button, focus ring, selected filter | Aurora teal | `--accent-primary`, `--pop-teal` (fill) | The only teal on the site |
| **Progress & completion** — exposed frames, current week numeral, checked checkbox, capstone done, ceremony | Brass (amber-copper) | `--accent-warm`, `--brass-fill` | Never on a link, button, filter, nav item, or ornament |
| Success / free / done-when met | Pop lime | `--status-ok`, `--pop-lime` | |
| Warning / freemium / gray area / email-gated | Pop yellow | `--status-warn`, `--pop-yellow` | Hue 52°, kept clear of brass (30°); badges always carry icon + text |
| Danger / dead link / import failure | Pop red | `--status-danger`, `--pop-red` | |
| Paid / benchmark-only | Pop magenta | `--status-paid`, `--pop-magenta` | |
| Experimental | Aurora violet | `--status-exp`, `--pop-violet` | |

There is **no pop cyan**: it would sit next to action teal and read as a link.

### 2.2 Dark — "Night show" (default)

| Token | Hex | Use |
|---|---|---|
| `--bg-base` | `#0E0B16` | Page — ink-violet black |
| `--bg-raised` | `#17121F` | Cards, sections |
| `--bg-overlay` | `#201A2B` | Dialogs, sheets, palette, popovers |
| `--bg-inset` | `#0A0811` | Input wells, table header, filmstrip track |
| `--bg-hover` | `#1D1727` | Row/card hover |
| `--border-subtle` | `#2A2236` | Dividers, table rules, HUD grid lines |
| `--border-default` | `#3A3049` | Card and input borders |
| `--border-strong` | `#6A5C80` | Focused input, ornament rules (3.34:1 on base) |
| `--text-primary` | `#F2E8D5` | Paper — headings, body |
| `--text-secondary` | `#CDBFA8` | Supporting copy |
| `--text-tertiary` | `#9C9080` | Meta, counts (≥5.40:1 on every surface) |
| `--accent-primary` | `#4FE0C2` | Action |
| `--accent-primary-hover` | `#7AEBD3` | |
| `--accent-primary-active` | `#33C7A9` | |
| `--accent-primary-wash` | `rgba(79,224,194,0.12)` | Active nav background |
| `--accent-primary-edge` | `rgba(79,224,194,0.36)` | |
| `--accent-warm` | `#F0A04B` | Brass — text, icons, fills |
| `--brass-fill` | `#F0A04B` | |
| `--accent-warm-wash` | `rgba(240,160,75,0.16)` | Exposed frame fill |
| `--accent-warm-edge` | `rgba(240,160,75,0.40)` | |
| `--status-ok` | `#9BE15D` | |
| `--status-warn` | `#FFE14D` | |
| `--status-danger` | `#FF6B6B` | |
| `--status-paid` | `#FF5FAE` | |
| `--status-exp` | `#A98BFF` | |
| `--pop-ink` | `#0E0B16` | Text and outlines **on pop fills** |
| `--pop-outline` | `#F2E8D5` | Outline of unfilled pop controls on dark surfaces |
| `--pop-shadow-color` | `#F2E8D5` | Offset shadows: paper "misregistration" on ink |
| `--ornament` | `#6A5C80` | Rules, frames, fleurons (= `--border-strong`) |
| `--grain-opacity` | `0.03` | §5.6 |

### 2.3 Light — "Matinee paper"

| Token | Hex | Notes |
|---|---|---|
| `--bg-base` | `#F5EDDC` | Playbill paper, never pure white |
| `--bg-raised` | `#FFF9EE` | |
| `--bg-overlay` | `#FFFDF7` | |
| `--bg-inset` | `#EDE3CE` | |
| `--bg-hover` | `#EFE5D0` | |
| `--border-subtle` | `#E0D4BC` | |
| `--border-default` | `#C9B99C` | |
| `--border-strong` | `#8F7F66` | 3.20:1 on base |
| `--text-primary` | `#1B1424` | Ink |
| `--text-secondary` | `#4A3F52` | |
| `--text-tertiary` | `#625667` | |
| `--accent-primary` | `#06695A` | Dark teal; the bright teal fails on paper |
| `--accent-primary-hover` | `#055A4D` | |
| `--accent-primary-active` | `#044C41` | |
| `--accent-primary-wash` | `rgba(6,105,90,0.10)` | |
| `--accent-primary-edge` | `rgba(6,105,90,0.32)` | |
| `--accent-warm` | `#8A5500` | Brass **text and icons** |
| `--brass-fill` | `#F0A04B` | Brass **fills** stay bright in both themes |
| `--accent-warm-wash` | `rgba(240,160,75,0.22)` | |
| `--accent-warm-edge` | `rgba(138,85,0,0.40)` | |
| `--status-ok` | `#2F6B12` | Status **text**; fills use the pop fills |
| `--status-warn` | `#7A5F00` | |
| `--status-danger` | `#B3261E` | |
| `--status-paid` | `#A3105E` | |
| `--status-exp` | `#5B3CC4` | |
| `--pop-ink` | `#1B1424` | |
| `--pop-outline` | `#1B1424` | |
| `--pop-shadow-color` | `#1B1424` | Classic ink offset |
| `--ornament` | `#8F7F66` | |
| `--grain-opacity` | `0` | Grain is off in light mode |

### 2.4 Pop fills (both themes)

Fills are identical in both themes and always carry `--pop-ink` text (every pair ≥ 6.4:1, lowest is ink on magenta):

| Token | Hex |
|---|---|
| `--pop-teal` | `#4FE0C2` |
| `--pop-lime` | `#9BE15D` |
| `--pop-yellow` | `#FFE14D` |
| `--pop-red` | `#FF6B6B` |
| `--pop-magenta` | `#FF5FAE` |
| `--pop-violet` | `#A98BFF` |

### 2.5 Aurora

Three radial fields over `--bg-base`, never over a card:

```css
--aurora-teal: rgba(79,224,194,var(--aurora-strength));
--aurora-violet: rgba(123,92,255,var(--aurora-strength));
--aurora-magenta: rgba(255,79,163,var(--aurora-strength));
--aurora-strength: 0.30;   /* dark */
--aurora-strength: 0.22;   /* light */
```

At those strengths `--text-primary` and `--text-secondary` stay ≥ 5.3:1 over the strongest single field in both themes (computed). Fields may overlap; the overlap must stay under `--aurora-strength` per channel, so each field fades to transparent by 60% of its radius.

### 2.6 Colour rules

1. Brass is reserved for progress and completion. Ornaments, the clapper stripe, buttons, links and nav are never brass.
2. Colour is never the only signal: badges have icon + text, exposed frames have a check, the current week has `aria-current`.
3. No gradient carries meaning. Aurora is atmosphere only.
4. Elevation: dark lifts with border + lighter surface; overlays add the pop offset shadow (`--shadow-overlay`). Light lifts with the ink offset shadow. No blurred drop shadows anywhere — this is print, not glass.
5. Every text/background pair above is asserted ≥ 4.5:1 (non-text UI ≥ 3:1) by `src/styles/tokens.contrast.test.ts` (R2). A new colour without a test row does not merge.

---

## 3. Typography

### 3.1 Families (self-hosted woff2, latin + latin-ext, OFL texts beside the files)

| Role | Family | Rules |
|---|---|---|
| Display & titles | **Abril Fatface** 400 | Victorian fat face. One weight only: `font-weight: 400; font-synthesis: none` on every element that uses it. Never bold, never italic. Preload this file only. Replaces Archivo Expanded. |
| Body / UI | **Inter** variable | Unchanged from v1. |
| HUD / numerals | **JetBrains Mono** 400/500 | Unchanged. `font-variant-numeric: tabular-nums` on every readout. |

Fallback stacks: `"Abril Fatface", "Didot", "Bodoni 72", Georgia, serif` / `Inter, system-ui, -apple-system, sans-serif` / `"JetBrains Mono", ui-monospace, monospace`.

**No small caps.** Neither self-hosted Inter nor JetBrains Mono contains `smcp` (measured: identical widths with `font-synthesis: none`). Eyebrows are uppercase + tracking. Faked small caps are forbidden.

### 3.2 Scale

| Token | Size | LH | Tracking | Face | Use |
|---|---|---|---|---|---|
| `--text-display` | `clamp(2.75rem, 10vw, 6.5rem)` | 1.0 | `0` | Abril | Landing H1 only |
| `--text-h1` | `clamp(1.875rem, 5vw, 3.25rem)` | 1.08 | `0` | Abril | Page and week titles |
| `--text-h2` | `clamp(1.5rem, 3.2vw, 2.125rem)` | 1.15 | `0` | Abril | Module heads, Watch/Read/Do heads |
| `--text-h3` | `1.25rem` | 1.3 | `-0.01em` | Inter 600 | Card titles |
| `--text-body-lg` | `clamp(1.0625rem, 1.4vw, 1.1875rem)` | 1.65 | `0` | Inter | Prose |
| `--text-body` | `1rem` | 1.6 | `0` | Inter | Default, 16px floor |
| `--text-sm` | `0.875rem` | 1.5 | `0` | Inter | Meta |
| `--text-eyebrow` | `0.75rem` | 1.2 | `0.16em` | Inter 600, uppercase | `MODULE IV · CINEMATOGRAPHY` |
| `--text-mono` | `0.875rem` | 1.5 | `0` | Mono | HUD readouts |

Every Abril heading also sets `overflow-wrap: break-word; text-wrap: balance`. Week titles are topic lists with long slash-joined tokens (`movement/angles/framing,`); without `break-word` they overflow at 360px. R3 checks the two longest titles and "Marketing, Distribution and Career" at 360px.

Measure: body `65ch`, hard max `72ch`.

### 3.3 Typographic motifs

- **Playbill title block** (hero-like headers only: landing hero, week header, plan intro, capstone header, about): eyebrow flanked by fleurons → Abril title → diamond rule. Centred.
- **Working headers** (library, toolkit, dashboard sections, legal pages): eyebrow → Abril title, left-aligned, no fleurons. Dense pages are not posters.
- **Module numerals in Roman** in eyebrows only (`MODULE IV`), Arabic everywhere else, and always Arabic in HUD readouts.
- **HUD readouts:** `WK 07 / 16`, `~8h`, `41 / 96 tasks` in mono, tabular; current-week number in brass.

---

## 4. Layout, spacing, shape, motion

**Spacing (4px base):** `4 8 12 16 24 32 48 64 96 128` as `--space-1`…`--space-10` (unchanged).
**Containers:** `--container-prose: 42rem`, `--container-app: 76rem`. Gutters 16 / 24 (≥640) / 48 (≥1024).
**Breakpoints:** `360` floor · `640` · `768` (tabs → rail) · `1024` · `1440`.

**Shape:** Victorian frames, rules and module heads are square (`0`). Pop controls are slightly rounded.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Chips, badges, buttons, checkboxes |
| `--radius-md` | `6px` | Cards, inputs |
| `--radius-lg` | `8px` | Sheets, dialogs |
| `--radius-full` | `9999px` | Pills (count badges) |

**Pop geometry:**

| Token | Value |
|---|---|
| `--pop-border` | `2px` |
| `--pop-offset` | `3px` |
| `--pop-offset-hover` | `4px` |
| `--pop-offset-press` | `1px` |
| `--shadow-overlay` | `6px 6px 0 var(--pop-shadow-color)` |
| `--halftone-dot` | `1.5px` |
| `--halftone-gap` | `6px` |

**Z-index:** unchanged from v1 — `10` sticky · `20` rail/tabs · `30` popover · `40` sheet · `50` dialog · `60` toast. Grain and aurora sit at `0`/`1` inside their own stacking context.

**Motion:**

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Entering |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Position changes |
| `--dur-fast` | `150ms` | Hover, press, chip toggle |
| `--dur-base` | `220ms` | Cards, popovers |
| `--dur-slow` | `420ms` | Sheets, canvas fade |
| `--dur-ceremony` | `900ms` | Completion |
| `--dur-aurora` | `12s` | Live aurora loop |

Animate `transform` and `opacity` only. Hover never scales. The pop shadow is a pseudo-element, so press and hover are transforms (§5.2). `prefers-reduced-motion: reduce` collapses durations to `1ms` and stops the aurora loop.

---

## 5. Kits

### 5.1 Ornament kit (Victorian) — CSS, not JSX

Ornaments are **CSS utilities** whose shapes are inline SVG data URIs used as `mask-image` with `background-color: var(--ornament)`. They inherit the ornament colour, cost zero JS (the `/week` route has about 6KB of JS headroom), and are invisible to assistive tech by construction. No ornament is ever a React component or an icon font.

| Class | Shape | Size |
|---|---|---|
| `.orn-fleuron` | A hedera leaf (❦ silhouette) drawn as an SVG path; `::before`/`::after` on an eyebrow mirror it either side | `1em` square |
| `.orn-rule` | Hairline, 1px, full width | 1px tall |
| `.orn-rule-double` | Two 1px rules, 3px apart | 5px tall |
| `.orn-rule-diamond` | Hairline with a centred 7px diamond | 9px tall |
| `.playbill-frame` | Double rule border (outer 1px, 3px gap, inner 1px) on all sides, plus a 10px corner square at each corner | — |

`--ornament` is `--border-strong` in both themes: never brass, never teal.

### 5.2 Pop kit (interaction & status)

**Offset shadow:** every pop control has a `::after` layer at `inset: 0`, `transform: translate(var(--pop-offset), var(--pop-offset))`, `z-index: -1`, filled with `--pop-shadow-color`, in the control's own stacking context (`isolation: isolate`).
- Hover: control `translate(-1px, -1px)`, shadow layer `translate(4px, 4px)`.
- Press (`:active`): control `translate(2px, 2px)`, shadow layer `translate(1px, 1px)`.
- Both are transforms over `--dur-fast`.

**Halftone:** `.halftone` paints a Ben-Day dot field: `radial-gradient(circle, var(--pop-shadow-color) var(--halftone-dot), transparent calc(var(--halftone-dot) + 0.5px))` tiled at `var(--halftone-gap)`. It is used **only** as the fill of an offset-shadow layer (selected chips, the primary button on hover), so the dots sit outside the label's box. A halftone never sits under text.

| Control | Rest | Selected / checked |
|---|---|---|
| **Primary button** | `--pop-teal` fill, `--pop-ink` text, 2px `--pop-ink` border, solid offset shadow | Hover: halftone shadow |
| **Secondary button** | transparent fill, `--text-primary` text, 2px `--pop-outline` border, no shadow | Hover: `--bg-hover` |
| **Filter chip** | `--bg-raised`, 2px `--border-default`, `--text-primary` | `--pop-teal` fill, `--pop-ink` text, 2px `--pop-ink` border, **halftone** offset shadow, check icon |
| **Badge** | Pop fill per §2.1, `--pop-ink` text, 1.5px `--pop-ink` border, Lucide icon + word, no shadow | — |
| **Checkbox** | 20px box (48px hit area), 2px `--pop-outline` border, `--radius-sm` | `--brass-fill`, `--pop-ink` check (checked is progress) |
| **Toggle / segmented** | Secondary button style | `--pop-teal` fill, ink text, ink border |
| **Nav item** | Text + icon | Active: `--accent-primary-wash` fill + 2px `--accent-primary` left bar (rail) / top bar (tabs). Never brass, no pop shadow. |

Focus is always `outline: 2px solid var(--accent-primary); outline-offset: 3px` (offset 3px clears the pop border).

### 5.3 HUD kit (retro-futurist)

- `.hud-frame`: four corner brackets, 10px arms, 1px `--border-strong`, drawn with four background linear-gradients (no extra elements). Used around readouts: week numeral in the rail and mobile bar, dashboard progress line, library result count, plan intro count.
- `.hud-readout`: mono, `--text-mono`, tabular nums, `--text-secondary`; the live figure inside it in `--text-primary` (or brass when it is the current week).
- `.hud-grid`: 1px `--border-subtle` lines every 24px at 40% opacity. Only inside header bands and the hero; never behind body copy, cards or tables.
- The CRT hero canvas (§7) is the HUD's one moving element.

### 5.4 Aurora kit

- `.aurora`: three radial-gradient fields (§2.5) on a `::before` at `z-index: 0`; children render at `z-index: 2`, grain (dark) at `1`. Field placement: teal at 15% 20%, violet at 80% 10%, magenta at 60% 90%; each radius 60% of the box's larger side.
- `.aurora--live`: the field layer is 140% of the box, centred, animated with `transform: translate3d(...) rotate(...)` over `--dur-aurora`, `alternate`, `infinite`. Allowed on the landing hero and the ceremony only. Paused when off-screen (`IntersectionObserver` sets `animation-play-state`) and when `document.hidden`. Static under reduced motion.
- Static `.aurora` header bands: `/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`, `/about`, dashboard. The band is the page header only (eyebrow + title), never the content area.

### 5.5 Film kit (retro medium)

| Device | Implementation |
|---|---|
| **Filmstrip rail** | Unchanged structure. Sprockets `--bg-inset` holes on `--border-default`; exposed frames `--accent-warm-wash` + brass check; current frame 2px `--accent-warm` border + `aria-current="step"`; unexposed `--border-subtle`; splice gap before week 13. Frame numerals are HUD mono. |
| **Clapper stripe** | Replaces v1's brass "slate rule" on the assignment card: a 6px top band of 45° diagonal stripes in `--pop-ink`/`--text-primary` (dark) and `--pop-ink`/`--bg-raised` (light). Not brass. |
| **Letterbox** | Retired. The week header, plan module heads and landing hero use `.playbill-frame` instead. The `Letterbox` component is removed in R3 once nothing uses it. |

### 5.6 Grain

Unchanged mechanism from v1 §5.3 (per-surface `.grain`, 128px CSS-pixel `feTurbulence` tile, `z-index: 1`, text at `2`, static, `mix-blend-mode: overlay`), opacity `0.03` dark, `0` light. It is applied wherever `.aurora` is applied, because it also dithers aurora banding on 8-bit panels. Not on cards, tables, forms or prose.

---

## 6. Surfaces map

| Surface | Victorian | Pop | HUD | Aurora | Film |
|---|---|---|---|---|---|
| Shell: left rail | Brand in Abril; `orn-rule` between groups | Theme toggle segmented | Week numeral in `.hud-frame` | — | Filmstrip rail |
| Shell: bottom tabs, mobile bar | — | — | Week numeral readout | — | — |
| More sheet, dialogs, palette | Title in Abril | Buttons; `--shadow-overlay` | — | — | — |
| Toasts | — | Pop border + offset shadow; status colour as left bar | — | — | — |
| Landing hero | Playbill title block in `.playbill-frame`, display size | Primary CTA (Lumen, restyled through props/tokens) | `.hud-grid`; CRT canvas framed as the "screen" | `.aurora--live` + grain | — |
| Landing below the fold | Working headers, `orn-rule-diamond` between sections | Start-date form controls | Module week ranges | — | Module filmstrip |
| Dashboard | Working headers | Primary "Open this week" | Progress line in `.hud-frame` | Static band | Filmstrip |
| `/plan` | Playbill title block; module heads in `.playbill-frame` with Roman eyebrows | — | Hours, ratios | Static band | Card frames, splice |
| `/week/:n` | Playbill title block in `.playbill-frame`; Abril section heads | Checkboxes (brass checked), badges | Hours, timecode | Static band | Clapper stripe on assignment |
| `/library` | Working header | Chips, badges, view toggle, palette | Result count in `.hud-frame` | Static band | — |
| `/toolkit` | Working header | Badges | First-week column mono | Static band | — |
| `/capstone` | Playbill title block | Status segmented control | Stage `NN / 08` readouts | Static band | Vertical filmstrip of stages |
| Capstone ceremony | `.playbill-frame` around the badge | Continue button | — | `.aurora--live` + grain | — |
| `/about`, legal, contact, thank-you, 404 | Working header; decode heading on about | Buttons, form controls | — | Static band (about only) | — |
| Cookie banner, sticky CTA | — | Buttons, 2px pop border, offset shadow | — | — | — |
| Resource card, gap card | Title Inter 600 | Badges only | Verified date, minutes mono | — | — |

---

## 7. ThreeUI governance (unchanged from v1 except styling)

Vendored, never installed; files in `src/vendor/threeui/` stay unmodified and are restyled only through props and tokens. Approved surfaces: CRT (landing hero), Lumen CTA (landing primary action), SparkBadge (capstone ceremony), `articleHeadingDecode` (landing H1, `/about` H1). One WebGL surface at a time; forbidden on learning routes and on `/` for a returning learner; lazy only; never blocks LCP; poster-first on constrained devices (viewport < 768, ≤ 4 cores, ≤ 4GB memory, save-data, reduced motion); pause off-screen and on hidden tab; 2s FPS guard below 30fps; unmount to poster on context loss. The poster is recaptured in R4 against the new hero.

### 7.3 Performance budgets

| Scope | JS gzipped, static graph before first paint | Target |
|---|---|---|
| App shell + any learning route (`/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`) | **≤ 160KB**, enforced per route by `scripts/assert-bundle.ts` | Lighthouse mobile ≥ 90, LCP < 2.0s on throttled 4G |
| Landing + `/about` canvas chunk, after LCP | + ≤ 25KB | Lighthouse mobile ≥ 90 |

"Static graph before first paint" is the entry plus the route's static imports. Chunks loaded from a mount effect (deferred chrome, the Fuse index) are outside it; R0.1 records the 3-second totals. Fonts and CSS are not in the JS budget, which is why ornaments, halftone, HUD frames and aurora are CSS. Headroom after R0: `/week/:n` ≈ 6KB, `/library` ≈ 12KB, `/plan` ≈ 30KB. `ENTRY_GZIP_LIMIT` and `LEARNING_ROUTES` are not changed to make a phase pass; a miss is reported.

---

## 8. Accessibility (non-negotiable)

- Contrast in both themes, enforced by the R2 contrast test; aurora and pop pairs included.
- Focus: `outline: 2px solid var(--accent-primary); outline-offset: 3px`, visible on every interactive element including filmstrip frames and chips.
- Touch targets ≥ 48×48px, ≥ 8px apart; the offset shadow does not count toward the target and needs its own 3px clearance inside the 8px gap.
- Skip link first. `/` and ⌘K open the palette. Escape closes every overlay and focus returns to its trigger. Radio groups are one tab stop with arrows that stop at the ends.
- `aria-live="polite"` on progress changes and result counts.
- Lucide icons only, no emoji. Ornaments, grain, aurora and canvases are decorative and invisible to assistive tech.
- `prefers-reduced-motion` honoured per §4 and §5.4.

---

## 9. shadcn/ui inventory

Unchanged from v1: `button` · `checkbox` · `card` · `badge` · `tabs` · `accordion` · `dialog` · `command` · `sheet` · `progress` · `separator` · `tooltip` · `sonner` · `select` · `toggle-group` · `scroll-area` · `skeleton` · `switch` · `alert` · `table` · `popover` · `collapsible` · `textarea`, plus `input`, `input-group` and `toggle` as dependencies. Primitives get the pop treatment through tokens and variant classes in R2; their behaviour and accessibility wiring are not rewritten.
