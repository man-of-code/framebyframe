# Frame by Frame — Redesign ("Kinetoscope") and Fix Plan

**Status:** approved direction, 2026-10-27. Supersedes the visual sections of `docs/design-system.md` (rewritten in Phase R1) and closes the review findings against `docs/implementation-plan.md`.
**Branch:** `feat/redesign-kinetoscope`.
**Journal:** append one entry per phase to `docs/implementation-journal.md`, heading `### Redesign R<N>: <title>`, same template and `**Decision:**` / `**Deviation:**` rules as the v1 tasks.

---

## 1. Direction

**Kinetoscope** — a Victorian playbill for the year cinema was born (1895), printed in pop-art halftone, read through a retro-futurist instrument panel, under an aurora sky.

Five styles, five jobs. A style may only appear in its own layer. This rule is what keeps the blend from becoming noise.

| Layer | Style | Owns | Never touches |
|---|---|---|---|
| **Structure & type** (lead) | Victorian playbill | Display typeface, page titles, ornamental rules and fleurons, double-ruled frames, centred title blocks, small-caps eyebrows | Body copy, dense tables, form controls |
| **Interaction & status** | Pop art | Buttons, chips, badges, toggles: flat saturated fills, 2px ink outlines, hard offset shadows, Ben-Day halftone dot fields on selected and hover states | Long-form text backgrounds, anything behind body copy |
| **Data & numerals** | Retro-futurist | Mono HUD readouts (`WK 07 / 16`, hours, counts, timecode), corner-bracket frames, thin grid lines, the CRT hero canvas | Headings, prose |
| **Atmosphere** | Aurora | Large slow gradient fields behind the hero, page headers and the capstone ceremony; it replaces the old vignette | Cards, controls, anything carrying meaning |
| **Medium** | Retro film | Filmstrip progress rail, sprockets, grain (dark only, and it also dithers the aurora gradients), splice gap, slate rule | — |

Semantic rule carried over from v1, renamed: **brass** (the progress colour) is reserved for progress and completion only. It never appears on a link, button, filter or nav item.

## 2. Non-negotiables (unchanged from v1 unless stated)

- TypeScript strict, no `any`, no non-null assertions on parsed data.
- Lucide icons only, no emoji. Ornaments are in-house inline SVG components, not icon fonts.
- Touch targets ≥48×48px with ≥8px separation. Body ≥16px on mobile. No horizontal scroll at 360px.
- Animate `transform` and `opacity` only. Hover never uses `scale`. Pop-art "press" is a `translate` of the offset shadow, not a scale.
- Aurora animation runs only on the landing hero and the ceremony, 8–12s loops, off under `prefers-reduced-motion`. Learning routes get a **static** aurora.
- Learning routes (`/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`) load zero canvas code.
- **Budget:** app shell plus any single learning route is ≤160KB JS gzipped, enforced per route by `assert-bundle`, not only the entry. The 164KiB raise is reverted.
- **Contrast is a test.** Every text/background token pair in both themes is asserted ≥4.5:1 (≥3:1 for large display and non-text UI) by a unit test that parses `tokens.css`.
- Analytics: consent-gated Vercel Web Analytics stays (user decision 2026-10-27). The PRD is amended to say so.

## 3. Phases

Each phase ends with: verify commands green, a journal entry, one commit, then a review (advisor plus a fresh-eyes reviewer) before the next phase starts. Findings from review are fixed inside the same phase.

### R0 — Correctness fixes (no visual change)

Urgent: `Dashboard.test.tsx` breaks on 2026-10-29.

| # | Fix | Where | Verify |
|---|---|---|---|
| 0.1 | Freeze the clock in the dual-state test (`vi.useFakeTimers({ toFake: ["Date"] })` + `vi.setSystemTime("2026-10-24T12:00:00")`) | `src/routes/Dashboard.test.tsx` | Test passes with the system clock set to 2026-11-30 |
| 0.2 | `importProgress` drops an invalid `startDate` (must pass `startDateError`) and a `weekOverride` that is not an integer in 1–16 | `src/lib/progress.ts` (+ tests) | New tests: `"garbage"`, `3.5`, `-2`, `99` are dropped |
| 0.3 | One week-completion rule, exported from `src/lib/week.ts`: a week is complete when every core task **and** every done-when check is done; weeks with no tasks complete on checks alone. Filmstrip, plan, dashboard counts all use it, so 16/16 is reachable | `src/lib/week.ts`, `FilmstripRail`, `ModuleGroup`, `Dashboard` | Unit tests for core-week, extension-week, checks-missing |
| 0.4 | One hours helper (`weekMinutes(week)` = all tasks, matching the ledger estimate) and one `MODULES` list in `src/content/modules.ts`; delete the three copies | `Dashboard`, `Week`, `Plan`, `ModuleGroup` | Week 3 reads 8h on dashboard, plan and week page |
| 0.5 | Every module imports only the content it needs (`@/content/weeks`, `/capstone`, `/tools`, `/gaps`, `/resources`); only Week and Library (and the content-reading scripts/tests) may touch resources. Revert `ENTRY_GZIP_LIMIT` to `160 * 1024` | `FilmstripRail.tsx`, all routes, `scripts/assert-bundle.ts` | `npm run build` prints entry < 160KiB |
| 0.5b | Measure what composes the entry chunk (one-off source-map / chunk report, no new dependency). Move eagerly loaded heavy pieces (candidates: sonner `Toaster`, the radix sheet behind `MoreSheet`) behind lazy boundaries where that does not delay first paint. Record measured before/after sizes per route in the journal | shell modules | Numbers in the journal |
| 0.6 | `assert-bundle` also measures entry + each learning-route lazy chunk graph and fails any route over 160KiB. Print every route's size. **If a route still cannot reach 160KiB after 0.5–0.5b, the limit is not raised: the journal records it as a decision for the user** | `scripts/assert-bundle.ts` (+ test) | Build log shows per-route sizes |
| 0.7 | Service worker: cache `/assets/*` only when `content-type` is JS/CSS/font/image; cache name is written into `dist/sw.js` by a post-build step from the build hash (Vite copies `public/` unprocessed); `vercel.json` rewrite excludes `/assets/` so a missing chunk is a real 404 | `public/sw.js`, `vercel.json`, `scripts/` | Unit test on the rewrite pattern (`vite preview` ignores `vercel.json`, so preview proves nothing); `dist/sw.js` contains the hash |
| 0.8 | Sitemap and robots generated at build from `SITE_ORIGIN`. With no origin, ship `robots.txt` without a `Sitemap:` line and no sitemap, rather than an invalid one | `scripts/write-seo.ts`, `public/` | Build with and without `SITE_ORIGIN` |
| 0.9 | `NotesField` resyncs when the stored note changes from outside (import) and the field has no unsaved edit | `NotesField.tsx` (+ test) | Test: replace progress, field shows imported note |
| 0.10 | Capstone status radiogroup: roving tabindex + arrow keys | `StageList.tsx` (+ test) | Arrow keys move and select |
| 0.11 | Contact address lives only in `SITE.email`; every page reads it from there. Value changes when the user supplies the dedicated address | `src/content/site.ts`, consumers | `grep -rn "@gmail" src` hits only `site.ts` |
| 0.12 | PRD amended: analytics is consent-gated Vercel Web Analytics, off until Accept; "zero tracking" becomes "zero tracking without consent" | `docs/prd.md` lines 6, 35, 255 | Read-through |
| 0.13 | Remove orphaned scaffold files: `src/App.css`, `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg` | — | `grep` shows no references; build green |
| 0.14 | Install Chromium for Playwright (~100MB into the Playwright cache) and get `npm run e2e` green **now**, so the smoke test is a regression net through R2–R4 | — | `npm run e2e` → 1 passed |

0.3 deliberately changes the Task 9 completion rule; the Plan and WeekFrame tests that encode the old rule are updated, and the journal flags it as a **Deviation** against Task 9.

### R1 — Design system v2 (spec only, no code)

Rewrite `docs/design-system.md` as **Kinetoscope v2**. It is the only source of design values for R2–R4. Required sections:

1. Direction and the layer table from §1 above.
2. **Colour tokens, both themes**, every pair contrast-checked (the R2 test enforces it). Starting candidates, to be verified and adjusted, not copied blind:
   - Dark ("night show"): ink base `#0E0B16`, raised `#17121F`, overlay `#1F1829`; paper text `#F2E8D5`, secondary `#C9BCA6`, tertiary `#948A7A`; action **aurora teal** `#4FE0C2`; pop magenta `#FF4FA3`, pop yellow `#FFD23F`, pop cyan `#3DB8FF` (status/badges only); **brass** `#E2A93B` (progress only); danger `#FF6B6B`.
   - Light ("matinee paper"): base `#F5EDDC`, raised `#FFF9EE`, ink text `#1B1424`, secondary `#4A3F52`; action teal darkened to pass on paper (≈`#0B7A68`); brass text ≈`#8A5A00`; pop colours as fills with ink text, never as text on paper.
   - Aurora gradient stops (teal → violet `#7B5CFF` → magenta), opacity bounded so text over it still passes.
3. **Type:** display **Abril Fatface** (fat-face, the Victorian playbill face; OFL; self-hosted latin + latin-ext; display and page titles only). Body/UI stays **Inter**. HUD/numerals stay **JetBrains Mono**. Eyebrows: Inter small caps with wide tracking. Scale tokens carried from v1 with any changes justified.
4. **Ornament kit:** fleuron, double rule, rule-with-diamond, playbill frame corners, as CSS mask utilities in `--ornament` (decided in R1: JSX would spend the `/week` JS headroom).
5. **Pop kit:** ink outline width, offset-shadow token (`--pop-shadow: 3px 3px 0 var(--ink)`), Ben-Day halftone utility (CSS `radial-gradient` dot tile, fixed size, opacity token), press state (`translate(2px,2px)` + shadow shrink).
6. **HUD kit:** corner-bracket frame utility, grid-line utility, mono readout styles.
7. **Aurora kit:** static and animated variants, where each is allowed, reduced-motion behaviour, and grain over it for banding.
8. Surfaces map: which of the kits each route and component uses (shell, filmstrip, plan, week, library, toolkit, capstone, dashboard, landing, about, legal pages, dialogs, toasts, cookie banner, sticky CTA).
9. Motion, spacing, radii (Victorian frames are square-cornered; pop controls `--radius-sm`), z-index, a11y, budgets, ThreeUI governance (unchanged), shadcn inventory.

R1 must settle these explicitly, or R2 will invent them:
- **One hue per meaning.** State the primary-button fill. Action (teal) and status (pop colours) must not be confusable; drop or shift pop cyan if it sits next to teal.
- **Ornaments are never brass.** Fleurons and rules use ink/paper tones, so "brass = progress" survives on every page.
- **Halftone never sits under text.** Keep dot fields outside label bounds, or test contrast at maximum dot opacity.
- **Abril Fatface has one weight.** `font-synthesis: none`, no 600/700 on display elements; check "Marketing, Distribution and Career" at 360px.
- **Small caps.** Check the self-hosted Inter woff2 for `smcp`; if absent, eyebrows stay uppercase + tracking (no faked small caps).
- **Contrast computed exactly**, not taken from the candidates above (light teal on paper is near 4.5:1).

Also update `.cursor/rules/framebyframe-design.mdc` to match.

### R2 — Foundation

- `src/styles/tokens.css` rewritten from R1 (both themes, shadcn mapping, aurora, pop, HUD tokens). Inline theme script and `useTheme` unchanged.
- Fonts: add Abril Fatface woff2 + OFL text; drop Archivo Expanded; update preload.
- `src/styles/` utilities: `.halftone`, `.pop-outline`, `.pop-shadow`, `.hud-frame`, `.hud-grid`, `.aurora`, `.aurora--live`, `.playbill-frame`; grain kept.
- Ornament kit as CSS utilities (`.orn-fleuron`, `.orn-rule`, `.orn-rule-double`, `.orn-rule-diamond`, `.playbill-frame`) using SVG data-URI masks, per design-system v2 §5.1. Not React components: `/week` has ~6KB of JS headroom.
- shadcn primitives rewired to tokens (button, badge, checkbox, toggle, dialog, sheet, command, tooltip, sonner): pop treatment on controls.
- `src/styles/tokens.contrast.test.ts` — parses `tokens.css`, asserts every declared pair in both themes.
- Shell restyle: left rail, bottom tabs, More sheet, mobile bar, skip link, readonly banner, week numeral.
- Verify: test, tsc, build (per-route budget), browser check of shell at 360/768/1440 both themes.

### R3 — Learning routes

Filmstrip (sprockets in brass and ink, playbill numerals), `/plan` (module headers as playbill bills with ornamental rules), `/week/:n` (playbill title block over static aurora, pop task checkboxes, HUD hours), resource and gap cards (pop badges, no halftone behind text), `/library` (pop chips, HUD result count, palette), `/toolkit` table, `/capstone` stages. Zero canvas, budget held. Verify: tests, build budgets, browser at 4 widths × 2 themes, keyboard pass.

### R4 — Showcase and launch surfaces

Landing hero (animated aurora + playbill title + CRT canvas framed as a proscenium, poster recaptured), Lumen CTA restyled through props/tokens only, dashboard, `/about` (decode heading), capstone ceremony, contact / thank-you / privacy / terms, 404, cookie banner, sticky CTA, route fallback skeleton, OG image and favicon redrawn in the new palette. Vendor files stay unmodified.

### R5 — Hardening

`npm run e2e`; update smoke spec selectors if the redesign moved them. Lighthouse mobile on `/`, `/plan`, `/week/7`, `/library` (target ≥90 perf, ≥95 a11y, LCP <2.0s; record honestly if missed). Manual audit against design-system v2 checklist in both themes. Journal entry lists any v1 or R-phase item still open.

## 4. Review protocol

After each phase:
1. All verify commands for that phase pass, and the full `npm test`, `npx tsc -b`, `npm run build`.
2. Journal entry committed with the phase.
3. Review: the parent session reads the journal entry, then the phase diff, against this plan and design-system v2, plus one advisor pass. R1 (the spec) also gets an independent cold reviewer. Findings are fixed before the next phase.

### Who implements each phase

Chosen with the advisor, 2026-10-27. Phases run one at a time; they share one working tree.

| Phase | Implementer | Why |
|---|---|---|
| R0 | Parent session (Opus), inline | Holds every review finding; 0.3 is a judgment call that breaks tests on purpose |
| R1 | Parent session (Opus), inline | The spec fixes every downstream value and depends on this conversation's decisions |
| R2 | Sonnet subagent | Precise transcription of R1 into tokens, utilities, primitives, contrast test. Escalate to Opus if review finds drift |
| R3 | Sonnet subagent | Large but mechanical application of the R1 surface map |
| R4 | Opus subagent | Taste-heavy: hero composition, CRT framing without editing vendor files, poster, OG image, favicon |
| R5 | Sonnet subagent | Runs tools and records results; told explicitly to record misses and never adjust limits |

Every subagent brief carries: branch, plan path and its phase section, design-system v2 path, journal heading and rules, user decisions (analytics stays; `flag.txt` stays untouched; contact email only in `SITE.email`), vendor files unmodified, load `ui-ux-pro-max` first, commit attribution, no push.

## 5. Open items needing the user

- The dedicated contact address (0.11 ships with the current value until supplied).
- A production origin for `SITE_ORIGIN` (0.8 ships without a sitemap until supplied).
