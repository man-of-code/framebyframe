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

### Task 3: Content types and build-time validation

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 3

#### Shipped

- `src/lib/types.ts` — exported the PRD content types plus `Tool`, `CapstoneStage`, and `Content`.
- `src/lib/schema.ts` — exported Zod schemas and cross-reference validation with named issues.
- `src/lib/schema.test.ts` — eight tests covering valid content and required failure modes.
- `src/content/index.ts` — exported an empty, typed content collection for later ledger tasks.
- `scripts/validate-content.ts` — exits nonzero with formatted issues or prints all five content counts.
- `tsconfig.json` — exposed the existing `@/*` source alias to root-level `tsx` scripts.
- `src/lib/noop.test.ts` — removed the temporary Task 1 toolchain proof.

#### Verified

- `npm run test -- schema` before `src/lib/schema.ts` existed → FAIL, cannot resolve `@/lib/schema`.
- `npm run test -- schema` after implementation → 8 passed.
- `npm run validate` with empty content → exit 0; resources, weeks, gaps, tools, and stages were all 0.
- `npm run validate` with a temporary invalid resource → exit 1; named `resource invalid-resource` and `verified`. The resource was then removed.

#### Decisions

- **Decision:** Root `tsconfig.json` defines `baseUrl` and the `@/*` path mapping in addition to `tsconfig.app.json`.
  - **Because:** `tsx` resolves root scripts from the root TypeScript config and otherwise cannot import `@/lib/schema` or `@/content`.
  - **Rejected:** Relative imports in the validation script, because they would make build-time scripts use a different import contract than the application.
  - **Risk:** The alias is duplicated across root and app configs and must remain synchronized.
  - **Deviation:** no

#### Left open

- none

### Task 4: Port the resource ledger

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 4

#### Shipped

- `src/content/resources.ts` — 138 `Resource` records transcribed from Part 1 of the ledger, including the seven module sections and Cross-cutting. HitFilm, Kickstarter, Script Slug, and IMSDb are absent. `verified` is `2026-10-21` on every record. Cursa is `language: "hi"`; every other record is `"en"`.
- `src/content/index.ts` — barrel exports `resources` and a `content` object whose other collections stay empty.

#### Verified

- `npm run validate` → exit 0. `resources: 138`, `weeks: 0`, `gaps: 0`, `tools: 0`, `stages: 0`. The 138 count matches the transcription tally: 21 Module 1 (the Short of the Week row split into two), 18 Module 2, 6 new Module 3, 17 Module 4 (shot-list deduped, the subreddit row split, ShotDeck added), 28 Module 5, 17 Module 6 (HitFilm dropped), 20 Module 7, 11 Cross-cutting (the community row split, two subreddits already present).
- `npx tsc -b --noEmit` → exit 0.
- `npm test` → 10 passed. Not required by the verify step; the schema suite does not import this data.

#### Decisions

- **Decision:** `weeks` is the inclusive range printed on the module heading, unioned when the same resource appears in more than one module. Cross-cutting rows get `weeks: []`. Module 5 editing and sound both get `[9, 10]`. Crew deal memo is `[3, 6]` because the Module 3 row names it for the week 6 assignment while linking only the call sheet.
  - **Because:** the plan does not say how to fill `weeks`, and the heading is the only week span printed on each section.
  - **Rejected:** narrowing each row to the single curriculum week that names it. That mapping belongs to Task 5, and many rows are never named in the week table.
  - **Risk:** week filters for 9 and 10 both show the whole editing-and-sound module. Cross-cutting communities do not appear under a week filter.
  - **Deviation:** no

- **Decision:** A ledger level the schema cannot store maps to its floor: `beginner-intermediate` and `all` become `beginner`, `intermediate-advanced` becomes `intermediate`, `reference` and ArtCraft's `n/a` become `beginner`. Unsane stays `intermediate` because that row states it. Where the ledger printed a range, the `why` text keeps the range.
  - **Because:** `level` is `beginner | intermediate | advanced`, and this curriculum's reader is a beginner. The floor keeps a ranged resource inside the filter a beginner will use.
  - **Rejected:** mapping a range to its ceiling, which would hide BetterFountain, Blackmagic Camera, and the LUT pack from a beginner filter.
  - **Risk:** an intermediate or advanced filter will not show resources whose ledger level was a range or `all`.
  - **Deviation:** no

- **Decision:** Rows with no href still get a real URL. Working Man links the Asian Movie Pulse review that confirms the Redmi Note 7 Pro. Unsane and Manasanamaha link their Wikipedia pages. ShotDeck links `https://shotdeck.com`. Search-term rows (mcpro24fps, AddictiveTips, Digital Camera World, three No Film School roots, BlenderNation sci-fi) link the site root named in the ledger, and `why` states the search term.
  - **Because:** `url` is required, and those rows are either a title with no link or an explicit search term. ShotDeck is not a table row; the Module 4 gap names it and the plan requires `benchmarkOnly` on it.
  - **Rejected:** dropping the rows, and inventing a watch or article URL the ledger did not verify.
  - **Risk:** Working Man, Unsane, and Manasanamaha do not open the film itself. The three No Film School search rows share `https://nofilmschool.com`. iFilmThings is labeled as such and still points at that root, which is what the ledger printed.
  - **Deviation:** no

- **Decision:** A type label outside the enum maps to the nearest member. `video` becomes `youtube`. `shorts` becomes `short-film`. A government portal becomes `service`. A curator page becomes `platform`. GitHub project URLs, including BetterFountain, become `repo`. The Audacity manual becomes `docs`. Corridor Crew's Wikipedia link becomes `article`. Ian Hubert's Patreon link becomes `platform`. Unsane's "background reading" becomes `reading`.
  - **Because:** the schema rejects the ledger's raw labels, and a `youtube` badge on a Wikipedia or Patreon URL would be false.
  - **Rejected:** keeping the column label when it contradicts the href.
  - **Risk:** Blender Guru stays `youtube` because the ledger classifies the channel that way and the href is the creator's site, not a third-party page.
  - **Deviation:** no

- **Decision:** The Fountain, John August script library, and WGA East rows have their level column shifted into the cost cell. Level is `beginner` because the row never states one. WGA cost is `paid` from the `$25, 10 yrs` cell. Fountain's second href and the treatment template href stay inside `why` on the single row.
  - **Because:** copying the cells in order would store `free` as a level and fail the schema.
  - **Rejected:** guessing an intermediate level for the script library.
  - **Risk:** those three are tagged beginner with no ledger sentence that says so.
  - **Deviation:** no

- **Decision:** A stated price is `paid`. A free tier, a paid certificate, or a paid festival fee on a free account is `freemium` (Milanote, FutureLearn, Blender Studio, FilmFreeway, Festhome, mcpro24fps). Incompetech stays `free` because CC-BY use does not require the $30 attribution waiver. The LawSikho article stays `free`; the ₹7,500 SWA fee is in `why`, and it is not `benchmarkOnly`. IDSFFK, BIFFes, and Sci-Fi-London are `paid` because the ledger says a fee exists and does not confirm the amount. They are not `benchmarkOnly`. MIFF and Film Bazaar stay `free` with the historical low-fee caveat in `why`. TakeTen stays `free`.
  - **Because:** `cost` has no "unknown", and a free badge on a festival that charges is the worse error.
  - **Rejected:** marking every unconfirmed fee `free`, and marking the four priced genre festivals as the only paid festivals.
  - **Risk:** Sci-Fi-London, IDSFFK, or BIFFes may turn out to be free or nominal. The `why` text says the amount is unconfirmed. `benchmarkOnly` is only ShotDeck, WGA East, Fantasia, Sitges, Screamfest, and Slamdance.
  - **Deviation:** no

- **Decision:** No resource sets `grayArea`. The Ketto `why` states that India-based creators cannot launch on Kickstarter. The iPleaders `why` states practical norms, not verified law.
  - **Because:** the only gray-area titles the ledger names are Script Slug and IMSDb, which the plan excludes rather than flags. Unconfirmed LUT packs are not rows. The Kickstarter and public-shooting caveats have no row of their own and belong on the resource a learner would open instead.
  - **Rejected:** a Kickstarter resource with `benchmarkOnly` or `grayArea`, which the plan says to omit.
  - **Risk:** a learner who never opens the Ketto record will not see the Kickstarter restriction.
  - **Deviation:** no

- **Decision:** One ledger row that names more than one destination becomes one resource per destination. Short of the Week is `short-of-the-week-thriller` and `short-of-the-week-sci-fi`. The Module 4 subreddit cell is `r-mobile-filmmakers` and `r-cinematography`. The Cross-cutting community cell is one subreddit each, skipping the two already created.
  - **Because:** `Resource` has a single `url`, and Task 5 has to point `resourceIds` at a specific channel or community.
  - **Rejected:** keeping one record and burying the second URL in `why`, which is what the treatment and Fountain rows do when the second link is an attachment of the same resource.
  - **Risk:** the resource count is higher than the row count. Slugs Task 5 will need: `short-of-the-week-thriller`, `short-of-the-week-sci-fi`, `r-mobile-filmmakers`, `r-cinematography`, `r-filmmakers`, `r-indie-filmmakers`, `r-filmmaker-support`, `r-davinci-resolve`, `r-blender`, `r-sounddesign`.
  - **Deviation:** yes. Plan step: "Every row becomes one Resource." Did this instead: split a row when it names two or more destinations that each need their own URL.

#### Left open

- Working Man, Unsane, and Manasanamaha still need a verified watch URL before the library presents them as the film.
- iFilmThings points at the No Film School root because that is the href in the ledger. The article may live elsewhere.
- ShotDeck's product URL was not in the ledger.
- Sci-Fi-London, IDSFFK, and BIFFes fees are unconfirmed and badged `paid`.
