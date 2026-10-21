# Frame by Frame — Implementation Journal

> **For agentic workers:** This is the only journal. When a task in `docs/implementation-plan.md` has passed its verify step, append one entry under `## Entries`, then commit that entry with the task. Reviewers use this file as the record of what shipped and which choices were not already in the plan.

**Status:** empty. No task has been implemented.

Do not rewrite this header. Do not edit another task's entry. Do not add a status table — reviewers compare the headings under `## Entries` with the list below.

## Rules

1. Write the entry only after that task's verify step has passed.
2. Re-read this file immediately before appending. Another agent may have written since you started.
3. Add the entry at the bottom of `## Entries`. Leave every earlier entry untouched, including wording you disagree with.
4. The heading is `### Task N: <title>` copied from the plan. One entry per task. If that heading already exists, stop and do not write a second one.
5. Flag every engineering decision with a bullet whose line starts with `**Decision:**`. A decision is a choice the plan did not already make, or a choice that departs from the plan, `docs/prd.md`, or `docs/design-system.md`. Carrying out a specified step is not a decision and does not get a flag.
6. When nothing was decided beyond the plan, the decisions section is exactly one bullet: `**Decision:** none. Implemented as specified.`
7. A departure from a specified step adds `**Deviation:**` on that same decision and quotes the step. Reviewers search for `**Deviation:**`.
8. The entry ships in the task commit. The plan's commit step lists this file in `git add`.
9. Writes are serial. Subagent-driven execution reviews between tasks, so the next task starts after the previous entry is committed. If two tasks would finish together, the parent appends one entry, commits, then the next. Two writers appending at once will drop an entry.

## Entry template

Copy this shape. Replace every angle-bracket field. Delete no labelled line; write `none` when a section is empty.

```markdown
### Task N: <title copied from the plan>

- **Status:** complete
- **When:** <YYYY-MM-DD>
- **Plan reference:** `docs/implementation-plan.md` → Task N

#### Shipped

- `<path>` — <behavior a reviewer can check against the plan's Files and Interfaces>

#### Verified

- `<command from the plan's verify step>` → <actual result: pass count, exit code, or what you saw>

#### Decisions

- **Decision:** none. Implemented as specified.

or, for each real choice:

- **Decision:** <what was chosen, in one sentence>.
  - **Because:** <the constraint, measurement, or spec line that forced it>.
  - **Rejected:** <the alternative that was actually considered, and why it lost>.
  - **Risk:** <what the reviewer should re-check>. If there is nothing to re-check, write `none`.
  - **Deviation:** no

  A departure from a specified step uses `**Deviation:**` yes, then quotes the plan step on the next line:
  - **Deviation:** yes. Plan step: "<quoted step>". Did this instead: <what landed>.

#### Left open

- none
```

What counts as a decision, so the flag stays meaningful:

- A library, version, file split, or API shape the plan left unspecified.
- A behavior the tests forced that the plan did not describe.
- A specified step you did not follow.
- An alternative you implemented far enough to reject.

What does not count:

- Restating the plan in past tense.
- Formatting, rename-only cleanups, or choices the plan already named.

## Required entries

Reviewers check that `## Entries` contains each heading once, in this order. Implementers do not edit this list.

1. `### Task 1: Scaffold and toolchain`
2. `### Task 2: Design tokens, theme, and grain`
3. `### Task 3: Content types and build-time validation`
4. `### Task 4: Port the resource ledger`
5. `### Task 5: Port the curriculum, gaps, tools, and capstone stages`
6. `### Task 6: Progress engine`
7. `### Task 7: Week derivation`
8. `### Task 8: App shell and navigation`
9. `### Task 9: Filmstrip components`
10. `### Task 10: /plan`
11. `### Task 11: /week/:n`
12. `### Task 12: Library search and filter logic`
13. `### Task 13: /library UI`
14. `### Task 14: Dashboard, landing, capstone, toolkit, about`
15. `### Task 15: Static atmosphere`
16. `### Task 16: Vendored canvas layer and guards`
17. `### Task 17: Hardening and release gates`

## How to review from this file

1. Match the headings under `## Entries` to the required list. A missing heading means that task was not journaled, so the review has no decision record for it.
2. Search `**Decision:**`. Read every hit. `none. Implemented as specified.` means you judge the diff against the plan with no claimed exception.
3. Search `**Deviation:**`. Each `yes` is a plan step the implementer did not follow. Those are the review gates.
4. Check **Verified** against the verify step in the plan. A missing command means the task is incomplete, even when the code exists.
5. Read **Left open** before the next task starts. Those items are inherited risk, not notes to ignore.

## Entries

Append below this line.

### Task 1: Scaffold and toolchain

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 1

#### Shipped

- `package.json` — Vite scripts plus `prebuild`, `test`, `e2e`, `validate`, and `check-links`. Locked versions match the plan: Vite 8.3.5, React 19.3.1, React Router 7.18.4, Tailwind 4.3.3, Zod 4.6.7, Fuse.js 7.5.0, Lucide 1.61.0, TanStack Virtual 3.14.21, Vitest 5.0.5, Playwright 1.64.1. No `three` dependency.
- `vite.config.ts` — `@/*` → `src/*`, Tailwind plugin, `src/vendor/threeui` manual chunk named `atmosphere`.
- `tsconfig.app.json` — `strict`, `baseUrl`, and `@/*` paths.
- `vitest.config.ts` — jsdom, the same `@/*` alias, tests under `src/**/*.test.{ts,tsx}`.
- `src/lib/noop.test.ts` — temporary toolchain proof from the plan. Deleted in Task 3.
- `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore` — create-vite React-TS scaffold, with the document title set to `framebyframe`.

#### Verified

- `npm run test` → 1 passed (Vitest 5.0.5).
- `npx tsc -b --noEmit` → exit 0, no output.
- `npm run dev` → Vite 8.3.5 at http://localhost:5173/. The default React page rendered (`Get started`, counter moved from 0 to 1). No Vite error overlay. Dev-server log had no compile errors.

#### Decisions

- **Decision:** Package name and document title are `framebyframe`.
  - **Because:** The repo already contained `docs/` and the research ledger, so scaffolding used the plan's `.tmp-scaffold` fallback. create-vite named the package and `<title>` after that directory.
  - **Rejected:** Leaving `tmp-scaffold` in `package.json` and `index.html`.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** `tsconfig.app.json` sets `"ignoreDeprecations": "6.0"` beside the plan's `baseUrl`.
  - **Because:** create-vite installed TypeScript ~6.0.3, and `tsc` exits 2 on `baseUrl` unless that flag is set. The plan requires `baseUrl` and a clean `tsc -b --noEmit`.
  - **Rejected:** Dropping `baseUrl` and relying on TS 6 relative `paths` alone.
  - **Risk:** `baseUrl` stops working in TypeScript 7. Revisit the alias when the compiler is upgraded.
  - **Deviation:** no

- **Decision:** `tsconfig.node.json` includes `vitest.config.ts` as well as `vite.config.ts`.
  - **Because:** `tsc -b` only typechecks files in the project references. Without this, the Vitest config the task creates is outside the verify step.
  - **Rejected:** Leaving `vitest.config.ts` untyped.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** Kept the create-vite `lint` script (`oxlint`) in addition to the plan's scripts.
  - **Because:** create-vite 9.3.1 installed oxlint and a lint script. The plan says to add scripts; it does not say to remove that one.
  - **Rejected:** Replacing `scripts` verbatim and leaving oxlint installed with no script.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** Did not create `playwright.config.ts` or `components.json`.
  - **Because:** Both are named in the task file list and neither step gives contents. `components.json` is created by Task 8 `npx shadcn@latest init`. Playwright's default `testDir` is `./tests`, while Task 17 puts the smoke spec in `e2e/`.
  - **Rejected:** Inventing a shadcn config and a Playwright config the plan never wrote.
  - **Risk:** `npm run e2e` will not discover `e2e/smoke.spec.ts` until a config sets `testDir`. Task 17 needs that config, or the spec needs to live under `tests/`.
  - **Deviation:** yes. Plan step: "Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`, `components.json`". Did this instead: left `playwright.config.ts` and `components.json` uncreated.

#### Left open

- `src/lib/noop.test.ts` accepts a failed `@/main.tsx` import (`catch(() => null)` and an assertion that allows `null`). A broken alias still passes. The plan specifies this test and Task 3 deletes it. `tsc` does resolve `@/main.tsx`, so the alias is checked at compile time.
- Vitest 5.0.5 and jsdom 30 declare engines of Node `^22.12.0 || ^24 || >=26` and `^22.22.2 || ^24.15.0 || >=26`. This machine's default Node is v23.11.0. `npm install` printed `EBADENGINE`. `npm run test` still passed on that Node.
- `npm run build` is wired to `scripts/validate-content.ts` and `scripts/assert-bundle.ts`, which do not exist yet. Failure until Tasks 3 and 17 is the plan's expected state.

### Task 2: Design tokens, theme, and grain

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 2

#### Shipped

- `src/styles/tokens.css` — every §2.1 token on `:root`, every §2.2 token on `.light`, §3.2 type scale, §4 spacing, named containers, radii that have values, z-index scale, easing, and durations. shadcn names from §2.3. Reduced motion collapses `--dur-base`, `--dur-slow`, and `--dur-ceremony` to `1ms`.
- `src/styles/grain.css` — `.grain` copied from §5.3. `--grain-tile` is a 128px `feTurbulence` data URI, `baseFrequency="0.85"`, `numOctaves="3"`.
- `src/index.css` — Tailwind v4, token and grain imports, the `@theme inline` block from the plan, and the `dark` variant. `@font-face` for the three families. `html` paints `--bg-base` and `--text-primary`.
- `src/lib/theme.ts` — `Theme`, `THEME_KEY`, `resolveTheme`, `applyTheme`.
- `src/lib/theme.test.ts` — the two `resolveTheme` cases from the plan.
- `src/hooks/useTheme.ts` — reads `fbf:theme`, subscribes to `prefers-color-scheme: light`, calls `applyTheme`, persists in `setTheme`. Storage access is in try/catch.
- `index.html` — the pre-paint script is the first element in `<head>`. Preload is the Archivo Expanded latin file only.
- `public/fonts/` — woff2 for Archivo Expanded (latin, latin-ext), Inter variable (latin, latin-ext), JetBrains Mono 400/500 (latin, latin-ext), plus the OFL texts.

#### Verified

- `npm run test -- theme` before `src/lib/theme.ts` existed → FAIL, cannot resolve `@/lib/theme`.
- `npm run test -- theme` after the implementation → 2 passed.
- `npm run test` → 3 passed (theme tests plus the Task 1 toolchain proof).
- `npx tsc -b --noEmit` → exit 0, no output.
- Eye check on a temporary swatch in `src/App.tsx`, then removed so the scaffold `App` stays. Dark: page `#07090D`, no `.light` class, `color-scheme: dark`, grain pseudo-element opacity `0.025`, `--text-tertiary` `#6E7E93` at weight 400 and 16px (4.81:1). Light: `.light`, `color-scheme: light`, page `#F7F8FA`, grain opacity `0`, tertiary `#5E6B7D` at weight 400 (5.10:1). `setTheme` wrote `fbf:theme` and system resolved to dark while the OS preference was dark. Archivo Expanded, Inter, and JetBrains Mono latin files loaded. No Vite error overlay.

#### Decisions

- **Decision:** shadcn variables are `var()` aliases of the semantic tokens, not oklch.
  - **Because:** Step 1's code block writes `--background: var(--bg-base)`, and §2.3 does not publish oklch numbers. Converting the hexes would invent values.
  - **Rejected:** computing oklch equivalents for Tailwind v4.
  - **Risk:** `bg-primary/50`-style opacity modifiers may not decompose a `var()` that points at hex. Re-check when Task 8 adds shadcn components.
  - **Deviation:** yes. Plan step: "Also map shadcn's variable names per §2.3." §2.3 says "Convert hex to the project's color format (HSL for shadcn on Tailwind v3, oklch for Tailwind v4)". Did this instead: defined shadcn names with `var(--semantic-token)`, matching the CSS block in Step 1.

- **Decision:** Did not define `--radius-full` or `--shadow-overlay`.
  - **Because:** §4 names `--radius-full` and §2.2 mentions `--shadow-overlay`, and neither has a value. The plan says to stop rather than choose one.
  - **Rejected:** `9999px` for the pill radius, and an invented overlay shadow.
  - **Risk:** pills and overlay elevation have no token until a value is specified.
  - **Deviation:** no

- **Decision:** Light mode does not override `--accent-warm-edge` or `--vignette`.
  - **Because:** §2.2 does not list them. The only specified values are the dark ones, so `.light` inherits them.
  - **Rejected:** inventing a light-mode edge alpha or a light vignette.
  - **Risk:** the dark vignette is a black fade. On the light swatch it read as a gray wash. Letterbox surfaces in light mode need a decision before they ship.
  - **Deviation:** no

- **Decision:** Z-index tokens are `--z-sticky`, `--z-rail`, `--z-popover`, `--z-sheet`, `--z-dialog`, `--z-toast`. Type tokens keep the §3.2 size name and add `-lh` and `-tracking`. Measure is `--measure: 65ch` and `--measure-max: 72ch`.
  - **Because:** §3.2 and §4 give the numbers and the labels, not custom-property names.
  - **Rejected:** storing line-height and tracking only in comments.
  - **Risk:** a later task may expect different names for the same numbers.
  - **Deviation:** no

- **Decision:** The display face is Archivo at width 125, declared as `font-family: "Archivo Expanded"` with `font-weight: 600 700`, latin and latin-ext only. `font-display: swap` on that face too. Preload is `archivo-expanded-latin.woff2`.
  - **Because:** Google Fonts no longer publishes a separate Archivo Expanded family. The width-125 instance's name table is "Archivo SemiBold Expanded", and the width axis is baked out (`usWidthClass` 7), so `font-stretch: normal` matches the design-system stack. `METADATA.pb` subsets are latin, latin-ext, and vietnamese. There is no Devanagari subset to host. One variable file covers 600 and 700, so a single preload is the display face.
  - **Rejected:** the default (non-expanded) Archivo width, and shipping the vietnamese subset the spec does not ask for.
  - **Risk:** Devanagari display text falls back to Arial Black.
  - **Deviation:** yes. Plan step: "self-host the three families as woff2 under `public/fonts/`" per design-system.md §3.1 "subset to latin + latin-ext + Devanagari for the display face only". Did this instead: latin and latin-ext only, because the source face has no Devanagari glyphs.

- **Decision:** The grain tile uses `type="fractalNoise"` and `stitchTiles="stitch"`.
  - **Because:** the plan says `baseFrequency` around 0.85 and `numOctaves="3"`, and the `.grain` rule is copied verbatim. Default `feTurbulence` looks like clouds, and an unstitched tile seams at 128px.
  - **Rejected:** the default turbulence type and an unstitched tile.
  - **Risk:** none. Dark computed opacity was 0.025; light was 0.
  - **Deviation:** no

- **Decision:** `html` sets background, text color, the Inter stack, and the body size.
  - **Because:** the specified `index.css` registers tokens and does not paint the document. Without this, dark mode leaves the browser's default white canvas.
  - **Rejected:** leaving the page background to the user agent.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** `useTheme` treats a stored value other than `dark`, `light`, or `system` as `system`.
  - **Because:** the hook's return type is the `Theme` union. The inline script is copied verbatim and treats any other string as light.
  - **Rejected:** making the hook match the script's light fallback for garbage values.
  - **Risk:** a corrupt `fbf:theme` flashes light from the script, then the hook resolves `system`.
  - **Deviation:** no

- **Decision:** OFL license texts sit next to the woff2 files.
  - **Because:** the SIL OFL requires the license to be distributed with the fonts.
  - **Rejected:** committing the font files without the license.
  - **Risk:** none.
  - **Deviation:** no

#### Left open

- `--radius-full` and `--shadow-overlay` are named in the design system and have no value.
- Light mode has no token for the warm fill `#F2A65A`. `--accent-warm` in light mode is the text/icon color `#A35A09`. The wash still uses `rgba(242,166,90,0.18)`.
- WCAG contrast of the transcribed hexes does not match every ratio printed in the design system. Light `--accent-warm` `#A35A09` on `#F7F8FA` is 4.91:1 (the table says 5.6). Light `--text-tertiary` is 5.10:1 (the table says 5.5). Both are above the 4.5:1 body-text floor. The hexes were not changed.
- The inline script and `useTheme` disagree on corrupt stored values, as noted above.
