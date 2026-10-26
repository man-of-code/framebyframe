# Frame by Frame — Design System v2 ("Kinetoscope")

**Status:** Locked 2026-10-27, revised the same day after the R1 cold review (pop-shadow layering, shadcn mapping, pseudo-element ownership, aurora strength, control boundaries), then finalized the same day (ThreeUI additions §7.1, grain map §5.6, rationale §10, open questions §11). Replaces v1 "Night Interior" (in git history before commit `00afb5d`). Implementers transcribe; they do not re-decide. A value that is not here is a question for the user, not a choice.
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
| **Action** — links, primary button, focus ring, selected filter | Aurora teal | `--accent-primary`, `--pop-teal` (fill) | The only teal UI colour (the aurora's teal field is atmosphere, not UI) |
| **Progress & completion** — exposed frames, current week numeral, **every checked checkbox** (tasks and done-when checks), progress bars, capstone done, ceremony | Brass (amber-copper) | `--accent-warm`, `--brass-fill` | Never on a link, button, filter, nav item, or ornament. Carve-out: a filmstrip frame is a link, and brass on it shows the frame's progress state only; its hover, focus and active states are teal |
| Success / free | Pop lime | `--status-ok`, `--pop-lime` | Badges and validation only. Checkboxes are never lime |
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
| `--border-default` | `#3A3049` | Card borders and dividers only. Decorative (1.5:1), never the only boundary of a control |
| `--border-strong` | `#7A6C93` | **Boundary of every input, chip and unfilled control**, ornament rules, HUD frames (4.08 base, 3.85 raised, 3.53 overlay) |
| `--text-primary` | `#F2E8D5` | Paper — headings, body |
| `--text-secondary` | `#CDBFA8` | Supporting copy; eyebrows |
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
| `--ornament` | `#7A6C93` | Rules, frames, fleurons (= `--border-strong`) |
| `--grain-opacity` | `0.03` | §5.6 |

Also defined in both theme blocks of `tokens.css`, with values in their own sections: `--sheen-color` (§5.2), `--grain-film-tile` and `--grain-film-opacity` (§5.6).

### 2.3 Light — "Matinee paper"

| Token | Hex | Notes |
|---|---|---|
| `--bg-base` | `#F5EDDC` | Playbill paper, never pure white |
| `--bg-raised` | `#FFF9EE` | |
| `--bg-overlay` | `#FFFDF7` | |
| `--bg-inset` | `#EDE3CE` | |
| `--bg-hover` | `#EFE5D0` | |
| `--border-subtle` | `#E0D4BC` | |
| `--border-default` | `#C9B99C` | Cards and dividers only (1.65:1) |
| `--border-strong` | `#8F7F66` | Control boundaries (3.34 base, 3.71 raised, 3.83 overlay, 3.05 inset) |
| `--text-primary` | `#1B1424` | Ink |
| `--text-secondary` | `#4A3F52` | |
| `--text-tertiary` | `#625667` | |
| `--accent-primary` | `#06695A` | Dark teal; the bright teal fails on paper |
| `--accent-primary-hover` | `#055A4D` | |
| `--accent-primary-active` | `#044C41` | |
| `--accent-primary-wash` | `rgba(6,105,90,0.10)` | |
| `--accent-primary-edge` | `rgba(6,105,90,0.32)` | |
| `--accent-warm` | `#7E4E00` | Brass **text and icons** (4.94 on the exposed-frame wash over inset, 6.06 on base) |
| `--brass-fill` | `#F0A04B` | Brass **fills** stay bright in both themes |
| `--accent-warm-wash` | `rgba(240,160,75,0.22)` | |
| `--accent-warm-edge` | `rgba(126,78,0,0.40)` | |
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

Three radial fields over `--bg-base`, never over a card. Literal CSS (R2 transcribes it):

```css
--aurora-strength: 0.20;  /* both themes */
--aurora-fields:
  radial-gradient(60% 80% at 15% 20%, rgba(79,224,194,var(--aurora-strength)), transparent 70%),
  radial-gradient(55% 75% at 80% 10%, rgba(123,92,255,var(--aurora-strength)), transparent 70%),
  radial-gradient(60% 80% at 60% 95%, rgba(255,79,163,var(--aurora-strength)), transparent 70%);
```

Strength 0.20 is chosen so that even **all three fields stacked at full strength** keep `--text-primary` ≥ 7.2:1 and `--text-secondary` ≥ 4.86:1 (dark), and ≥ 9.5:1 and ≥ 5.25:1 (light). Overlap therefore never needs to be prevented.

**Only two colours may sit on an aurora band:** `--text-primary` (titles) and `--text-secondary` (eyebrows, the one-line note). No tertiary text, no links, no brass, no HUD readouts, no controls inside a band. The three-field composite is a row in the contrast test.

### 2.6 Colour rules

1. Brass is reserved for progress and completion. Ornaments, the clapper stripe, buttons, links and nav are never brass.
2. Colour is never the only signal: badges have icon + text, exposed frames have a check, the current week has `aria-current`.
3. No gradient carries meaning. Aurora is atmosphere only.
4. Elevation: cards get **no shadow in either theme** (border + surface only — the quiet layer). Overlays (dialog, sheet, palette, popover, toast) add `--shadow-overlay`. No blurred drop shadows and no `backdrop-filter` anywhere — this is print, not glass.
5. Control boundaries (inputs, chips, unfilled buttons, checkboxes, switches) use `--border-strong`, `--pop-ink` or `--pop-outline`, all ≥ 3:1 against their surface. `--border-default` is decoration only.
6. Contrast is asserted by `src/styles/tokens.contrast.test.ts` (R2) over the matrix in §2.8. A new colour without a row does not merge.

### 2.7 shadcn/ui variable mapping

shadcn names are defined **from** the semantic tokens (`var()` aliases, as v1 shipped). `bg-primary` is used by several primitives, so the per-primitive overrides below are part of the mapping, not optional styling.

| shadcn var | Token | Note |
|---|---|---|
| `--background` / `--foreground` | `--bg-base` / `--text-primary` | |
| `--card` / `--card-foreground` | `--bg-raised` / `--text-primary` | |
| `--popover` / `--popover-foreground` | `--bg-overlay` / `--text-primary` | |
| `--primary` / `--primary-foreground` | `--pop-teal` / `--pop-ink` | Bright teal fill with ink text in **both** themes |
| `--secondary` / `--secondary-foreground` | `--bg-inset` / `--text-primary` | |
| `--muted` / `--muted-foreground` | `--bg-inset` / `--text-tertiary` | |
| `--accent` / `--accent-foreground` | `--bg-hover` / `--text-primary` | Hover and highlighted rows; not teal |
| `--destructive` / `--destructive-foreground` | `--pop-red` / `--pop-ink` | Fill; destructive **text** on surfaces uses `--status-danger` |
| `--border` | `--border-default` | Decoration |
| `--input` | `--border-strong` | Control boundary, ≥ 3:1 |
| `--ring` | `--accent-primary` | |
| `--radius` | `--radius-md` (6px) | Primitives that read `--radius-md` get the same value |

Per-primitive overrides (R2):

| Primitive | Override |
|---|---|
| `progress` | Track `--bg-inset` + 1px `--border-strong`; indicator `--brass-fill` (progress is brass, not `--primary`) |
| `checkbox` | Unchecked: 2px `--pop-outline` border, transparent fill. Checked: `--brass-fill` fill, 2px `--pop-ink` border, `--pop-ink` check. No offset shadow |
| `switch` | Off: track `--bg-inset`, 2px `--border-strong`, thumb `--text-secondary`. On: track `--pop-teal`, 2px `--pop-ink`, thumb `--pop-ink` |
| `tabs` / `toggle-group` | Segmented control per §5.2 |
| `badge` | Pop badge per §5.2; never `--primary` |
| `tooltip` | `--bg-overlay`, `--text-primary`, 1px `--border-strong`, `--radius-sm`, no shadow |
| `skeleton` | `--bg-hover`, pulse by `opacity` only |
| `dialog` / `sheet` | Scrim `rgba(14,11,22,0.72)` dark / `rgba(27,20,36,0.40)` light, **no blur**; panel `--bg-overlay`, 2px `--pop-outline` border, `--shadow-overlay`; title Abril 400 (remove `font-medium`/`font-semibold` from `DialogTitle` and `SheetTitle`) |
| `sonner` | `--bg-overlay`, 2px `--pop-outline`, `--shadow-overlay`, a 4px left bar in the status **text** token (`--status-ok`, `--status-danger`, …), never a pop fill (pop yellow on a light overlay is 1.28:1) |
| `input` / `textarea` / `select` | `--bg-inset`, 2px `--border-strong`, placeholder `--text-tertiary`; focus adds the ring, the border stays |

### 2.8 Contrast test matrix

Per theme, every foreground listed is checked against every background on its row:

| Foreground | Backgrounds | Minimum |
|---|---|---|
| `--text-primary`, `--text-secondary`, `--text-tertiary` | base, raised, overlay, hover, inset | 4.5 |
| `--accent-primary`, `--accent-warm`, `--status-ok`, `--status-warn`, `--status-danger`, `--status-paid`, `--status-exp` | base, raised, overlay, hover | 4.5 |
| `--accent-warm` | `--accent-warm-wash` composited over inset and over raised | 4.5 |
| `--pop-ink` | every pop fill and `--brass-fill` | 4.5 |
| `--text-primary`, `--text-secondary` | three-field aurora stack (§2.5) composited over base | 4.5 |
| `--border-strong`, `--accent-primary` (focus ring) | base, raised, overlay, hover, inset | 3.0 |
| `--pop-outline` | base, raised, overlay | 3.0 |
| `--pop-ink` | `--pop-teal` composited with `--sheen-color` at peak (§5.2 sheen) | 4.5 |
| `--text-tertiary`, `--border-strong` (3.0), `--pop-outline` (3.0) | `--bg-base` composited with white at `--grain-film-opacity` (film grain worst pixel, §5.6) | 4.5 unless noted |
| `--text-primary`, `--text-secondary` | three-field aurora stack with overlay-white grain at `--grain-opacity` (band grain worst pixel) | 4.5 |

`--border-default` is deliberately not in the matrix: it is never a control boundary (§2.6 rule 5).

---

## 3. Typography

### 3.1 Families (self-hosted woff2, latin + latin-ext, OFL texts beside the files)

| Role | Family | Rules |
|---|---|---|
| Display & titles | **Abril Fatface** 400 | Victorian fat face. One weight only: `font-weight: 400; font-synthesis: none` on every element that uses it. Never bold, never italic. Preload the **latin** subset file only. Replaces Archivo Expanded. |
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

Every Abril heading also sets `overflow-wrap: break-word; text-wrap: balance`. Week titles are topic lists with long slash-joined tokens (`movement/angles/framing,`); without `break-word` they overflow at 360px. Not yet verified at 360px: R2 renders the two longest week titles and "Marketing, Distribution and Career" at 360px in Abril and records whether any line overflows; R3 rechecks inside the final layouts.

Measure: body `65ch`, hard max `72ch`.

### 3.3 Typographic motifs

- **Playbill title block** (hero-like headers only: landing hero, week header, plan intro, capstone header, about, and the two "intermission cards" 404 and `/thank-you`, §6): eyebrow (`--text-secondary`) flanked by fleurons → Abril title (`--text-primary`) → diamond rule. Centred.
- **Working headers** (library, toolkit, dashboard sections, legal pages): eyebrow (`--text-secondary`) → Abril title, left-aligned, no fleurons. Dense pages are not posters.
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
| `--pop-offset-lg` | `8px` |
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

Ornaments are **CSS utilities**. They cost zero JS and are invisible to assistive tech by construction. No ornament is ever a React component or an icon font. Colour is always `--ornament`.

| Class | Construction | Size |
|---|---|---|
| `.orn-fleuron` | Applied to an **eyebrow**: its own `::before`/`::after` (`content: ""`) carry a hedera-leaf SVG as `mask-image` + `-webkit-mask-image`, `background-color: var(--ornament)`; `::after` mirrored with `scaleX(-1)` | `1em` square |
| `.orn-rule` | `border-top: 1px solid var(--ornament)`. Hairlines are borders, never masks (masked 1px lines blur at fractional DPR) | 1px |
| `.orn-rule-double` | `border-top` + `border-bottom`, 1px each, `height: 3px` between | 5px |
| `.orn-rule-diamond` | A `linear-gradient` hairline as background, plus a centred 7px diamond drawn as a rotated square on the element's own `::before` (a stretched mask would distort the diamond) | 9px |
| `.playbill-frame` | **Background layers only — no pseudo-elements, no mask** (a mask on a container masks its children). Double rule: `border: 1px solid var(--ornament)` plus `box-shadow: inset 0 0 0 4px <surface>, inset 0 0 0 5px var(--ornament)`; corner squares: four 10px `linear-gradient` layers at the corners | — |
| `.orn-seal` | Guilloché seal (§5.1.1). An **empty** `<div class="orn-seal" aria-hidden="true">` (no children, so its own mask is safe): `display: block; aspect-ratio: 1; margin-inline: auto; background-color: var(--ornament); mask: url("../assets/ornaments/guilloche-seal.svg") center / contain no-repeat;` plus the identical `-webkit-mask`. `@media (forced-colors: active) { display: none }` | `240px` wide; `320px` at ≥ 640; `min(64vw, 280px)` in the static ceremony |

SVG data-URI rules: encode `#` as `%23`; give paths an opaque fill (`currentColor` inside a data URI resolves to black, so colour comes from `background-color`); emit both `mask-*` and `-webkit-mask-*`. In forced-colors mode ornaments disappear; acceptable, because they are decorative.

**Pseudo-element ownership** (one owner per pseudo-element, so nothing collides):

| Element | `::before` | `::after` |
|---|---|---|
| Pop control | fill + border + radius (z −1) | offset shadow (z −2) |
| Primary pop button's `.sheen` child span (§5.2) | the sweep gradient | — |
| Aurora band (`.aurora`) | aurora fields (z 0) | grain, dark only (z 1) |
| Eyebrow with fleurons | left fleuron | right fleuron |
| `.orn-rule-diamond` | diamond | — |
| `.playbill-frame` | — (none) | — (none) |
| `.orn-seal` | — (none; the mask is on the element itself) | — (none) |
| `.grain` and `.grain.grain--film` surface (§5.6) | grain | — |

An aurora band does **not** also carry `.grain` or `.grain--film`, and `.grain--film` is never put on an aurora element itself; the band paints its own grain on `::after`. A `.grain--film` element may sit inside a band only as an opaque, text-free child (§5.6 rule 3).

#### 5.1.1 Guilloché seal asset

A static engraving in the banknote/lathe tradition (the Victorian layer's one large ornament). The geometry is lifted from ThreeUI's Kinetic Lathe certificate (§7.1 row 5); nothing is vendored and nothing runs at runtime.

- **Generator:** `scripts/gen-guilloche-seal.ts` (dev-only, run by hand, never imported by the app). Its output `src/assets/ornaments/guilloche-seal.svg` is committed. Header comment in both: `Geometry adapted from MengTo/threeui@68802d5428071ada5c20db8094b1649e6bb770ed src/shaders/neuform-isolated/sources/kinetic-lathe-certificate.html rosette() (MIT, see src/vendor/threeui/LICENSE).`
- **Canvas:** `viewBox="0 0 1000 1000"`, centre (500, 500), `R = 480`.
- **Base curve** `P(a, d, m, N)`: for `i = 0 … N−1`, `t = 2πi/N`, `x = 500 + a·cos t + d·cos(m·t)`, `y = 500 + a·sin t − d·sin(m·t)`, each to 1 decimal, written `M x y L x y … Z`.
- **`<defs>`:** `<path id="o" d="P(314.4, 103.2, 11, 360)"/>` and `<path id="i" d="P(160.8, 55.2, 19, 300)"/>`.
- **Copies** (a phase shift φ of the upstream curve equals a rigid rotation by `−φ/(m+1)`, verified to 1e-12): each copy is `<use href="#o|#i" transform="translate(500 500) rotate(θ) scale(s) translate(-500 -500)"/>`, θ in degrees to 3 decimals, s to 4 decimals.
  - Outer, `k = 0 … 17`: `φ = 0.2 + 2πk/18`, `θ = deg(−φ/12)`, `s = 1 − 0.035·k/18`.
  - Inner, `k = 0 … 13`: `φ = 0.9 − 2πk/14`, `θ = deg(−φ/20)`, `s = 1 − 0.05·k/14`.
- **Paint:** one `<g fill="none" stroke="#000" stroke-width="1.4">` holding the outer copies in `<g stroke-opacity="0.5">`, the inner copies in `<g stroke-opacity="0.5">`, then four circles at (500, 500): `r="446.4" stroke-width="3"`, `r="465.6" stroke-width="6"`, `r="33.6" stroke-width="3"`, `r="19.2" stroke-width="2"`.
- **Expected output:** about 12.1KB raw, 3.4KB gzip, 32 `<use>` elements. A unit test asserts the file exists, is under 16KB, and contains exactly 32 `<use`.
- Colour comes only from `background-color: var(--ornament)` through the mask, so it follows the theme with no extra work.

### 5.2 Pop kit (interaction & status)

**Offset shadow — layering that actually paints.** A pop control has `position: relative; isolation: isolate` and **no background or border of its own**. Inside its stacking context:
- `::before`: `inset: 0; z-index: -1`; carries the fill, the border and the radius.
- `::after`: `inset: 0; z-index: -2`; carries the solid `--pop-shadow-color` shadow, `transform: translate(var(--pop-offset), var(--pop-offset))`, same radius.
- The label (text and icon) paints above both.

(A shadow at `z-index: -1` on an element whose own background holds the fill would paint *over* that fill: negative-z children of a stacking context paint above its root's background.)

States, all transforms over `--dur-fast`:
- Hover: control `translate(-1px, -1px)`; shadow layer at `--pop-offset-hover`.
- Press (`:active`): control `translate(2px, 2px)`; shadow at `--pop-offset-press`.
- **`:focus-visible`: the shadow layer goes to `opacity: 0`**, so the ring is never drawn across the paper or ink slab.
- Disabled (`:disabled`, `aria-disabled="true"`, and every progress control while storage is read-only): `--text-tertiary` label, `::before` fill `--bg-inset` with 2px `--border-subtle`, shadow `opacity: 0`, no hover/press transforms, `cursor: not-allowed`.

**Halftone:** `.halftone` paints a Ben-Day dot field: `radial-gradient(circle, var(--pop-shadow-color) var(--halftone-dot), transparent calc(var(--halftone-dot) + 0.5px))` tiled at `var(--halftone-gap)`. A 3–4px shadow sliver shows almost no dots, so halftone is **not used on controls**. It is the offset shadow (at `--pop-offset-lg`) of exactly two large blocks: the landing hero's playbill frame and the dashboard's current-week card. It sits outside the text box; a halftone never sits under text.

**Raised vs latched.** Action buttons are always drawn *raised* (shadow at `--pop-offset`). Selected chips and selected segments are drawn *latched*: fixed in the pressed position (control `translate(2px, 2px)`, shadow at `--pop-offset-press`), with a check icon and `aria-pressed`/`aria-checked`. That, not hue alone, separates "do this" from "this is on".

| Control | Rest | Selected / checked |
|---|---|---|
| **Primary button** | `--pop-teal` fill, `--pop-ink` text, 2px `--pop-ink` border, raised solid shadow | — (always raised) |
| **Secondary button** | transparent fill, `--text-primary` text, 2px `--pop-outline` border, no shadow | Hover: `--bg-hover` fill |
| **Filter chip** | `--bg-raised`, 2px `--border-strong`, `--text-primary`, no shadow; hover `--bg-hover` | **Latched**: `--pop-teal` fill, `--pop-ink` text, 2px `--pop-ink` border, solid shadow at `--pop-offset-press`, check icon, `aria-pressed="true"` |
| **Badge** | Pop fill per §2.1, `--pop-ink` text, 1.5px `--pop-ink` border, Lucide icon + word, no shadow | — |
| **Checkbox** | 20px box (48px hit area), 2px `--pop-outline` border, `--radius-sm`, no shadow | `--brass-fill` fill, 2px `--pop-ink` border, `--pop-ink` check, for every checkbox including done-when checks (checked is progress) |
| **Toggle / segmented** (theme toggle, Cards/Table, capstone status, tabs) | Secondary button style | **Latched** teal, as the selected chip |
| **Nav item** | Text + icon | Active: `--accent-primary-wash` fill + 2px `--accent-primary` left bar (rail) / top bar (tabs). Never brass, no pop shadow. |

Focus is always `outline: 2px solid var(--accent-primary); outline-offset: 3px`; the shadow layer hides while focused, so the ring never crosses it.

**Sheen (a light leak across the primary button on hover).** A technique lifted from ThreeUI (§7.1 row 6), applied to the **primary pop button only**: shadcn `Button` with `data-variant="default"`. It is not used on the Lumen CTA (which has its own effect), secondary buttons, chips, badges, toggles, checkboxes or filmstrip frames.
- Primary actions that are links today (`.page-button` in `NotFound.tsx`, `CeremonyBadge.tsx` and the other R4 pages) migrate to `<Button asChild>` + `ButtonSheen` in R4. This keeps one selector. R2 builds `ButtonSheen` and `sheen.css`, and R4 runs the seal generator (§5.1.1).
- Markup: `Button` renders `<span className="sheen" aria-hidden="true" />` as its first child when `variant === "default"` and `asChild` is false. For `asChild` (links), R2 exports `ButtonSheen` (that same span) and the caller places it as the first child of the slotted element.
- The span sits at `z-index: -1`, after the control's `::before` in tree order. It therefore paints over the fill and under the label, and the label needs no wrapper.
- `--sheen-color`: dark `color-mix(in srgb, var(--text-primary) 38%, transparent)`, light `color-mix(in srgb, var(--bg-overlay) 50%, transparent)`. It only lightens the teal under ink. Peak `--pop-ink` on `--pop-teal` goes from 11.85 to 12.96 (dark) and from 10.90 to 13.62 (light). See §11 Q2.

```css
.sheen { position: absolute; inset: var(--pop-border); z-index: -1; overflow: hidden; border-radius: var(--radius-sm); pointer-events: none; }
.sheen::before {
  content: ""; position: absolute; inset: -1px;
  background: linear-gradient(105deg, transparent 17%, var(--sheen-color) 48%, transparent 76%);
  transform: translateX(-125%);            /* rest: parked outside the clip; no transition, so leaving snaps back invisibly */
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  [data-slot="button"][data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"]) .sheen::before {
    transform: translateX(125%);
    transition: transform 650ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }
}
@media (forced-colors: active) { .sheen { display: none; } }
```

Only the sweep is taken from upstream. Its `translateY(-2px)` hover lift and blurred glow are not, because the pop hover transform (§5.2 states) already owns movement and blurred shadows are banned (§2.6 rule 4). There is no sheen on focus, on touch devices (the media query excludes them), under reduced motion, or while disabled. It is one transform that runs once and stops (§7.4 rule 3).

### 5.3 HUD kit (retro-futurist)

- `.hud-frame`: four corner brackets, 10px arms, 1px `--border-strong`, drawn with four background linear-gradients (no extra elements). Used around readouts: week numeral in the rail and mobile bar, dashboard progress line, library result count, plan intro count.
- `.hud-readout`: mono, `--text-mono`, tabular nums, `--text-secondary`; the live figure inside it in `--text-primary` (or brass when it is the current week).
- `.hud-grid`: 1px `--border-subtle` lines every 24px at 40% opacity. Only inside header bands and the hero; never behind body copy, cards or tables.
- The CRT hero canvas (§7) is the HUD's one moving element.

### 5.4 Aurora kit

- `.aurora`: `position: relative; isolation: isolate; overflow: hidden`. `::before` paints `var(--aurora-fields)` (§2.5) at `z-index: 0`; `::after` paints the grain tile at `z-index: 1` (opacity `--grain-opacity`, so off in light mode); children render at `z-index: 2`.
- `.aurora--live`: the `::before` field layer is 140% of the box, centred (the band's `overflow: hidden` keeps it from widening the page at 360px), animated with `transform: translate3d(...) rotate(...)` over `--dur-aurora`, `alternate`, `infinite`. Allowed on the landing hero and the ceremony only. Paused when off-screen (`IntersectionObserver` sets `animation-play-state`) and when `document.hidden`. Static under reduced motion.
- Static `.aurora` header bands: `/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`, `/about`, dashboard. The band is the page header only (eyebrow + title), never the content area.

### 5.5 Film kit (retro medium)

| Device | Implementation |
|---|---|
| **Filmstrip rail** | Unchanged structure. Sprockets: `--bg-inset` holes on `--border-default`, ink tones only (supersedes the plan's "sprockets in brass and ink"; brass is never a sprocket). Frame numerals are HUD mono (supersedes "playbill numerals"); exposed frames `--accent-warm-wash` + brass check; current frame 2px `--accent-warm` border + `aria-current="step"`; unexposed `--border-subtle`; splice gap before week 13. Frame numerals are HUD mono. |
| **Clapper stripe** (`.clapper-stripe`) | Replaces v1's brass "slate rule" on the assignment card: a 6px top band of 45° diagonal stripes in `--pop-ink`/`--text-primary` (dark) and `--pop-ink`/`--bg-raised` (light). Not brass. |
| **Letterbox** | Retired. R3 moves the week header and plan module heads to `.playbill-frame` + `.aurora` and updates `atmosphere.test.tsx` to assert `.playbill-frame` there and a named `.clapper-stripe` on the assignment card instead of `slate-rule`. R4 moves the landing hero, then deletes `Letterbox`, the `.letterbox*` CSS, `.slate-rule` and `--vignette`. |

### 5.6 Grain

**Why there are two variants: overlay grain is invisible on the dark base.** `mix-blend-mode: overlay` over a near-black pixel moves it by `2·base·noise`.
- At `0.03` on `--bg-base` that is ±0.4 of one 8-bit level. At `0.08` it is about ±1 level.
- Over pure black (`#000`, the ceremony stage) it is exactly zero at any opacity.
- Overlay grain therefore does exactly one job: it dithers aurora banding where the fields lift the base (±2.6 levels at 0.03).
- The visible "film" look needs a normal-blend, desaturated tile. That tile adds light, so it is kept off aurora text and off raised surfaces.

| | **Band grain** | **Film grain** |
|---|---|---|
| Class | `.aurora::after` (§5.4); `.grain::before` for the rare non-aurora band | `.grain.grain--film::before` |
| Tile | Unchanged v1 tile: 128px `feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"` | `--grain-film-tile`: the same noise, desaturated, alpha forced to 1, sRGB maths (literal below) |
| Blend | `overlay` | `normal` |
| Opacity token | `--grain-opacity`: `0.03` dark / `0` light (unchanged) | `--grain-film-opacity`: `0.06` dark / `0` light (new; defined in `tokens.css` beside `--grain-opacity` in both theme blocks) |
| Job | Dither aurora fields | Visible film grain on picture-like showcase surfaces |
| Worst pixel (noise at full white), for the R2 assertion | Three-field aurora stack: `--text-secondary` 4.69, `--text-primary` 6.98 | On `--bg-base`: pixel `#1C1A24`; `--text-tertiary` 5.50, `--border-strong` 3.60, `--pop-outline` 14.15. On `#000`: pixel `#0F0F0F` |

Film tile, base64-encoded into a data URI exactly like the existing `--grain-tile`:

```svg
<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><filter id='f' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0' intercept='1'/></feComponentTransfer></filter><rect width='128' height='128' filter='url(#f)'/></svg>
```

```css
.grain--film::before {
  background-image: var(--grain-film-tile);
  background-size: 128px 128px;
  opacity: var(--grain-film-opacity);
  mix-blend-mode: normal;
}
@media (forced-colors: active) { .grain::before, .aurora::after { display: none; } }
```

**Why not stronger band grain on the hero:** the aurora stack holds `--text-secondary` at 4.86 (§2.5).
- Overlay at `0.04` brings the worst pixel to 4.64 and gains nothing visible.
- Normal blend at only `0.03` drops it to 4.47, which fails.
- So bands stay at `0.03` overlay everywhere, hero and ceremony included. The extra filminess goes to the **text-free picture** inside those surfaces instead.

**Grain map** (dark mode; light mode is `0` everywhere, both variants):

| Surface | Element that owns the grain | Variant | Opacity |
|---|---|---|---|
| Header bands: `/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`, `/about`, dashboard | the `.aurora` band (`::after`) | band | 0.03 |
| Landing hero | the hero root `.aurora.aurora--live` (`::after`). The root does **not** also carry `.grain`; R4 removes the current `GrainSurface` wrapper from it | band | 0.03 |
| Landing hero screen | `.hero-screen.grain.grain--film`: the frame that holds the CRT canvas and its poster. No text and no controls inside it | film | 0.06 |
| Capstone ceremony, live (desktop) | the SparkBadge stage `.ceremony-stage.grain.grain--film` (the badge picture). The surrounding `.aurora--live` keeps band grain | film on stage, band around | 0.06 / 0.03 |
| Capstone ceremony, static (phone, reduced motion, Save-Data; §6) | the `.aurora` overlay (`::after`) | band | 0.03 |
| 404 and `/thank-you` ("intermission cards") | the page root `.intermission.grain.grain--film`, on `--bg-base` | film | 0.06 |

**No grain anywhere else.** In particular: the shell, rail, bottom tabs, mobile bar, every card (including the dashboard current-week card), tables, forms (`/contact`), prose (`/privacy`, `/terms`, the `/about` body, week content), dialogs, sheets, palette, popovers, toasts, the cookie banner, the sticky CTA and landing below the fold.

Rules:
1. Grain is never in the text layer: it is `z-index: 1` and text is `z-index: 2`.
2. Grain is static. `background-position` is never animated, on any device.
3. `.grain--film` only ever sits on `--bg-base` or `#000`. It never sits on `--bg-raised`, where `--text-tertiary` would fall to 5.07 and `--border-strong` to 3.32, and never on an aurora element itself. Inside a band it is allowed only on an opaque, text-free child: `.hero-screen` and `.ceremony-stage` both set `background: #000` so the film never composites onto aurora fields, even before the poster or badge paints. No text or control ever sits on a `.grain--film` element except the intermission cards' page root, which is plain `--bg-base`.
4. Light mode has no grain, so light aurora bands may band slightly on 8-bit panels; accepted.

---

## 6. Surfaces map

| Surface | Victorian | Pop | HUD | Aurora | Film |
|---|---|---|---|---|---|
| Shell: left rail | Brand in Abril; `orn-rule` between groups | Theme toggle segmented | Week numeral in `.hud-frame` | — | Filmstrip rail |
| Shell: bottom tabs, mobile bar | — | — | Week numeral readout | — | — |
| More sheet, dialogs, palette | Title in Abril | Buttons; `--shadow-overlay` | — | — | — |
| Toasts | — | Pop border + offset shadow; status colour as left bar | — | — | — |
| Landing hero | Playbill title block in `.playbill-frame`, display size | Primary CTA (Lumen, restyled through props/tokens) | `.hud-grid`; CRT canvas framed as the "screen" (`.hero-screen`) | `.aurora--live` + band grain on the root | Film grain on `.hero-screen` only (§5.6) |
| Landing below the fold | Working headers, `orn-rule-diamond` between sections | Start-date form controls | Module week ranges | — | Module filmstrip |
| Dashboard | Working headers | Primary "Open this week" | Progress line in `.hud-frame` | Static band | Filmstrip |
| `/plan` | Playbill title block; module heads in `.playbill-frame` with Roman eyebrows | — | Hours, ratios | Static band | Card frames, splice |
| `/week/:n` | Playbill title block in `.playbill-frame`; Abril section heads | Checkboxes (brass checked), badges | Hours, timecode | Static band | Clapper stripe on assignment |
| `/library` | Working header | Chips, badges, view toggle, palette | Result count in `.hud-frame` | Static band | — |
| `/toolkit` | Working header | Badges | First-week column mono | Static band | — |
| `/capstone` | Playbill title block | Status segmented control | Stage `NN / 08` readouts | Static band | Vertical filmstrip of stages |
| Capstone ceremony, live (only when **none** of the §7.2 rule 1 constrained-device conditions holds) | `.playbill-frame` around the badge | Continue button (with sheen), on the frame's `--bg-raised` surface, never on the aurora | — | `.aurora--live` + band grain around the frame | Film grain on the SparkBadge stage |
| Capstone ceremony, static (when **any** §7.2 rule 1 constrained-device condition holds) | Fixed overlay `.ceremony.ceremony--static` (`position: fixed; inset: 0; background: var(--bg-base)`) whose first child is an `.aurora` layer with `position: absolute; inset: 0` (static fields and band grain; the absolute position overrides `.aurora`'s `relative`, so the overlay stays fixed). The live ceremony's surrounding aurora uses the same inner-layer pattern. Centred `.playbill-frame` with `background: var(--bg-raised)`, padding `--space-8`, `max-width: 28rem`, holding top to bottom with `--space-6` gaps: `.orn-seal` at `min(64vw, 280px)`; eyebrow `CAPSTONE · COMPLETE` with fleurons; Abril `--text-h1` "Capstone complete" in `--text-primary`; Continue | Continue button (no sheen: touch) | — | Static `.aurora` (no `--live`) | — |
| 404, `/thank-you` (intermission cards) | `.orn-seal` centred above a centred playbill title block (eyebrow `MISSING REEL` / `THANK YOU` with fleurons, Abril `--text-h1`, diamond rule); copy and actions centred, `--container-prose` | Buttons (primary with sheen) | — | — | Film grain on the page root `.intermission` (§5.6) |
| `/about`, `/privacy`, `/terms`, `/contact` | Working header; decode heading on about | Buttons (primary with sheen), form controls | — | Static band (about only) | — |
| Cookie banner, sticky CTA | — | Buttons, 2px pop border, offset shadow | — | — | — |
| Resource card, gap card | Title Inter 600 | Badges only | Verified date, minutes mono | — | — |

---

## 7. ThreeUI governance (unchanged from v1 except styling)

Vendored, never installed; files in `src/vendor/threeui/` stay unmodified and are restyled only through props and tokens.

### 7.1 Approved pieces

All rows come from `MengTo/threeui` at **`68802d5428071ada5c20db8094b1649e6bb770ed`**. `main` was still at this SHA when the catalog was re-examined on 2026-10-27, so rows 1–4 and rows 5–6 share one source. "Vendored" means the files are copied unmodified. "Lifted" means only the maths or CSS technique is re-expressed in our own file, with an MIT attribution comment naming the SHA and upstream path; nothing new is added to `src/vendor/threeui/`. R4 adds a "Lifted techniques" section to `src/vendor/threeui/SOURCE.md` that lists rows 5–6.

| # | Piece | Kind | Upstream path | Local files | Surface | Layer | Phone / reduced motion |
|---|---|---|---|---|---|---|---|
| 1 | CRT background (raw WebGL) | Vendored | `src/shaders/crt/{CrtBackground.tsx, crtRenderer.ts, crtScreens.ts, crtShaders.ts}` | `src/vendor/threeui/crt/` (same names) | Landing hero screen | HUD | Poster only (§7.2) |
| 2 | Lumen CTA | Vendored | `src/shaders/lumen-cta/{LumenCta.tsx, lumen-cta.css}` (its `sources/lumen.html` loads three@0.149 from a CDN; that file is **not** vendored, and the TSX does not import `three`) | `src/vendor/threeui/lumen-cta/` | Landing primary action | Pop | As shipped |
| 3 | SparkBadge (canvas 2D in an iframe) | Vendored | `src/shaders/spark-badge/{SparkBadge.tsx, spark-badge.html}` | `src/vendor/threeui/spark-badge/SparkBadge.tsx`; `public/spark-badge.html` | Capstone ceremony, **live variant, desktop only** (§6) | Atmosphere (ceremony) | Not mounted; the static seal ceremony replaces it (§6), as §7.4 rule 1 requires |
| 4 | `articleHeadingDecode` | Vendored | `src/shaders/article-headings/articleHeadingDecode.ts` | `src/vendor/threeui/article-headings/` | Landing H1, `/about` H1 | Victorian (type) | As shipped (one-shot) |
| 5 | Guilloché seal | Lifted maths → static SVG | `src/shaders/neuform-isolated/sources/kinetic-lathe-certificate.html`: `rosette()` (lines 306–330) and its parameters in `drawRosettes()` (lines 430–452) | `scripts/gen-guilloche-seal.ts` (dev-only) → `src/assets/ornaments/guilloche-seal.svg`; `.orn-seal` in the ornament CSS (§5.1, §5.1.1) | 404, `/thank-you`, static ceremony | Victorian | Static image, zero JS; nothing to stop |
| 6 | Sheen | Lifted CSS | `src/shaders/rectangle-buttons/RectangleButtons.tsx`: `.threeui-page-button--trochil::before` (line 168) and `:hover::before` (line 183) | `src/styles/sheen.css`; the span in `src/components/ui/button.tsx` (§5.2) | Primary pop button hover, every route (an interaction state, not decoration in reading content) | Pop | No hover on touch, so it never runs on phones; off under reduced motion |

### 7.2 Rules

1. **Live surfaces (rows 1, 3):** one live canvas at a time. Forbidden on learning routes and on `/` for a returning learner. Lazy only, and never blocking LCP. Poster-first (row 1) or static variant (row 3) on constrained devices. This is the **single list** that §6's ceremony rows refer to: viewport < 768, `(pointer: coarse)`, ≤ 4 cores (`navigator.hardwareConcurrency`), ≤ 4GB memory (`navigator.deviceMemory`, when present), Save-Data, reduced motion. Pause off-screen and on a hidden tab. A 2s FPS guard drops below 30fps. Unmount to the poster on context loss. The poster is recaptured in R4 against the new hero.
2. **Admission test for any future piece:**
   - It does not import `three`, at runtime or through a CDN `<script>` in a document it loads.
   - It loads no third-party runtime: no Tailwind play CDN, Google Fonts, GSAP, Iconify or analytics.
   - It uses no `backdrop-filter` and no blurred glass (§2.6 rule 4).
   - It needs no root-relative runtime file other than the one `public/spark-badge.html` already approved.
   - On phones it either never runs or runs once and stops (§7.4).
   - It decorates only landing, dashboard, about, the ceremony, 404/legal/thank-you, or an interaction state. It never decorates reading content.
3. **Lifted ≠ vendored.** A lifted technique lives in our own file, follows our tokens, and may be edited. It carries the attribution comment from §7.1. Vendored files are never edited.
4. **Evaluated and rejected at this SHA (2026-10-27), so later phases do not re-open them without new information:**
   - **Imports `three`** (bundled or CDN): bookshelf, dot-matrix, emerald-horizon, gallery, orbital-sphere, structure-flow, temple-night, warp-field, woven-cloth, animated-top-dock, skeuomorphic-toggle (glass and shader variants), sylva-living-world.
   - **Continuous raw-WebGL or canvas-2D render loops with no static mode:** bell-field, condensation, data-pixel-arc, energy-orb/globe, laser, liquid-form, predictive-arc, ribbon-field, stream-convergence, typography-vortex, portal-field.
   - **Glass / `backdrop-filter`:** circle-buttons, section-elements, the aster and glassmorphism button variants.
   - **Full HTML documents behind `?raw` srcdoc or root-relative iframes** (`/landscape.html`, `/japanese-tower.html`, `/synthralos-halftone.html`, `/landing-pages/*.html`), each with its own palette and fonts, most loading the Tailwind play CDN, Google Fonts or GSAP, and running timers: every `neuform-isolated/sources/*` piece (including the 53 button/CTA/field documents), brand-orbs, character-carousel (266KB filmstrip document), text-path-studies, semantic-bloom, uplink-loader, elements, japanese-tower, koi-studies, sketchbook, landing-pages, landscape, constellation-field.
   - **Duplicates of the pop press already specified (§5.2):** the remaining `rectangle-buttons` variants (meridian keycap, attune, tideform, understory/halvorsen arrow pills).

### 7.3 Performance budgets

The budget serves one goal: **reading on a phone must not drain the battery noticeably**. It is a target weighed against design and UX, not an absolute line (user direction, 2026-10-27).

| Scope | JS gzipped, static graph before first paint | Gate |
|---|---|---|
| App shell + any learning route (`/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`) | **Target ≤ 160KB**; **ceiling 180KB** | `scripts/assert-bundle.ts` warns above the target and fails above the ceiling. Going over the target needs a journal `Decision` naming the design/UX gain that justified it |
| Landing + `/about` canvas chunk, after LCP | + ≤ 25KB | Lighthouse mobile ≥ 90 target |

"Static graph before first paint" is the entry plus the route's static imports. Chunks loaded from a mount effect (deferred chrome, the Fuse index) are outside it; R0.1 records the 3-second totals. Fonts and CSS are not in the JS budget, which is why ornaments, halftone, HUD frames and aurora are CSS. `ENTRY_GZIP_LIMIT`, the ceiling and `LEARNING_ROUTES` are not changed to make a phase pass.

### 7.4 Battery rules (phones)

Download size matters less to battery than work that keeps running. On a **phone** — `(max-width: 767px)` or `(pointer: coarse)` — nothing runs continuously while the learner reads:

1. **No continuous animation loops.** No WebGL canvas (already poster-only below 768px), no `.aurora--live` (bands are static), no infinite CSS animation outside a loading skeleton, no ThreeUI component that animates on a timer.
2. **No smooth-scroll loop.** Lenis (`autoRaf`) keeps a `requestAnimationFrame` loop alive; it does not mount on phones or under reduced motion. Native scrolling only.
3. **Interaction-only motion.** Hover/press transforms, sheet slides and the one-shot ceremony are fine: they run, then stop.
4. **Desktop live surfaces pause** off-screen (`IntersectionObserver`) and when `document.hidden`, and are covered by the FPS guard.
5. **Static texture is free.** Grain, halftone, aurora bands and ornaments are painted once; they are not animated anywhere on phones.
6. `prefers-reduced-motion: reduce` and `Save-Data` force the phone behaviour on any device.

---

## 8. Accessibility (non-negotiable)

- Contrast in both themes, enforced by the R2 contrast test; aurora and pop pairs included.
- Focus: `outline: 2px solid var(--accent-primary); outline-offset: 3px`, visible on every interactive element including filmstrip frames and chips; pop shadows hide while focused (§5.2).
- Touch targets ≥ 48×48px. Pop controls sit ≥ 12px apart (`--space-3`), so the 4px hover shadow never touches a neighbour; other targets ≥ 8px apart. The shadow does not count toward the target.
- Skip link first. `/` and ⌘K open the palette. Escape closes every overlay and focus returns to its trigger. Radio groups are one tab stop with arrows that stop at the ends.
- `aria-live="polite"` on progress changes and result counts.
- Lucide icons only, no emoji. Ornaments, grain, aurora and canvases are decorative and invisible to assistive tech.
- `prefers-reduced-motion` honoured per §4 and §5.4.

---

## 9. shadcn/ui inventory

Unchanged from v1: `button` · `checkbox` · `card` · `badge` · `tabs` · `accordion` · `dialog` · `command` · `sheet` · `progress` · `separator` · `tooltip` · `sonner` · `select` · `toggle-group` · `scroll-area` · `skeleton` · `switch` · `alert` · `table` · `popover` · `collapsible` · `textarea`, plus `input`, `input-group` and `toggle` as dependencies. Primitives get the pop treatment through tokens and variant classes in R2; their behaviour and accessibility wiring are not rewritten.

---

## 10. Design rationale (2026 pass)

The catalog was read at `68802d5`. Of its 47 families, roughly 45 fail at least one hard rule: they import `three`, run a render loop on phones, rely on blurred glass, or are whole HTML documents bringing their own CDN, fonts and palette. The 2026 feel here therefore comes from **precision and restraint**, not more canvases.

- **Guilloché seal:** banknote lathe-work. It is Victorian in origin, but hairline-dense in a way that reads as contemporary generative art. It costs about 3KB as a static mask, and it gives phones and reduced-motion users a ceremony, where today they get none.
- **Sheen:** a light leak across the one button that matters. It is tactile on desktop and absent on touch.
- **Grain:** the measurement changed the plan. Overlay grain is invisible on the near-black base and zero on the ceremony's black. So band grain stays a quiet aurora dither, and a separate **film grain** (normal blend, desaturated, 0.06) goes only on text-free pictures (the hero screen, the badge stage) and on the two intermission cards. The film lives on the screen, not on the paper.

Nothing new runs continuously. Every addition is CSS, a static asset, or a one-shot transform.

## 11. Resolved questions (parent, 2026-10-27)

1. Grain: R2 transcribes `--grain-opacity: 0.03` (dark); the `0.025` in `tokens.css` is v1 drift.
2. `--sheen-color` has its §2.8 row (ink on sheened teal ≥ 4.5; computed peak 12.96 dark / 13.62 light).
3. Both grain worst-pixel rows are in §2.8 (film grain on base: tertiary 5.50, border-strong 3.60, pop-outline 14.15; band grain on aurora stack: primary 6.98, secondary 4.69).
4. Continue sits on the playbill frame's `--bg-raised` surface in both ceremony variants; §2.5's "no controls in a band" holds.
5. SparkBadge is desktop-only (it animates on a timer, §7.4 rule 1). Phones, reduced motion and Save-Data get the static seal ceremony, which replaces today's no-ceremony under reduced motion. Accepted as a battery-rule consequence; reported to the user.
6. Light theme has no film grain anywhere, including the dark CRT screen. Accepted.
