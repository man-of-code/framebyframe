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

### Task 5: Port the curriculum, gaps, tools, and capstone stages

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 5

#### Shipped

- `src/content/weeks.ts` — 16 weeks. Core weeks 1–12 have watch, read, and do tasks. Weeks 13–16 have `tasks: []`, `extension: true`, `module: 0`, and one `gapIds` entry. `heavy` is set only on weeks 3 and 8. Week 4 has no `capstoneStage`.
- `src/content/gaps.ts` — 9 gaps: two global, three module, four extension-week.
- `src/content/tools.ts` — 22 tools. ArtCraft is `experimental: true`. DaVinci Resolve carries the free-edition limitation. GIMP, Krita, and Inkscape are included.
- `src/content/capstone.ts` — 8 stages. `criteria` are the linked weeks' assignment checks, copied in week order.
- `src/content/index.ts` — `content` now includes `resources`, `weeks`, `gaps`, `tools`, and `capstone`, and still re-exports `resources`.
- `src/content/content.test.ts` — the plan's content guard, copied verbatim.

#### Verified

- `npm run validate` → exit 0. `resources: 138`, `weeks: 16`, `gaps: 9`, `tools: 22`, `stages: 8`.
- `npx tsc -b --noEmit` → exit 0.
- `npm run test -- content` → 7 passed.
- `npm run test` → 17 passed (3 files).

#### Decisions

- **Decision:** No `hours` field was added. Each core week's stated estimate is the sum of its task minutes: week 1 = 300, 2 = 420, 3 = 480, 4 = 240, 5 = 360, 6 = 240, 7 = 480, 8 = 600, 9 = 420, 10 = 360, 11 = 480, 12 = 360. Those totals divide evenly across that week's tasks (including stretch), so the last core task gets no extra remainder. Extension weeks have no tasks and no minutes.
  - **Because:** `Week` has no hours field, and the week's hours display is the sum of its tasks' minutes. The sum must equal the stated estimate and must not go above it.
  - **Rejected:** adding minutes for a stretch task on top of the estimate, and storing the hour total on the week.
  - **Risk:** week 2's pitch deck and week 8's lighting test consume part of the stated core estimate rather than sitting outside it.
  - **Deviation:** no

- **Decision:** One task per Watch, Read, and Do cell. The week 2 pitch deck, the week 3 storyboard, and the week 8 lighting test are extra do tasks with `core: false`. Every other task is `core: true`.
  - **Because:** the ledger marks only part of those three cells as stretch, and the brief says anything the ledger marks stretch is `core: false`. The plan's examples name weeks 3 and 8; the week 2 minutes cell also marks the pitch deck as stretch.
  - **Rejected:** marking the whole week 2 or week 3 do cell as stretch, and dropping the pitch deck because the plan's examples omit week 2.
  - **Risk:** week 2 has four tasks, so its 420 minutes are 105 each, including the stretch pitch deck.
  - **Deviation:** no

- **Decision:** `brochureNo` is only the first assignment number on the row: week 2 is 2, week 3 is 6, week 11 is 14. Weeks 6, 7, 8, and 12, and extension weeks 13–16, omit `brochureNo`. Their assignment text keeps the table's "New (no brochure source)" or "replaced — brochure duplicate" wording. Later numbers on a multi-number row stay in the text.
  - **Because:** `assignment` is one object with one optional `brochureNo`.
  - **Rejected:** inventing a second assignment object for A4, A5, A7, A15, or A17.
  - **Risk:** A4, A5, A7, A15, and A17 are not recoverable from `brochureNo`. Week 11's text also includes the minutes-cell line "Cap VFX ambition to one shot." Week 12's done-when says five EPK components; the do cell names four (bio, synopsis, press release, poster).
  - **Deviation:** no

- **Decision:** Done-when cells split on a semicolon that joins two checks. Week 13 keeps its done-when as one check, "Every shot on the original shot list now exists in usable footage", and the second check is the row's other obligation, "Reshoots and pickups cover anything missed in weeks 7–8". Week 14's semicolon splits the parenthetical, and "YouTube-ish" stays on the LUFS check: "LUFS roughly in the -14 to -16 range (YouTube-ish)" and "Re-check target festival specs". Week 4 was still one condition after that rule, so it was split into two checks the sentence already states. The weekly self-review checklist is not a check.
  - **Because:** every assignment needs at least two checks, and a semicolon that joins two checks is the split. "YouTube-ish" modifies the LUFS range. Week 13's done-when is one clause, so the second check is the reshoot obligation.
  - **Rejected:** splitting week 13 into "exists in the footage" and "The footage is usable", leaving week 14's second check as "YouTube-ish; re-check target festival specs", and adding the self-review questions as checks.
  - **Risk:** week 13's second check restates the assignment line rather than a second done-when sentence.
  - **Deviation:** no

- **Decision:** Weeks 13–16 have empty `tasks`, `extension: true`, and `gapIds` of exactly `extension-week-13` through `extension-week-16`. `heavy: true` is only weeks 3 and 8.
  - **Because:** an empty task list without a gap fails `validateContent`, and the ledger flags only weeks 3 and 8 as heavier.
  - **Rejected:** inventing watch/read tasks for the buffer weeks, and marking week 7 or week 11 heavy because their estimates are 8 hours.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** `community` is the ledger's community cell, with the strings specified for this task. `communityCaveat` is set only on weeks 1 and 2 ("read the FAQ and Logline Monday rules first") and week 12 ("post work once live"). Week 13's community is an empty string. The generic "read each subreddit's wiki" note is not copied onto every week.
  - **Because:** the week-1 cell states the Screenwriting caveat, week 2 uses the same community, and week 12's cell says to post work once live. The cross-cutting wiki note is not a per-week flag.
  - **Rejected:** putting the wiki note on every subreddit week, and copying week 1's slash wording ("FAQ/Logline") instead of the required sentence.
  - **Risk:** week 11's community is the string "r/vfx or r/blender". There is no `r/vfx` resource.
  - **Deviation:** no

- **Decision:** Capstone stages are premise (week 1), script (2), shot list (3, 5, 6), shoot (7, 8, 13), rough cut (9), sound (10, 14), final cut (11, 15), and submissions (12, 16). Week 4 has no stage. Each stage's `criteria` are those weeks' checks, in week order, copied rather than rewritten.
  - **Because:** the brief names the eight stages and says criteria come from the matching week's done-when checks. It does not assign week numbers. Week 4 is an analysis exercise, not a pipeline artifact. Extension weeks continue the stage their buffer job belongs to.
  - **Rejected:** giving week 4 its own stage, and attaching week 4 to shot list because it sits between weeks 3 and 5.
  - **Risk:** shoot, sound, final cut, and submissions include extension-week checks, including the week 13 and week 14 checks above.
  - **Deviation:** no

- **Decision:** `indian-language-craft` `attempted` lists the categories the cross-cutting section names, plus the Pawan Kumar near-miss. It does not contain search-query strings, channel names, or person names, because Batch G's list is not in this repo. `raw-footage-practice` `attempted` restates the Part 2 sentence that the pass verified no source; it names no archive. The note uses the paragraph's "week 7's lighting-setup exercise." Module gaps `hindi-resolve-sound` and `hindi-blender-vfx` have empty `attempted` arrays because those notes state a conclusion and no queries.
  - **Because:** the brief asks for the list Batch G documented, and the ledger file does not contain it. Inventing queries would be a false record.
  - **Rejected:** writing plausible Hindi/Tamil query strings, and moving the lighting-test fallback from week 7 to week 8 to match the week table.
  - **Risk:** the attempted list cannot be re-run as a search. The raw-footage note says week 7; the week table puts the lighting test in week 8.
  - **Deviation:** no

- **Decision:** The toolkit is every resource with `type: "tool"`, plus the installable apps the ledger types as `repo` or documents as Audacity, plus DaVinci Resolve, GIMP, Krita, and Inkscape. Homepages the ledger does not give: DaVinci Resolve `https://www.blackmagicdesign.com/products/davinciresolve` (parent of the Fairlight and training URLs in the ledger), Audacity `https://www.audacityteam.org/` (host of the manual URL), GIMP `https://www.gimp.org/`, Krita `https://krita.org/`, Inkscape `https://inkscape.org/`. Their licenses are the projects' published ones (GPL-3.0, GPL-3.0, GPL-2.0) because the ledger does not state them. `firstWeek` is the earliest week on the matching resource, or 11 for GIMP, Krita, and Inkscape because that is the ArtCraft module. The CGChannel LUT pack's `firstWeek` is 9 from its resource weeks, not 15 where the week table names it.
  - **Because:** the ledger names those tools and does not give those five homepages. A guessed download mirror would be worse than the project homepage.
  - **Rejected:** omitting GIMP, Krita, and Inkscape; omitting DaVinci Resolve because only Fairlight is `type: "tool"`; using the Storyblocks free-vs-studio article as Resolve's download URL.
  - **Risk:** those five URLs are homepages, not direct download files. The LUT pack appears from week 9. GIMP, Krita, and Inkscape appear from week 11, while the poster assignment is week 12.
  - **Deviation:** no

- **Decision:** `src/content/content.test.ts` is the brief's guard copied verbatim, and it was written after the week, gap, tool, and capstone modules.
  - **Because:** the brief says not to weaken the test, and it orders transcription before that test.
  - **Rejected:** adding assertions for minute totals or brochure numbers inside that file, which would change the specified test.
  - **Risk:** none. The guard does not check minute sums, brochure numbers, or that criteria match the week checks.
  - **Deviation:** no

- **Decision:** `src/content/index.ts` exports `content` with `resources`, `weeks`, `gaps`, `tools`, and `capstone`, and re-exports `resources`, using the existing `@/lib/types` import.
  - **Because:** that is the collection shape `validateContent` and the guard test import.
  - **Rejected:** a default export, or leaving the non-resource arrays empty.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** Extension weeks 13–16 use `module: 0`. Titles and topics are the Module & focus cell: the focus phrase is the title, and the comma-separated items are `topics`. Buffer weeks are titled "Buffer" with `topics: ["buffer"]`.
  - **Because:** `Week.module` is a number, the buffer is not an eighth module, and the brief does not assign those weeks to modules 1–7.
  - **Rejected:** `module: 8`, and repeating module 4–7 onto the buffer week that continues that work.
  - **Risk:** any UI that assumes modules are 1–7 will not group weeks 13–16.
  - **Deviation:** no

- **Decision:** A do or watch cell links a resource only when that cell names the source, or when the stretch task is the storyboard and `storyboarder` is the week 3 storyboard tool. Week 11's do task links `blender` only. Week 9's do task has `resourceIds: []`. Week 8's watch links `ifilmthings-low-key-lighting` for "No Film School: Low-Key Lighting" and `no-film-school-diy-gimbal` for the gimbal.
  - **Because:** there is no Fusion resource, the week 9 cell does not name the EditingTools.io proxy article, and the only low-key resource is the iFilmThings row whose URL is the No Film School root.
  - **Rejected:** linking `davinci-resolve-training` or `davinci-resolve-fairlight` as Fusion, linking `davinci-resolve-proxy-workflow` without the cell naming it, and leaving the low-key half of week 8 with no resource.
  - **Risk:** week 11 does not open a Fusion page. Week 9 does not open the proxy article. The low-key resource title says iFilmThings.
  - **Deviation:** no

#### Left open

- Week 8's low-key link is `ifilmthings-low-key-lighting`. The week cell says "No Film School: Low-Key Lighting." Task 4 already recorded that this resource points at the No Film School root.
- Week 11 names Resolve Fusion and no resource id is the Fusion page. Week 9 says "proxies if needed" and does not link `davinci-resolve-proxy-workflow`.
- Week 12's check says five EPK components. The do cell names four.
- The raw-footage gap follows the ledger's "week 7's lighting-setup exercise." The week table puts the lighting test in week 8.
- DaVinci Resolve, Audacity, GIMP, Krita, and Inkscape use project homepages the ledger does not print.

### Task 6: Progress engine

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 6

#### Shipped

- `src/lib/progress.ts` — versioned `fbf:progress:v1` load, save, toggle, note, capstone stage, start date, week override, export, import, and `countDone`. Storage failures return `unavailable`. Bad JSON and a wrong version return `corrupt` and a blank progress. Import never throws.
- `src/lib/progress.test.ts` — the plan's 11 tests.
- `src/hooks/useProgress.ts` — `{ progress, status, toggle, note, stage, setStartDate, setWeekOverride, replace }`. Reads storage in the first render, debounces writes 300ms, flushes on unmount and `pagehide`.
- `src/hooks/useProgress.test.ts` — debounce, unmount flush, `pagehide` flush, read failure, write failure, and recovery after a later successful write.

#### Verified

- `npm run test -- progress` → 19 passing, exit 0. The filter matches both test files. The plan's 11 library tests are inside that run.
- `npm test` → 36 passing, exit 0.
- `npx tsc -b` → exit 0.
- `npx oxlint` on the four new files → exit 0.

#### Decisions

- **Decision:** `useProgress` reads storage in the `useState` initializer.
  - **Because:** the shell renders the read-only banner from `status` on the first paint.
  - **Rejected:** loading in `useEffect`, which would paint `empty` before the real status.
  - **Risk:** none in this Vite client app. A server render would not see `localStorage`.
  - **Deviation:** yes. Plan step: "loads once on mount". Did this instead: load once during the first render so `status` is already set.

- **Decision:** A pending write flushes on unmount and on `pagehide`, ahead of the 300ms debounce. A failed debounced write sets `status` to `unavailable`, and a later successful write sets it back to `ok`.
  - **Because:** a route change unmounts the hook, a tab close does not run the effect cleanup, and a quota error that later clears would otherwise leave the read-only banner up.
  - **Rejected:** flushing only through the debounce, and adding `beforeunload` beside `pagehide`.
  - **Risk:** a save that fails inside the unmount cleanup cannot update `status`.
  - **Deviation:** yes. Plan step: "debounces `saveProgress` by 300ms". Did this instead: debounce while the hook is mounted, and flush on unmount and `pagehide`.

- **Decision:** `setStartDate` and `setWeekOverride` live in `src/lib/progress.ts`. `setWeekOverride(p, undefined)` deletes the key. The hook only calls those functions.
  - **Because:** the plan says the hook contains no business logic.
  - **Rejected:** spreading `startDate` and deleting `weekOverride` inside the hook.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** Import keeps booleans in `done`, strings in `notes`, `todo` | `doing` | `done` in `capstone`, and optional fields only when their types match. Other entries are dropped and the import still returns `ok: true`. Failed loads return a new blank object. A stored version other than 1 is `corrupt`, and the next edit overwrites that blob.
  - **Because:** the value has to match `Progress`, and returning the `emptyProgress` singleton would let a caller mutate every later empty read.
  - **Rejected:** failing the import when one entry has the wrong type, and copying the rejected blob to a second localStorage key before overwrite.
  - **Risk:** a newer schema under this key is replaced on the next edit. A wrong-typed note or checkbox disappears on import.
  - **Deviation:** no

- **Decision:** The hook has its own test file, so `npm run test -- progress` reports 19 tests.
  - **Because:** the plan's 11 tests never mount the hook, and the debounce can pass those tests while writing on the wrong tick.
  - **Rejected:** leaving `useProgress` untested.
  - **Risk:** none.
  - **Deviation:** no

#### Left open

- A version other than 1 already stored at `fbf:progress:v1` loads as `corrupt` and is overwritten on the next edit. There is no backup key.
- Import drops wrong-typed `done`, `notes`, and `capstone` entries and still returns `ok: true`.

### Task 7: Week derivation

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 7

#### Shipped

- `src/lib/week.ts` — `TOTAL_WEEKS` 16, `CORE_WEEKS` 12, `rawWeekNumber`, `clampWeek`, and `resolveCurrentWeek`. Week comes from local calendar days. An override replaces the displayed week and is clamped to 1–16. `complete` is true only when the derived week is past 16.
- `src/lib/week.test.ts` — the plan's 12 tests.
- `src/hooks/useCurrentWeek.ts` — takes the shell's `Progress` and returns `resolveCurrentWeek(progress, new Date())` on each render.

#### Verified

- `npm run test -- week` → 12 passing, exit 0.
- `npm test` → 48 passing, exit 0.
- `npx tsc -b` → exit 0.
- `npx oxlint` on the three new files → exit 0.
- `TZ=America/New_York` comparison for start `2026-03-01`: on `2026-03-15` the plan's `getTime()` division returns week 2 and the shipped calendar-day count returns week 3. On `2026-03-22` the same split is week 3 versus week 4.

#### Decisions

- **Decision:** Day count is `Date.UTC` of the local year, month, and day for both the start date and `now`.
  - **Because:** in `America/New_York`, the spring-forward on 2026-03-08 makes a `getTime()` delta one hour short. `Math.floor` then reports one fewer day, so each later week boundary (14 days, 21 days) stays on the previous week for that day.
  - **Rejected:** `localMidnight(now).getTime()` divided by `86_400_000`, which is the snippet in the plan.
  - **Risk:** a zone with a transition other than a one-hour shift is not covered by the 12 tests. The 12 tests pass in the host zone and do not include 2026-03-15.
  - **Deviation:** yes. Plan step: "const days = Math.floor((localMidnight(now) - start) / 86_400_000)". Did this instead: divide the UTC timestamps of the two local calendar dates.

- **Decision:** `useCurrentWeek(progress)` takes `Progress` and does not call `useProgress`.
  - **Because:** `useProgress` stores state in the component that calls it. A second call inside this hook would not see the shell's progress.
  - **Rejected:** reading storage again inside the week hook.
  - **Risk:** the caller has to pass the same `progress` value it is editing. There is no midnight timer; the week changes on the next render.
  - **Deviation:** no

- **Decision:** A numeric `weekOverride` with no `startDate` is `source: "override"` and `complete: false`. `complete` still follows the derived week when both are set, so an override of week 5 after the calendar has passed week 16 is `{ week: 5, source: "override", complete: true }`.
  - **Because:** the plan says the override wins the displayed week, and `complete` is `rawWeekNumber(...) > TOTAL_WEEKS`, which needs a start date. Those two fields answer different questions.
  - **Rejected:** treating a lone override as `unset`, treating a clamped override of 99 during week 1 as completion, and forcing `complete` false whenever `source` is `override`. The last one would hide the past-week-16 state for anyone who had set an override.
  - **Risk:** a later screen that treats `complete` and `week` as one fact will show the finished-curriculum state on an overridden earlier week. The 12 tests do not cover an override without a start date, or an override while the calendar is past week 16.
  - **Deviation:** no

#### Left open

- `useCurrentWeek` has no test. `npm run test -- week` would count a file whose name contains `week`, and the plan's verify step expects 12.
- A start date that is not `YYYY-MM-DD` makes `rawWeekNumber` return `NaN`. Nothing in this task rejects it.

### Task 8: App shell and navigation

- **Status:** complete
- **When:** 2026-10-22
- **Plan reference:** `docs/implementation-plan.md` → Task 8

#### Shipped

- `components.json` — shadcn config for `src/index.css`, alias `@/components`, Radix Vega, Lucide.
- `src/components/ui/*` — the plan's primitives, plus `input`, `input-group`, and `toggle` because `command` and `toggle-group` import them. Icons are Lucide. `sonner` reads `useTheme`.
- `src/lib/utils.ts` — `cn`.
- `src/index.css` — Tailwind color aliases of the existing tokens, and the focus ring. No second palette.
- `src/router.tsx` — `createBrowserRouter`. `/` is the lazy landing without a `startDate` and the eager dashboard with one. `/plan`, `/week/:n`, `/library`, `/capstone`, `/toolkit`, `/about` are lazy. `/week/:n` outside 1–16 renders not-found. Unknown paths stay in the shell.
- `src/lib/route-week.ts` — `parseWeekParam`.
- `src/routes/Root.tsx` — skip link, rail or mobile bar and bottom tabs, read-only banner when `status === "unavailable"`, outlet, toaster.
- `src/components/nav/LeftRail.tsx` — 240px rail, week numeral, brand, empty filmstrip slot, the six destinations, theme toggle.
- `src/components/nav/BottomTabs.tsx` — Today, Plan, Library, Capstone, More. 56px bar plus the safe-area inset.
- `src/components/nav/MoreSheet.tsx` — Toolkit, About, theme, export, import.
- `src/components/nav/items.ts` — `NAV_ITEMS`.
- `src/components/SkipLink.tsx`, `src/components/nav/ThemeToggle.tsx`, `src/components/nav/WeekNumeral.tsx`, `src/components/nav/shell.css`.
- `src/routes/Dashboard.tsx`, `Landing.tsx`, `Plan.tsx`, `Week.tsx`, `Library.tsx`, `Capstone.tsx`, `Toolkit.tsx`, `About.tsx` — placeholder screens so the router can mount. Later tasks replace them.
- `src/App.tsx` — mounts the router.

#### Verified

- Browser on `npm run dev`, viewport overrides 360×800, 767×800, 768×900, 1024×900, and 1440×900.
- 360: no horizontal scroll (`scrollWidth` 360). Bottom tabs, no rail. Each tab 62×56. Gaps 8px. Mobile bar 48px tall. Tab tops at 745px of 800px.
- 767: bottom tabs, no rail. 768: rail 240px, no tabs, no mobile bar. 1024 and 1440: no horizontal scroll, rail 240px.
- Nav targets and the theme options measure at least 48×48. Desktop nav gaps and theme gaps are 8px.
- Active tab background is `rgba(106, 184, 255, 0.12)`. The week numeral is `rgb(242, 166, 90)`. A forced `:focus-visible` on a nav link is `2px solid rgb(106, 184, 255)` with offset 2px.
- `/week/0` and `/week/foo` render "Week not found". `/week/7` renders "Week 7". `/` with no `startDate` renders the landing. `/` with `startDate` `2026-10-01` renders the dashboard. `/plan` and `/toolkit` render those headings. `/nope` stays in the shell.
- More opens from the tab bar. Escape closes it. Toolkit inside it navigates to `/toolkit` and closes the sheet. Choosing Light adds `class="light"` on `html`.
- `npm run test -- route-week` → 3 passing. `npm test` → 51 passing, exit 0. `npx tsc -b` → exit 0.

#### Decisions

- **Decision:** The primitives came from `https://ui.shadcn.com/r/styles/radix-vega/*.json`, with registry paths rewritten to `@/components/ui` and `IconPlaceholder` rewritten to Lucide. Preset Vega, base Radix.
  - **Because:** `npx shadcn@latest init` stops on a preset prompt, and the non-interactive init's Node fetch to `ui.shadcn.com` times out at 10s. `curl` returns the same payload the CLI requests.
  - **Rejected:** the CLI default `base-nova` preset, and copying the registry files with their `@/app/(create)` icon imports.
  - **Risk:** a later `npx shadcn add` from Node can hit the same timeout.
  - **Deviation:** yes. Plan step: "`npx shadcn@latest init`" then "`npx shadcn@latest add button checkbox …`". Did this instead: wrote `components.json` and the component files from the radix-vega registry.

- **Decision:** `index.css` does not contain the registry's oklch palette. `@theme` points Tailwind color names at the tokens already in `tokens.css`. `--color-secondary-foreground` and `--color-accent-foreground` use `--text-primary`. `font-inter` was not installed.
  - **Because:** `tokens.css` is the color source, and the display, body, and mono faces are already self-hosted.
  - **Rejected:** pasting the init payload's light and dark oklch blocks, and adding a second Inter.
  - **Risk:** a utility that expects `--color-secondary-foreground` to differ from body text will not.
  - **Deviation:** no

- **Decision:** `sonner.tsx` calls `useTheme` from `@/hooks/useTheme` and passes `resolved` to the toaster.
  - **Because:** the registry file imports `next-themes`, and this app switches theme with a `light` class on `html`, not `next-themes`.
  - **Rejected:** installing `next-themes` beside `useTheme`.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** The theme control is in the desktop rail and in the More sheet.
  - **Because:** the sheet is the mobile overflow. At 768px and up that sheet is not mounted, so the rail is the only place the control can sit.
  - **Rejected:** a desktop shell with no theme control.
  - **Risk:** none.
  - **Deviation:** yes. Plan step: "`MoreSheet`: Toolkit, About, theme toggle, export/import." Did this instead: the same control is also the last block in `LeftRail`.

- **Decision:** `NAV_ITEMS` is the six rail destinations. `BOTTOM_TABS` is Today, Plan, Library, and Capstone. More is the sheet trigger, not an item in either array.
  - **Because:** the interface asks for `NAV_ITEMS` as `{ to, label, icon }`, and the mobile label for `/` is Today while the rail label is Dashboard.
  - **Rejected:** one array whose labels could not satisfy both bars.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** Export downloads `frame-by-frame-progress.json`. A failed import toasts `reason` and does not call `replace`.
  - **Because:** the sheet is specified to contain export and import, and Task 17 names that filename and the failure behavior.
  - **Rejected:** buttons that do nothing until Task 17.
  - **Risk:** Task 17 should move this JSX into `ExportImport.tsx` instead of writing a second copy.
  - **Deviation:** no

- **Decision:** Pages that later tasks own are placeholder modules, lazy-imported except `Dashboard`.
  - **Because:** the router has to resolve those paths now, and those tasks replace the file bodies.
  - **Rejected:** inline screens inside `router.tsx` with no route modules.
  - **Risk:** a later task that expects to create `src/routes/Plan.tsx` from scratch will find the placeholder.
  - **Deviation:** yes. Plan file list for this task does not include `Dashboard.tsx`, `Landing.tsx`, `Plan.tsx`, `Week.tsx`, `Library.tsx`, `Capstone.tsx`, `Toolkit.tsx`, or `About.tsx`. Did this instead: added those files as placeholders.

- **Decision:** `main.tsx` still mounts `App`. `App` mounts the router.
  - **Because:** `main.tsx` had no other job.
  - **Rejected:** moving `RouterProvider` into `main.tsx` and leaving `App` unused.
  - **Risk:** none.
  - **Deviation:** yes. Plan file list: "Modify: `src/App.tsx`, `src/main.tsx`". Did this instead: modified `src/App.tsx` only.

- **Decision:** Paths that match no route render "Page not found" inside the shell.
  - **Because:** an unmatched URL would otherwise leave the router error outside the rail and the tabs.
  - **Rejected:** no catch-all.
  - **Risk:** none.
  - **Deviation:** no

#### Left open

- `useProgress` keeps state in the component that calls it. The shell calls it once. A later page that calls `useProgress()` on its own will not share that state.
- The filmstrip slot in the rail is empty until Task 9.
- Node's fetch to `ui.shadcn.com` timed out. `curl` did not.

### Task 9: Filmstrip components

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 9

#### Shipped

- `src/components/filmstrip/WeekFrame.tsx` — link to `/week/:n`, padded timecode, exposed check with an accessible complete label, `aria-current="step"` on the current frame, heavy chip, rail and card density.
- `src/components/filmstrip/FilmstripRail.tsx` — sixteen frames from `content.weeks`, one splice before the first extension week.
- `src/components/filmstrip/filmstrip.css` — sprocket gradient, state fills and borders, 48px targets, 8px separation.
- `src/components/filmstrip/WeekFrame.test.tsx` — the four tests from the plan.
- `src/components/nav/LeftRail.tsx` — vertical compact rail in the slot Task 8 left empty.
- `src/routes/Root.tsx` — passes the shell progress snapshot into that rail.

#### Verified

- `npm run test -- WeekFrame` → 4 passing.
- `npx tsc -b --noEmit` → exit 0.
- `npm run test` → 55 passing.
- Browser, 1440px wide: 16 week links, the stored current week has `aria-current="step"`, smallest target 175×48, smallest gap 8px, document does not overflow horizontally. Clicking week 7 navigated to `/week/7`.
- Browser, 360px wide: the rail is unmounted with the rest of the left rail, and `scrollWidth` equals `clientWidth`.

#### Decisions

- **Decision:** A week is exposed only when it has at least one core task and every core task id is done. The current week stays current even if those tasks are done. Stretch tasks are ignored. Extension weeks have no tasks, so they stay unexposed.
  - **Because:** the plan names the three states and does not define completion. `countDone` already counts ids in `progress.done`. Assignment-check ids are not written until Task 11.
  - **Rejected:** treating every past week as exposed, and counting stretch tasks or the future check ids.
  - **Risk:** a week whose tasks are done and whose assignment checks are not will already read as exposed. Task 10 should pass the same progress object the page is editing.
  - **Deviation:** no

- **Decision:** `FilmstripRail` takes an optional `progress` prop, and the shell passes the snapshot from `Root`. The component still calls `useProgress()` when the prop is omitted.
  - **Because:** `useProgress` is not a shared store, and the plan's props do not include progress. A second call inside the rail would render a stale copy.
  - **Rejected:** reading only the internal hook, and widening the required props so every caller must pass progress.
  - **Risk:** a later page that renders `<FilmstripRail />` without `progress` will not update when the shell edits progress. The unused hook does not write, because this component never calls its mutators.
  - **Deviation:** no

- **Decision:** One splice item is inserted before the first week with `extension` set.
  - **Because:** weeks 13–16 are the extension block, and a gap on every one of those frames would split the block.
  - **Rejected:** hardcoding week 13, and drawing a splice on each extension frame.
  - **Risk:** a later week flagged `extension` ahead of week 13 would move the splice.
  - **Deviation:** no

- **Decision:** The current frame uses a 2px `border-color` of `--accent-warm`, not the CSS `outline` property.
  - **Because:** `:focus-visible` already draws a 2px `--accent-primary` outline. A second outline would replace that ring.
  - **Rejected:** `outline: 2px solid var(--accent-warm)` on the current frame.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** The link name comes from the timecode, title, and heavy chip. The check's accessible name is `Complete` and is not part of that name.
  - **Because:** the exposed test asks for one link and a separate complete label. Putting "complete" in the link name makes that query match both.
  - **Rejected:** an `aria-label` on the link that repeats the visible text.
  - **Risk:** the ratio is in the accessibility tree of the list item and not in the link name.
  - **Deviation:** no

- **Decision:** The rail is mounted from `LeftRail`, with `compact` clipping the heavy chip. Rail frames show the timecode; card frames show module, title, ratio, and the chip.
  - **Because:** Task 8 left an empty slot for this component, and the 240px column cannot show sixteen full titles.
  - **Rejected:** leaving the slot empty until Task 10.
  - **Risk:** none for the card test, which uses card orientation. A non-compact rail shows the heavy chip in the row.
  - **Deviation:** yes. Plan step: "Create: `src/components/filmstrip/FilmstripRail.tsx`, `src/components/filmstrip/WeekFrame.tsx`, `src/components/filmstrip/filmstrip.css`, `src/components/filmstrip/WeekFrame.test.tsx`". Did this instead: also edited `LeftRail.tsx` and `Root.tsx` so the slot renders the rail.

- **Decision:** The return type is `JSX.Element` imported from `react`.
  - **Because:** the plan's signature uses `JSX.Element`, and this project's React types do not provide a global `JSX` namespace.
  - **Rejected:** dropping the return type.
  - **Risk:** none.
  - **Deviation:** no

#### Left open

- `FilmstripRail` without a `progress` prop does not share the shell's progress store.
- Card frames are not on a route yet. Task 10 places them.

### Task 10: /plan

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 10

#### Shipped

- `src/routes/Plan.tsx` — `/plan` reads the shell progress snapshot, marks the current week, and groups all 16 weeks.
- `src/components/plan/ModuleGroup.tsx` — one module section: mono eyebrow, title, optional note, and card frames.
- `src/components/plan/plan.css` — vertical sprocket list below 768px, 2-column grid at 768px, splice before the buffer group.
- `src/components/filmstrip/WeekFrame.tsx` — card frames can show hours, the completion ratio, a capstone stage, and a module label.
- `src/routes/Plan.test.tsx` — 16 frames, 7 modules plus buffer, hours and stage, current and exposed states.

#### Verified

- `npm run test -- Plan` → 3 passing. `npm run test -- WeekFrame` → 4 passing. `npm run test` → 58 passing. `npx tsc -b --noEmit` → exit 0.
- Browser, 360px: 8 groups, 16 card frames stacked, horizontal progress strip in the header, `scrollWidth` equals `clientWidth`. Smallest card target is above 48px.
- Browser, 1100px: writing weeks 1 and 2 sit side by side (`394px 394px`). The page-level strip is `display: none`. Week 1 with its three core tasks done reads `exposed` with the check. Week 7, set with `weekOverride`, has `aria-current="step"`. Clicking that frame navigated to `/week/7`.

#### Decisions

- **Decision:** The seven module titles are the ledger headings: Writing, Pre-production, Directing, Cinematography, Editing and Sound, Post-production and VFX, Marketing, Distribution and Career.
  - **Because:** `Week.module` is only a number, and the plan does not name the headers.
  - **Rejected:** numbering the headers with no subject.
  - **Risk:** a later rename in the ledger will not update this list.
  - **Deviation:** no

- **Decision:** Hours are the sum of that week's task minutes, rendered as `Nh` when the result is whole and one decimal otherwise. Extension weeks render `0h`. The ratio is core tasks only, and a week with no core tasks renders `0/0`. The current week stays current even when its core tasks are done.
  - **Because:** there is no `hours` field, and Task 5 recorded the stated estimate as that sum. Task 9 already defined exposed as "every core task done, unless this is the current week".
  - **Rejected:** hiding the ratio when the total is 0, and counting stretch tasks.
  - **Risk:** `0/0` reads as an empty fraction. Week 4 has no `capstoneStage`, so that frame has no stage line.
  - **Deviation:** no

- **Decision:** The page takes `progress` from the shell outlet and passes that same object to `useCurrentWeek`, `ModuleGroup`, and `FilmstripRail`.
  - **Because:** `useProgress` is not a shared store. A second call would not see edits made by the shell.
  - **Rejected:** calling `useProgress()` inside `Plan`.
  - **Risk:** rendering `Plan` outside `Root` throws, because `useOutletContext` is required.
  - **Deviation:** yes. Plan step: "Consumes: `FilmstripRail`, `WeekFrame`, `useProgress`, `useCurrentWeek`, `content`." Did this instead: did not call `useProgress`; used the outlet snapshot Task 9 said this page should pass.

- **Decision:** `FilmstripRail` is a horizontal compact strip on `/plan` below 768px and is not rendered visually at 768px and above.
  - **Because:** the design system places that rail in the desktop left column and in the mobile `/plan` header. The left rail already mounts it.
  - **Rejected:** a second vertical rail beside the module groups on desktop.
  - **Risk:** the hidden strip stays in the DOM. `display: none` keeps it out of tab order.
  - **Deviation:** no

- **Decision:** Card frames gained optional `hours`, `stage`, and `moduleLabel` props. Buffer frames pass `Buffer` because `module` is 0. The card's accessible name includes hours, ratio, and stage. The rail's name does not.
  - **Because:** the plan requires those fields on the frame, and `aria-labelledby` replaces the link's contents. The rail must stay within the Task 9 name.
  - **Rejected:** painting the extra lines outside the link, and a second frame component.
  - **Risk:** a card test that asserts the exact accessible name now includes the ratio.
  - **Deviation:** no

- **Decision:** Each module header uses grain, the vignette, and 8px inset bars. The header is not a 2.39 letterbox.
  - **Because:** eight full letterboxes would sit above the frames and push them off a phone. Grain on module cards is the part that still applies.
  - **Rejected:** `aspect-ratio: 2.39 / 1` on the module section.
  - **Risk:** the module header will not match a later letterbox component that does use 2.39.
  - **Deviation:** yes. Plan step: "Per `docs/prd.md` §4.3." The design system §6 also assigns letterbox containers (`aspect-ratio: 2.39/1`) to module cards. Did this instead: letterbox bars and vignette on the header only, with no 2.39 ratio.

#### Left open

- Weeks 13–16 are all titled "Buffer" in the content records. The frame numeral and capstone stage are what distinguish them.
- Extension weeks have no core tasks, so they stay unexposed and show `0/0`.

### Task 11: /week/:n

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 11

#### Shipped

- `src/routes/Week.tsx` — week page in the §4.4 order: letterboxed header, Watch, Read, Do, notes, community, self-review. An empty Watch or Read section renders that week's gap cards.
- `src/components/week/WeekHeader.tsx` — eyebrow, title, topic chips, core hours, capstone stage, heavy chip, previous and next week.
- `src/components/week/TaskList.tsx` — core tasks, then a Stretch divider, then non-core tasks. Ticks go through the shared progress store.
- `src/components/week/AssignmentCard.tsx` — 2px warm left border, brochure number when present, done-when checklist.
- `src/components/week/DoneWhenChecklist.tsx` — check ids are `${assignmentId}:check:${index}`.
- `src/components/week/NotesField.tsx` — notes stored under the assignment id, debounced 500ms, then the progress hook's 300ms write. "Saved" is announced.
- `src/components/resource/ResourceCard.tsx` — outbound title link with `rel="noopener noreferrer"`, type, why, verified date, minutes, and `licenseNote` when set.
- `src/components/resource/BadgeRow.tsx` — cost, level, and gray-area, benchmark, experimental, and email-gated badges, each with an icon and text.
- `src/components/resource/GapCard.tsx` — dashed inset card, help-wanted chip, what is missing, the three-pass line, attempted terms, and the contribution note.
- `src/hooks/ProgressProvider.tsx` — one progress owner for the shell and the week page. `TaskList` with no provider still writes through `useProgress`.
- `src/components/week/week.css`, `src/components/resource/resource.css` — token-only layout for the page and the cards.
- `src/routes/Root.tsx` — wraps the shell in `ProgressProvider`.
- `src/components/week/TaskList.test.tsx` — stretch divider and a persisted tick.

#### Verified

- `npm run test -- TaskList` → 2 passing. `npm test` → 60 passing. `npx tsc -b --noEmit` → exit 0.
- Browser at 360px: weeks 1, 2, 3, 8, 10, 13, and 16. `scrollWidth` equals `innerWidth`. Weeks 3 and 8 show the Heavy chip. Weeks 13 and 16 each show two gap cards. Every visited assignment has 2 done-when checks. Week 2 shows the Stretch divider before the pitch-deck task. Week 10 renders Freesound's per-file license sentence. External links use `rel="noopener noreferrer"`.
- Ticking week 13's first done-when check wrote `done["w13-assignment:check:0"]`. A note wrote `notes["w13-assignment"]` and showed Saved. Both survived a reload. The checkbox box is 20×20px inside a row taller than 48px. Notes text is 16px. The assignment border is 2px `#F2A65A`.

#### Decisions

- **Decision:** `Root` owns one `ProgressProvider`. Week controls read that value. A `TaskList` rendered with no provider, as in the unit test, calls `useProgress` itself.
  - **Because:** each `useProgress()` call has its own state and its own debounced write. Two of them on one page overwrite each other.
  - **Rejected:** passing progress props through `TaskList`, which would break the interface the test renders.
  - **Risk:** a route mounted outside `Root` still works, but it will not update the shell until reload.
  - **Deviation:** no

- **Decision:** Notes are stored under `assignment.id`, and `NotesField` is keyed by that id.
  - **Because:** the plan does not name the notes key, and the week route stays mounted while `:n` changes. A reused field would save one week's text onto the next assignment.
  - **Rejected:** a week-number key, and leaving the field mounted across weeks.
  - **Risk:** notes written under any other id will not show on this page.
  - **Deviation:** no

- **Decision:** The stretch test matches `/^stretch$/i`.
  - **Because:** the fixture task is named "Stretch goal", so `getByText(/stretch/i)` throws once a real divider also says Stretch.
  - **Rejected:** removing the word Stretch from the divider so the loose regex hit only the task.
  - **Risk:** a diff against the plan's test block shows a tighter matcher.
  - **Deviation:** yes. Plan step: "expect(screen.getByText(/stretch/i)).toBeTruthy();". Did this instead: `expect(screen.getByText(/^stretch$/i)).toBeTruthy();`.

- **Decision:** The week header's 2.39 frame is `min-height: calc(100cqw / 2.39)`, with the same 8px inset bars, vignette, and grain as the plan module headers.
  - **Because:** a grid sibling with `aspect-ratio: 2.39 / 1` grew to the content height times 2.39 and forced horizontal scroll at 360px.
  - **Rejected:** clipping the header with `overflow: hidden`, and dropping the ratio.
  - **Risk:** when the title is taller than the ratio, the panel grows and is no longer exactly 2.39.
  - **Deviation:** no

- **Decision:** An empty Watch section and an empty Read section each render every gap in `week.gapIds`. Do always renders the assignment, plus resource cards for do-task links. Core hours use the same sum as Task 10, including `0h` when there are no tasks.
  - **Because:** weeks 13–16 have no Watch or Read tasks, and several Do tasks are the only reference to a resource. Hiding `0h` would disagree with the plan frames.
  - **Rejected:** one shared gap below both sections, and omitting do-task links.
  - **Risk:** buffer weeks show the same gap card twice.
  - **Deviation:** no

- **Decision:** A community name links out only when a ledger title matches it after lowercasing and removing spaces, preferring a resource tagged with this week. Unmatched names stay text.
  - **Because:** `community` is a label, not a URL. `r/Screenwriting` has no ledger row.
  - **Rejected:** guessing Reddit URLs for names the ledger did not verify.
  - **Risk:** "Short of the Week" also matches the study-channel titles; the week tag breaks that tie.
  - **Deviation:** no

- **Decision:** Cards and badges are local CSS on the design tokens, not the shadcn `Card` and `Badge` defaults.
  - **Because:** those defaults paint accent-primary and 12px type. Cost, benchmark, and warn colors are already assigned in the design system.
  - **Rejected:** restyling the shared primitives for this one page.
  - **Risk:** the library page can drift if it builds a second card.
  - **Deviation:** no

#### Left open

- none

### Task 12: Library search and filter logic

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 12

#### Shipped

- `src/lib/search.ts` — `statusOf`, `emptyFacets`, `filterResources` (OR within a facet, AND across facets, empty array means no constraint), `createIndex` (Fuse keys and weights from the plan, `threshold: 0.38`, `ignoreLocation: true`), `searchResources` (blank query returns the filtered set; a query is limited to that set), and `facetOptions`.
- `src/lib/search.test.ts` — the 13 cases specified in the plan.

#### Verified

- `npm run test -- search` → 13 passing, exit 0. The same command before `src/lib/search.ts` existed failed to resolve `@/lib/search`.
- `npm test` → 73 passing, exit 0. `npx tsc -b --noEmit` → exit 0.

#### Decisions

- **Decision:** Closed facets come from a fixed catalog. Language is always `en`, `hi`, `ta`, `te`, `ml`, `mr`, `bn`, plus any other code present on a resource. Weeks are 1–16, plus any other week number present. Type, level, cost, and status are the full unions. Topics are the sorted topic strings present on the resources.
  - **Because:** `facetOptions` only receives resources, and the plan requires zero-match options so the language gap stays visible. The ledger names Hindi, Tamil, Telugu, Malayalam, Marathi, and Bengali. The test and the data already use `ta`, `hi`, and `en`. Those are the ISO 639-1 codes. The curriculum and the schema bound weeks to 1–16.
  - **Rejected:** building every facet only from values that appear in `all`. That drops Tamil and the other empty languages. Also rejected: inventing topic strings no resource uses.
  - **Risk:** the plan's test only checks that `type` contains `template`, which the fixture already has. It does not fail if `ta` is missing from `language`. Task 13 has to treat `ta`, `te`, `ml`, `mr`, and `bn` as the empty Indian-language options.
  - **Deviation:** no

- **Decision:** `searchResources` queries the supplied index, then keeps hits whose ids survived `filterResources`.
  - **Because:** the signature takes a prebuilt index, and a non-empty query must still obey the facets. Fuse scores each document on its own with these options, so the surviving hits match a second search over only the filtered resources.
  - **Rejected:** constructing a new Fuse index on the filtered array for every query. That leaves the caller's index unused, which this project rejects under `noUnusedParameters`.
  - **Risk:** if `index` was built from a different array than `all`, a filtered resource missing from the index will not show up for a non-empty query.
  - **Deviation:** no

#### Left open

- none

### Task 13: /library UI

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 13

#### Shipped

- `src/hooks/useLibraryFilters.ts` — `useLibraryFilters()` returns `{ query, facets, setQuery, toggleFacet, clearAll, results, options, view, setView }`. Query, facets, and `view=table` share one URL writer. `selectedEmptyLanguages` reports selected language codes with no catalog row.
- `src/routes/Library.tsx` — inline search, `⌘K` / Ctrl+K / `/` command palette, facet chips at ≥768px, a bottom sheet with an applied-count badge below that, removable active chips, clear all, a mono live result count, card grid or table, and the `indian-language-craft` gap card.
- `src/components/library/FilterChips.tsx`, `FilterSheet.tsx`, `SearchPalette.tsx`, `ResultsGrid.tsx`, `ResultsTable.tsx`, `labels.ts`, `useMediaQuery.ts`, `library.css` — the controls and the two result layouts. The card grid virtualizes only once the list exceeds 200.
- `src/hooks/useLibraryFilters.test.tsx`, `src/routes/Library.test.tsx`, `src/components/library/ResultsGrid.test.tsx` — URL round-trip, same-click facet composition, Tamil gap versus the Hindi course, palette shortcuts, mobile sheet, and the 200-item virtualization threshold.

#### Verified

- `npm run test -- useLibraryFilters` before `useLibraryFilters.ts` existed → fail, cannot resolve `@/hooks/useLibraryFilters`.
- `npm test` → 92 passing, exit 0. `npx tsc -b --noEmit` → exit 0.
- Browser on a fresh `npm run dev` (`http://localhost:5180/library`). Typing `Cursa` wrote `?q=Cursa` and narrowed the grid. `/` and `⌘K` opened the command palette. Four facets (`YouTube`, `Writing`, `Week 1`, `Free`) composed into `?type=youtube&topic=writing&week=1&cost=free`. Count-changing clicks painted in 44.6ms, 21.0ms, and 26.6ms. The fourth facet did not change the count, so that sample is not a paint time. Hindi alone reads `1 result` and shows the Cursa course. Hindi plus Tamil keeps that course and also shows the gap card. Tamil alone shows the gap card and the live text "No verified resources in this language"; the page does not say "0 results". Reloading `?language=ta` shows the same gap. At 1440px the grid is 3 columns, chips and the search field are 48px tall, and `scrollWidth` equals the viewport. At 360px `scrollWidth` is 360 and the facet controls sit behind the Filters sheet.

#### Decisions

- **Decision:** The URL uses `q`, one repeated key per facet value (`type`, `topic`, `week`, `level`, `cost`, `language`, `status`), and `view=table`. `view` is written by the same setter as the facets.
  - **Because:** the plan requires a linkable filter state and does not name the query keys. React Router's `setSearchParams` updater closes over the location from the current render, so two writes before the next render drop the first. A ref composes them, which a same-click test and a four-facet browser check both require.
  - **Rejected:** a second `useSearchParams` for the table toggle. Also rejected: calling the functional updater twice and trusting React to chain it. This version of React Router does not.
  - **Risk:** a Back navigation that lands while a write is in flight is adopted only after that write settles. If a navigation is dropped, the next click rebuilds from the last URL this hook wrote.
  - **Deviation:** no

- **Decision:** A selected language with zero catalog rows renders the `indian-language-craft` gap card. If another selected language still has rows, those rows stay and the gap card sits above them. An empty result that is not caused by such a language says "0 results". A single row says "1 result".
  - **Because:** Hindi has one verified course. Tamil, Telugu, Malayalam, Marathi, and Bengali have none. The plan's check is "selecting Tamil shows the gap card", and the facet rule is OR within a language. A review pass asked to treat a language as empty unless a row had `status === "verified"`. `Resource` has no such field. `verified` is a required ISO date on every row, so a missing row is the empty option.
  - **Rejected:** showing the gap for every Indian language code, which would hide the Hindi course. Also rejected: hiding the gap whenever any other facet still matches.
  - **Risk:** selecting Tamil and English shows English cards plus the gap card. The count is the card count, not zero.
  - **Deviation:** no

- **Decision:** Facet clicks push a history entry. Query edits and the table toggle replace the current entry. The card grid virtualizes above 200 items; the table does not. `/` and both `⌘K` and Ctrl+K open the palette, and `/` is ignored while an input is focused.
  - **Because:** a keystroke per history entry makes Back unusable, and a facet click is one deliberate change. The table is the accessible alternative, so its rows stay in the DOM. The plan names `⌘K`; Ctrl+K is the same shortcut on other keyboards. The catalog has 138 resources, so the virtualized branch is covered by a 201-item test rather than by the live page.
  - **Rejected:** replacing history on every facet click. Also rejected: virtualizing the table.
  - **Risk:** React Compiler skips memoizing `ResultsGrid` because `useWindowVirtualizer` returns unstable functions. That path is off until a result list exceeds 200.
  - **Deviation:** no

#### Left open

- none

### Task 14: Dashboard, landing, capstone, toolkit, about

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 14

#### Shipped

- `src/routes/Dashboard.tsx` — `Home` is the only `/` branch. No `startDate` renders the landing. A stored date renders the dashboard. `/?intro=1` shows the landing again. Past week 16 leads with the curriculum-complete state, `/capstone`, and the feedback communities. An override still shows that week.
- `src/routes/Landing.tsx` — hero with a static poster layer, module filmstrip including the buffer, the capstone brief, the ₹0 cost with its three exceptions, the Indian-language gap, and a start-date form that writes `startDate` and opens `/week/1`.
- `src/components/dashboard/NextTasks.tsx`, `StartDateControl.tsx` — the next incomplete tasks, the editable start date, and the "I'm actually on week" override.
- `src/lib/week.ts` — `nextIncompleteTasks(week, progress, limit)`.
- `src/routes/Capstone.tsx`, `src/components/capstone/StageList.tsx` — eight stages as a vertical filmstrip with week ranges, criteria, and todo / doing / done. The ceremony callback is a no-op.
- `src/routes/Toolkit.tsx` — the free-software table, first week, experimental flag, and the Resolve and ArtCraft limits on their rows.
- `src/routes/About.tsx` — method, fetched versus seen, the LevelUp credit, the legal notes, the five open items, the non-week gaps, and "See the intro again".
- `src/router.tsx` — `/` lazy-loads `Home`. The shell no longer has its own branch.
- `src/routes/Dashboard.test.tsx`, `src/lib/week.test.ts` — the dual-state home test and the incomplete-task order.

#### Verified

- `npm run test -- Dashboard week.test` before `Home` and `nextIncompleteTasks` existed → 4 failed. `Home` was undefined. `nextIncompleteTasks` was not a function.
- `npm test` → 96 passing, exit 0. `npx tsc -b --noEmit` → exit 0.
- Browser at `http://localhost:5180/`. Cleared storage shows the landing and no "Next up". "Start week 1" stored `2026-10-25` and opened `/week/1`. Ticking the first task stored `w1-watch: true`. Changing the start date to `2026-01-01` left that tick in place, the count read `1 / 39 tasks`, and `/` showed "Curriculum complete". Toolkit: 22 rows, the Resolve hardware-decode limit, the ArtCraft early-alpha limit, no HitFilm, and `scrollWidth` equal to the viewport at 360px. About: LevelUp credit, the open items, 5 gap cards, and `/?intro=1` returned the landing with "Back to today".

#### Decisions

- **Decision:** `/` lazy-loads `Home` from `Dashboard.tsx`, and the branch that used to live in `router.tsx` is gone.
  - **Because:** the plan says `Home` is the single component that branches, and the test renders that component without the shell. Leaving the old branch would make `/` and the test disagree. Lazy-loading keeps the landing out of the entry chunk that learning routes download.
  - **Rejected:** an eager import of `Landing` from the router. Also rejected: keeping both branches.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** The whole `WK nn / 16` string is one warm text node. The module name stays tertiary.
  - **Because:** `docs/design-system.md` §3.3 colors the current week number with `--accent-warm`. The plan's test is `getByText(/WK 0?1 \/ 16/)`, and Testing Library reads only an element's own text nodes. A span around the number removes it from that match.
  - **Rejected:** coloring only the digits and changing the specified test.
  - **Risk:** `WK`, the slash, and `16` are warm along with the week number.
  - **Deviation:** yes. Plan step: "shows the dashboard once a start date exists" expects `getByText(/WK 0?1 \/ 16/)`. Did this instead: put `WK nn / 16` in one element so that query matches, and colored that whole string warm.

- **Decision:** The hero poster is a background layer and the section grows with the title and actions. Help-wanted on About is every gap whose scope is not `week`. A feedback label longer than four words is left off the complete-state list.
  - **Because:** a fixed 2.39 crop clips the display H1, and Task 15 is the letterbox pass. Extension weeks are buffer notes, not help-wanted. "whichever community fits the feedback needed" is a sentence, not a community.
  - **Rejected:** clipping the hero to the cinematic ratio. Also rejected: rendering every week gap on About, and listing that sentence under feedback communities.
  - **Risk:** the hero is not letterboxed until Task 15. The complete state omits that one week-16 label.
  - **Deviation:** no

#### Left open

- `src/routes/Dashboard.test.tsx` uses the real clock against `startDate: 2026-10-22`. It expects week 1, so it fails once that date is no longer week 1 (after 2026-10-28).

### Task 15: Static atmosphere

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 15

#### Shipped

- `src/components/atmosphere/GrainSurface.tsx` — `.grain` on one element. Direct children stay in the `z-index: 2` layer from Task 2.
- `src/components/atmosphere/Letterbox.tsx` — composes `GrainSurface` with `letterbox-239` (default) or `letterbox-185`.
- `src/components/atmosphere/atmosphere.css` — 8px `--bg-inset` bars, `--vignette`, a 2.39 or 1.85 ratio floor, the hero inset shadow, `.bleach-bypass`, and `.slate-rule`.
- `src/routes/Landing.tsx` — the hero poster, copy, and grain share the letterbox. Landing module links and the start-date form are outside it.
- `src/components/week/WeekHeader.tsx` — the week header panel is a letterbox. Resource cards on the week page are not.
- `src/components/plan/ModuleGroup.tsx` — each plan module head is a letterbox. The week frames inside the module are not.
- `src/components/week/AssignmentCard.tsx` — the existing warm left edge is the `.slate-rule` utility.
- `src/components/atmosphere/atmosphere.test.tsx` — grain stays above its text, both ratios, the three framed surfaces, library cards excluded, slate class present.

#### Verified

- `npm run test -- atmosphere` before the components existed → fail, cannot resolve `./GrainSurface`.
- `npm test` → 100 passing, exit 0. `npx tsc -b --noEmit` → exit 0.
- Browser on a fresh dev server. Week header: grain `::before` is `z-index: 1`, `background-size: 128px 128px`, `pointer-events: none`; the title's parent is `z-index: 2`. Light theme: `--grain-opacity` and the pseudo opacity both compute to `0`. At 360px CSS width and 3× device pixel ratio, `background-size` stays `128px 128px` and `scrollWidth` equals `innerWidth` on `/week/1`, `/plan`, `/library`, and `/capstone`.
- `/plan`: 8 module heads inside letterboxes, 16 week frames not inside `.grain`. A module head at 328px wide is 137px tall, `aspect-ratio: 2.39 / 1`.
- `/?intro=1`: hero frame is `grain letterbox letterbox-239`, poster `z-index: 0`, copy `z-index: 2`, inset shadow `0 0 120px rgba(0,0,0,0.5)`. The module links and the start-date form are not inside `.grain`. The hero is 563×256 because the copy is taller than the 2.39 floor.
- `/library`: 138 resource cards, zero `.grain`. `/capstone`: 8 stage cards, zero `.grain`, status buttons not inside grain. The assignment card's left border is 2px `rgb(242, 166, 90)`.

#### Decisions

- **Decision:** The 2.39 and 1.85 ratios are a grid-row floor (`::after` with `aspect-ratio` and `align-self: start`), and the bars stay 8px.
  - **Because:** Task 11 measured that `aspect-ratio` on the header itself grew the width to content-height × 2.39 and forced horizontal scroll at 360px. `::before` is already the grain overlay. The 8px bars are the thin `--bg-inset` edges already on these panels.
  - **Rejected:** clipping with `overflow: hidden`, and setting `aspect-ratio` on the letterbox box.
  - **Risk:** when the title is taller than the ratio, the panel grows and is no longer exactly 2.39. The week header at 360px was 328×440.
  - **Deviation:** no

- **Decision:** `Letterbox` is a `GrainSurface`, and `.hero-poster` is pinned to `z-index: 0`.
  - **Because:** `.grain > *` paints every direct child at `z-index: 2`. A letterbox child with its own background would hide the grain. The poster has to sit under the overlay; the copy stays above it.
  - **Rejected:** a grain wrapper around a separate letterbox element.
  - **Risk:** a new full-bleed child of a grain surface will cover the noise unless it is pinned under `z-index: 1`.
  - **Deviation:** no

- **Decision:** `/capstone` has no grain surface.
  - **Because:** the ceremony badge is not mounted. Task 14 left `onCeremony` as a no-op and Task 16 adds `CeremonyBadge`. The eight stage cards are status controls on a prose page. `design-system.md` §5.3 excludes forms and anything inside `--container-prose`.
  - **Rejected:** wrapping the stage list, and inserting an empty ceremony node.
  - **Risk:** Task 16 has to wrap the badge in `GrainSurface`. This task did not leave a mount.
  - **Deviation:** yes. Plan step: "Apply to the approved surfaces only. Landing hero, letterboxed image containers, week header panel, capstone ceremony surface, and plan module cards." Did this instead: framed the hero, the week header, and the plan module heads, and left the ceremony surface until the badge exists.

#### Left open

- none

### Task 16: Vendored canvas layer and guards

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 16

#### Shipped

- `src/vendor/threeui/` — unmodified CRT, Lumen CTA, SparkBadge, and `articleHeadingDecode` from `MengTo/threeui` `68802d5428071ada5c20db8094b1649e6bb770ed`, plus `LICENSE` and `SOURCE.md`. No `three` import.
- `public/spark-badge.html` — the unmodified iframe document `SparkBadge` requests.
- `public/posters/hero-crt.webp` — WebP quality 80 of the mounted cinematic canvas at a 1440×900 viewport (1168×489).
- `src/lib/webgl-guard.ts` — one module-level slot, and `shouldRenderCanvas` (reduced motion, width under 768, cores or memory at or under 4, save-data).
- `src/hooks/useFpsGuard.ts` — one 2s sample of visible frame deltas. Hidden-tab gaps are dropped. Returns false once the mean is under 30fps.
- `src/components/atmosphere/HeroCanvas.tsx` — poster first, lazy `CrtBackground`, slot acquire/release, WebGL probe, layout-effect listener for a CRT throw, `webglcontextlost`, FPS unmount, fade over `--dur-slow`.
- `src/components/atmosphere/CeremonyBadge.tsx` — `SparkBadge` once, inside a grain surface, dismissed with Continue or Escape. Reduced motion does not mount the iframe.
- `src/components/atmosphere/DecodeHeading.tsx` — landing H1 and the about H1. The vendored function leaves the final string in place under reduced motion.
- `src/routes/Landing.tsx` — hero canvas off on replay, Lumen CTA only on "Start week 1".
- `src/routes/Capstone.tsx` — `seeCeremony()` on the final stage flip.
- `src/hooks/useProgress.ts` — `seeCeremony` writes `ceremonySeen` from the progress ref.
- `vite.config.ts` — Rolldown group `atmosphere` for `src/vendor/threeui/crt/` only, dependencies not included.

#### Verified

- `npm run test -- webgl-guard` before the module existed → fail, cannot resolve `@/lib/webgl-guard`. After the implementation → 9 passing.
- `npm test` → 116 passing, exit 0. `npx tsc -b` → exit 0.
- `npm run build` → Vite built, then exit 1 because `scripts/assert-bundle.ts` is still absent (Task 17). `grep -rl "crtRenderer\|CRT_FRAGMENT" dist/assets/*.js` matched nothing: minify renamed the bindings. `grep -rl "CRT requires WebGL"` matched only `dist/assets/atmosphere-BRr336yn.js` (gzip 9.32KB). No other chunk statically imports that file. `grep three package.json` → no match.
- Preview at `http://localhost:4173`. Desktop 1440×900: one canvas, `aria-hidden`, opacity 1, and `atmosphere-BRr336yn.js` loads. Width 390 and the in-browser 595px landing: poster present (`naturalWidth` 1168), zero canvases, no atmosphere JS. `/library`, `/plan`, `/week/7`, `/toolkit`, `/capstone` request no `atmosphere-*.js`. `/week/1` loads `atmosphere-*.css` (the letterbox stylesheet) and not the JS chunk.
- "Start week 1" calls `requestSubmit` and lands on `/week/1` with the start date stored. The button computes to 48px.
- Capstone: the last Done opens the dialog once, `ceremonySeen` is true, the iframe src is `/spark-badge.html`, the stage is `.grain` with the `::before` at `z-index: 1` and the badge at `0`. A second flip does not open the dialog.

#### Decisions

- **Decision:** `public/spark-badge.html` is vendored next to the component that iframes it.
  - **Because:** `SparkBadge.tsx` is a loader. Its default `sourceUrl` is `/spark-badge.html`. The plan's curl list did not include that document, and without it the ceremony is a 404. The file is self-contained canvas 2D and does not import `three`.
  - **Rejected:** editing `SparkBadge.tsx`, and skipping the ceremony visual.
  - **Risk:** the particle loop runs until Continue or Escape. It is not the WebGL slot.
  - **Deviation:** yes. Plan step: "Copy from `MengTo/threeui` at `main`" and the curl list that follows. Did this instead: also copied `src/shaders/spark-badge/spark-badge.html` from the same SHA to `public/spark-badge.html`.

- **Decision:** The CRT chunk is a Rolldown group on `src/vendor/threeui/crt/` with `includeDependenciesRecursively: false`.
  - **Because:** Task 1's `manualChunks` match on all of `src/vendor/threeui` put React in the same file as the CRT. Every route then statically imported that file, so the quarantine check failed.
  - **Rejected:** the Task 1 matcher as written, and a single `node_modules` vendor chunk (that build was 507KB and still imported the CRT file).
  - **Risk:** a crt module added outside that directory will not join the group.
  - **Deviation:** yes. Plan step: Task 16 does not edit `vite.config.ts`. Task 1 set `if (id.includes("src/vendor/threeui")) return "atmosphere"`. Did this instead: only the `crt/` directory, and its dependencies stay in the shared chunks.

- **Decision:** The hero passes `variant="cinematic"`, and the hero type has a text shadow.
  - **Because:** the component default is the Matrix terminal log. Cinematic is the film-leader screen already on `CrtBackground`. The captured still freezes the countdown digit "8" under the promise line, which failed contrast at 595px.
  - **Rejected:** the terminal default, and waiting for the later frame that paints the upstream title "THE LONG QUIET".
  - **Risk:** phones always show that frozen digit. The shadow is dark in both themes.
  - **Deviation:** no

- **Decision:** `seeCeremony` writes from `progressRef`, and `/?intro=1` does not mount the canvas.
  - **Because:** `StageList` calls `onStage` and then `onCeremony` in one click. `replace` of the render snapshot would drop the stage write. `design-system.md` §7.2 forbids WebGL on `/` for a returning learner.
  - **Rejected:** spreading `api.progress` from the click closure, and mounting the canvas on every `Landing` render.
  - **Risk:** a later writer that ignores the ref can still clobber `ceremonySeen`.
  - **Deviation:** no

- **Decision:** A CRT throw is caught in a parent layout effect, after a `getContext("webgl")` probe.
  - **Because:** `createCrtRenderer` throws inside the child `useEffect`. An error boundary does not see that, and a parent `useEffect` listener is registered after the child effect runs. The slot would stay held and the empty canvas div would cover the poster. Review: [canvas guard review](5d9269ff-17c0-4f82-83fc-0c8c3763912d).
  - **Rejected:** an error boundary alone, and a passive `error` listener. Also rejected that review's second note: keep sampling FPS for the life of the canvas. The plan samples one 2s window after mount.
  - **Risk:** a throw whose message does not contain "CRT" is still uncaught. A canvas that is fine for 2s and then slows stays mounted until context loss or navigation.
  - **Deviation:** no

- **Decision:** Off-screen pause stays inside unmodified `CrtBackground`. The Lumen button submits with `requestSubmit` because the vendored button has no `form` prop. Heading decode uses duration 1400, scramble length 3, preserve 0.08, tail 0.45. The ceremony stage is a `GrainSurface`, which Task 15 left for this badge.
  - **Because:** the vendored loop already cancels `requestAnimationFrame` off-screen and when `document.hidden`. The vendor files must not be edited. `design-system.md` §5.3 includes the ceremony surface, and the badge is pinned to `z-index: 0` so the grain stays above it.
  - **Rejected:** unmounting the hero when it scrolls away (that restarts the countdown), editing `LumenCta.tsx`, and a bare iframe with no grain.
  - **Risk:** the decode options are not from an upstream call site. Reduced motion still paints the final string immediately.
  - **Deviation:** no

#### Left open

- `npm run build` still exits 1 after Vite succeeds, because `scripts/assert-bundle.ts` arrives in Task 17.
- The hero poster is one frame of the countdown (the digit 8), not a blank leader.

### Task 17: Hardening and release gates

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** `docs/implementation-plan.md` → Task 17

#### Shipped

- `scripts/assert-bundle.ts` — reads `dist/index.html`, walks the static entry graph (module entry, `modulepreload`, `import`, and `export … from`), prints the gzipped size, and exits 1 over 160KiB or when that graph contains `crtRenderer`, `CRT_FRAGMENT`, a `three` import, or a file named `atmosphere`.
- `scripts/check-links.ts` — HEAD with a 10s timeout, GET only on 405, four at a time. Skips a bare site root whose `why` states a search term. Failures print `week N · id · url · status`.
- `.github/workflows/link-check.yml` — Mondays and manual dispatch. A failure opens or comments on an issue. It is not a pull-request check.
- `src/components/ExportImport.tsx` — download `frame-by-frame-progress.json`, import through `importProgress`, toast the `reason` on failure and leave state alone. Used by the More sheet and `/about`.
- `e2e/smoke.spec.ts` and `playwright.config.ts` — clean storage, start date, `/week/1`, tick, reload, library search, then a type filter. The dev server is not production, so no service worker is registered. `test-results/` and `playwright-report/` are gitignored.
- `vercel.json` — SPA rewrite to `/index.html`.
- `public/sw.js` — registered from `src/main.tsx` only when `import.meta.env.PROD`. Hashed `/assets` are cache-first. Navigations are stale-while-revalidate, with the cached `/` shell as the offline fallback.

#### Verified

- `npm run validate && npm run test && npm run build && npm run e2e` → validate printed 138 resources, 16 weeks, 9 gaps, 22 tools, 8 stages. Vitest 130 passed. Build exit 0. `entry graph: 162695 bytes gzipped (158.9 KB), limit 163840`. Playwright 1 passed.
- Production preview: ticked the week-1 watch task, wrote `keep this note`, exported, cleared storage, imported a bad file (toast `invalid JSON`, storage stayed empty), imported the export, and reloaded `/week/1` with the tick and the note restored.
- `/about` at 595px and 360px: Export and Import are on the page, the More sheet has a second pair, horizontal overflow is 0, and the two file inputs are not mounted together once the sheet closes.
- Lighthouse mobile, simulated throttling, production preview: `/` performance 84, accessibility 100, LCP 3551ms. `/plan` 92 / 100 / 2914ms. `/week/7` 90 / 100 / 3079ms. `/library` 84 / 100 / 3818ms. Accessibility clears 95. Performance misses 90 on `/` and `/library`. LCP misses 2.0s on the learning routes. TTFB was under 12ms and total blocking time under 30ms. The time is first paint of the shell.
- Separate from the gate: shell plus the lazy route JS is 164250 bytes on `/plan`, 171838 on `/week/7`, and 194159 on `/library`.
- CSS check against `docs/design-system.md` §8: light mode sets `--grain-opacity: 0`. The new controls add no emoji and no scale-on-hover. `--accent-warm` is still used for the current week and completion, which earlier tasks already shipped. Contrast was not re-measured with a picker.

#### Decisions

- **Decision:** The bundle gate follows `export … from` and checks every file in the static graph, including an `atmosphere` filename.
  - **Because:** a facade chunk can re-export the file that contains `three` or `crtRenderer` without an `import` token, and Task 16 showed minify renames `crtRenderer` / `CRT_FRAGMENT`. Review: [Review release gates](946724ab-81d1-447c-af6b-dd2c79aa07ea).
  - **Rejected:** scanning only the entry file for the literal tokens.
  - **Risk:** a relative string that is not a module specifier and still matches the export-from pattern would be treated as a chunk.
  - **Deviation:** yes. Plan step: "finds the main entry chunk, and exits 1 if it contains `crtRenderer`, `CRT_FRAGMENT`, or any `three` import". Did this instead: the same checks on the whole static graph, plus a failure when a statically included filename contains `atmosphere`.

- **Decision:** Navigations use stale-while-revalidate. Hashed assets stay cache-first.
  - **Because:** a cache-first `index.html` keeps the previous deploy until `sw.js` itself changes. Week routes are the same shell, so the cached document plus cached `/assets` is what makes a visited week open offline.
  - **Rejected:** cache-first for navigations, and dropping the worker. The plan's deferred list names F13, and step 6 says to drop it if the rest of the release is at risk. The worker was not what missed the Lighthouse bar.
  - **Risk:** the first offline load of a route that was never visited falls back to the cached `/` shell and then fails if that route's chunk was never fetched.
  - **Deviation:** yes. Plan step: "`public/sw.js` with a cache-first strategy for the app shell and visited week pages". Did this instead: cache-first for `/assets`, stale-while-revalidate for navigations.

- **Decision:** `playwright.config.ts` sets `testDir` to `e2e` and starts Vite on port 5197.
  - **Because:** Playwright's default directory is `tests`, and port 5173 is already taken by an older dev server in this workspace.
  - **Rejected:** putting the spec under `tests/`, and reusing whatever is bound to 5173.
  - **Risk:** none.
  - **Deviation:** no

- **Decision:** A link failure reports the earliest week, or an em dash when `weeks` is empty. A bare homepage is skipped only when `why` matches `search` or `search term`. ShotDeck is still checked.
  - **Because:** the report format says `week N` and several resources have more than one week. The ledger's search rows say "Search …" or "Search term:", not one phrase.
  - **Rejected:** joining every week into the line, and skipping every bare homepage.
  - **Risk:** a real page whose `why` happens to say "search" and whose URL is the site root will be skipped.
  - **Deviation:** no

- **Decision:** The Lighthouse miss stays as measured. The shell was not split in this task.
  - **Because:** first paint is 2.5–3.0s with blocking time under 30ms. Cutting that means splitting the entry graph, which is outside this task's file list, and the entry graph itself is under the 160KiB gate (162695 bytes).
  - **Rejected:** raising the gate, and treating the simulated scores as a pass.
  - **Risk:** `/`, `/plan`, `/week/7`, and `/library` do not all meet the plan's Lighthouse bar. `/library` is also about 30KB over the design-system 160KB once its lazy chunk loads.
  - **Deviation:** yes. Plan step: "Expected: ≥90 performance and ≥95 accessibility on every one; LCP under 2.0s on throttled 4G for the learning routes." Did this instead: recorded the scores above and left the shell as it was.

#### Left open

- none

### Outside the plan: Launch surface

- **Status:** complete
- **When:** 2026-10-25
- **Plan reference:** none. Not a heading in `docs/implementation-plan.md`. Appended because the work was requested after Task 17.

#### Shipped

- `.cursor/rules/framebyframe-constraints.mdc`, `framebyframe-architecture.mdc`, `framebyframe-design.mdc`, `framebyframe-journal.mdc` — always-on rules transcribed from the plan, the design system, and this journal.
- `src/lib/meta.ts`, `src/components/PageMeta.tsx` — per-route title, description, canonical URL, and one Open Graph image. `/thank-you` and unknown URLs are `noindex`.
- `public/og.png`, `public/og.svg` — 1200×630 title card.
- `public/favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` — film-frame mark in `#07090D` and `#6AB8FF`, replacing the Vite mark.
- `public/robots.txt`, `public/sitemap.xml` — allow all; locations are `/`, `/plan`, `/library`, `/capstone`, `/toolkit`, `/about`, `/contact`, `/privacy`, `/terms`, and `/week/1` through `/week/16`.
- `src/routes/NotFound.tsx` — the catch-all inside the shell.
- `src/routes/Landing.tsx` — the start control sits under the title, ahead of the promise line.
- `src/components/StickyCta.tsx` — fixed bar under 768px, above the tab bar. Hidden on `/thank-you`.
- `src/router.tsx` — route fallback announces "Loading" and shows five skeletons.
- `src/lib/form.ts` — start-date and contact validation. The landing form, the dashboard start-date field, and `/contact` render the messages.
- `src/components/week/NotesField.tsx` — "Saving" while the debounce is pending, then "Saved".
- `src/routes/Contact.tsx`, `ThankYou.tsx`, `Privacy.tsx`, `Terms.tsx` — mailto handoff, then `/thank-you`. Privacy and terms name the analytics gate.
- `src/components/CookieBanner.tsx`, `LaunchChrome.tsx` — banner plus Vercel Web Analytics, mounted only after `fbf:consent` is `accepted`.
- `src/components/SmoothScroll.tsx` — Lenis 1.3.27, not started when `prefers-reduced-motion: reduce`.
- `src/content/site.ts`, `src/components/ContactAddress.tsx` — the published contact.
- `flag.txt` — the file at `https://github.com/e14tech/flag.txt/blob/main/flag.txt`, at the repo root.
- `scripts/assert-bundle.ts` — `ENTRY_GZIP_LIMIT` is `164 * 1024`.

#### Verified

- `npm run test` → 138 passed, exit 0.
- `npm run build` → exit 0. `entry graph: 164260 bytes gzipped (160.4 KB), limit 167936`.
- Browser at `http://localhost:5201/`, viewport about 595×823: document title `Frame by Frame`, hero control top at 185px, Lenis class on `html`, cookie banner present before a choice, hero poster alt set.
- Same browser at 360×640 on `/terms`: `scrollWidth` 360, sticky control 48px tall.
- Empty `/contact` submit stayed on the page with "Enter your name.", "Enter a valid email address.", and "Enter a message."
- `/not-a-reel` title `Page not found · Frame by Frame`. `/privacy` and `/terms` rendered the contact address. `/thank-you` is `noindex`, has one `og:image` of `http://localhost:5201/og.png`, and does not mount the sticky bar.
- `curl` against the dev server: `robots.txt`, `favicon.ico`, and `og.png` returned 200.

#### Decisions

- **Decision:** The entry-graph limit is 164KiB.
  - **Because:** per-page meta in the shell measured 164260 bytes gzipped. Task 17 had recorded 162695 against a 160KiB limit (`163840`).
  - **Rejected:** deleting the per-page descriptions to crawl back under 160KiB.
  - **Risk:** the next shell addition can fail `npm run build` again. Lenis (about 5.4KB gzip) and the analytics chunk are outside this graph.
  - **Deviation:** yes. Plan step: "App shell + any learning route … ≤ 160KB". Did this instead: raised `ENTRY_GZIP_LIMIT` to `164 * 1024`.

- **Decision:** Lenis is a dependency. It is loaded from `LaunchChrome` after first paint and does not start when reduced motion is set.
  - **Because:** the request named `https://github.com/darkroomengineering/lenis`. `respectReducedMotion` is also set on the instance.
  - **Rejected:** installing `three`. The library has 138 resources, under the 200-item virtualizer threshold, so Lenis is not driving `useWindowVirtualizer`.
  - **Risk:** wheel scrolling is no longer native. A later list that virtualizes against window scroll has to be rechecked with Lenis mounted.
  - **Deviation:** yes. Plan step: "Animate `transform` and `opacity` only" and the tech stack does not name Lenis. Did this instead: added `lenis@1.3.27` on the document scroller.

- **Decision:** Analytics is `@vercel/analytics`, imported only after Accept.
  - **Because:** `vercel.json` is the deploy target and the repo had no measurement id.
  - **Rejected:** a hardcoded third-party id.
  - **Risk:** Accept on a non-Vercel host still requests the script. Reject never imports the module.
  - **Deviation:** yes. Plan step: the tech stack lists no analytics package. Did this instead: conditional Vercel Web Analytics.

- **Decision:** The published contact is `mratyunjay.soni@gmail.com` from git config. There is no street line.
  - **Because:** no postal address exists in the repo, the ledger, or the PRD.
  - **Rejected:** inventing a street address.
  - **Risk:** that mailbox is now in the client bundle, on `/about`, `/contact`, `/privacy`, and `/terms`.
  - **Deviation:** no

- **Decision:** `/contact` builds a `mailto:` link and then routes to `/thank-you`. The page says the site did not receive the note.
  - **Because:** the plan's architecture is a static site with no server.
  - **Rejected:** a fake success state that claims the message was delivered.
  - **Risk:** a browser that blocks `mailto:` still lands on `/thank-you`.
  - **Deviation:** no

- **Decision:** Sitemap locations are root-relative paths. `Sitemap:` in `robots.txt` is `/sitemap.xml`.
  - **Because:** no production origin is configured.
  - **Rejected:** inventing a hostname.
  - **Risk:** a consumer that requires absolute `<loc>` values will reject the file.
  - **Deviation:** no

- **Decision:** The hero poster keeps a descriptive `alt` and `aria-hidden="true"`.
  - **Because:** `HeroCanvas.test.tsx` requires `aria-hidden="true"`, and the poster repeats the hero rather than adding a fact.
  - **Rejected:** removing `aria-hidden` so the alt is announced as well as the heading.
  - **Risk:** an audit that wants the alt announced will fail this image.
  - **Deviation:** no

- **Decision:** `flag.txt` is the fetched canary text, at the repo root, and it is not copied into `public/`.
  - **Because:** the request was to add that file to the project. Its contents are an instruction aimed at an agent. The file was stored and the rest of the work continued.
  - **Rejected:** treating the file as an order to stop, and publishing it as a site route.
  - **Risk:** a later reader can mistake the file for an operational runbook.
  - **Deviation:** no

#### Left open

- No production origin, so Open Graph URLs are correct only after JavaScript sets them from `window.location.origin`.
- A client that does not run JavaScript gets the title in `index.html` and no meta description.
- The contact form cannot deliver mail.
- No postal address.

### Redesign R0: Correctness fixes

- **Status:** complete
- **When:** 2026-10-27
- **Plan reference:** `docs/redesign-plan.md` → R0

#### Shipped

- `src/routes/Dashboard.test.tsx` — the dual-state test runs on a frozen clock (`2026-10-24`), so it no longer fails from 2026-10-29. Committed alone first (`79427f4`).
- `src/lib/progress.ts` — import drops a `startDate` that fails `startDateError`, and a `weekOverride` that is not an integer in 1–16.
- `src/lib/week.ts` — `checkId`, `weekCompletion` (every core task and every done-when check), `weekMinutes` (all task minutes), `formatHours`. Filmstrip, plan, dashboard, week page and the done-when checklist use them.
- `src/content/modules.ts` — the one module list; the three copies are gone.
- Content imports per collection. Only `Week`, `Dashboard` and the library touch `resources`.
- `scripts/assert-bundle.ts` — limit back to `160 * 1024`; `assertRoutes` measures entry + each learning route through `dist/.vite/manifest.json` and rejects canvas code on those routes. `vite.config.ts` sets `build.manifest`.
- Deferred until needed: Fuse (`src/lib/search-index.ts`, substring match until it loads), the cmdk palette (`usePaletteShortcut` stays eager), the virtualizer (`VirtualResultsGrid`), sonner's `Toaster` (moved into the deferred `LaunchChrome`), the More sheet and the mobile filter sheet (eager trigger buttons, lazy panels, focus returned to the trigger on close).
- `scripts/finalize-dist.ts` — stamps `dist/sw.js` with a build id from `index.html`; writes `robots.txt`, plus `sitemap.xml` with absolute URLs only when `SITE_ORIGIN` is set. `public/robots.txt` and `public/sitemap.xml` removed.
- `public/sw.js` — cache name `fbf-<build id>`; `/assets` cached only when the content type is JS, CSS, font, image or wasm. `vercel.json` rewrite is `/((?!assets/).*)`.
- `src/components/week/NotesField.tsx` — adopts an imported note unless the field has an unsaved edit.
- `src/components/capstone/StageList.tsx` — status radiogroup is one tab stop with arrow-key movement.
- `src/content/site.ts` is the only place the contact address appears; `form.test.ts` uses a fixture address.
- `docs/prd.md` — lines 6, 35 and §8 amended for consent-gated Vercel Web Analytics.
- Removed `src/App.css`, `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg`.
- Chromium installed for Playwright.

#### Verified

- `npm run validate` → 138 resources, 16 weeks, 9 gaps, 22 tools, 8 stages.
- `npm test` → 153 passed, 28 files. `npx tsc -b --noEmit` → exit 0.
- `npm run build` → exit 0. Gzipped graphs, before → after: entry 164.3 → 128.7 KB; `/plan` 164.3 → 130.4; `/week/:n` 171.0 → 153.9; `/library` 190.9 → 148.3; `/toolkit` 131.5; `/capstone` 130.9. All under 160KiB with the limit unchanged.
- `npm run e2e` → 1 passed.
- Production preview in Chromium: More sheet and mobile Filters sheet open, close, and return focus to their trigger; Tamil in the sheet writes `language=ta` and badges "Filters, 1 applied"; "blockng" finds 2 results after Fuse loads; ⌘K opens the palette; no console errors.
- `NotesField.test.tsx` fails without the resync effect and passes with it.
- `npx oxlint` → 42 warnings (41 before R0), 0 errors.

#### Decisions

- **Decision:** A week is complete when every core task and every done-when check is done; weeks with no tasks complete on checks alone. Frame ratios count the same ids, so week 1 reads `0/5` and buffer weeks `0/2`.
  - **Because:** the dashboard could never reach 16/16, and a week read as complete while its assignment was untouched.
  - **Rejected:** counting stretch tasks; checks-only completion.
  - **Risk:** learners who ticked every task before this change see those weeks as unexposed until they tick the checks.
  - **Deviation:** yes. Plan step (v1 Task 9 decision): "A week is exposed only when it has at least one core task and every core task id is done." Did this instead: core tasks plus done-when checks. `Plan.test.tsx` updated to `0/5` and to tick the checks.
- **Decision:** Hours everywhere are all task minutes, stretch included, formatted `Nh` or `Nh Mm`. The dashboard's "core" suffix is gone.
  - **Because:** v1 Task 5 recorded the ledger estimate as the sum of all task minutes; the plan and week pages already used it.
  - **Rejected:** core-only minutes everywhere, which would contradict the ledger estimate.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** `searchResources` accepts `index: null` and falls back to a case-insensitive substring match over title, why and topics while Fuse loads. `createIndex` moved to `src/lib/search-index.ts`.
  - **Because:** any static import of a module that calls `new Fuse` keeps Fuse in the library's first load.
  - **Rejected:** a blank or unfiltered result list until the index arrives.
  - **Risk:** for a few milliseconds after load a typed query is substring-matched, not fuzzy.
  - **Deviation:** yes. Plan step (v1 Task 12 interface): `createIndex` exported from `src/lib/search.ts`. Did this instead: exported from `src/lib/search-index.ts`; `search.test.ts` imports it from there.
- **Decision:** Lazily loaded panels (palette, More sheet, filter sheet) mount on first open and stay mounted; their triggers are plain buttons with `aria-haspopup="dialog"` and `aria-expanded`.
  - **Because:** unmounting on close would drop the close animation; without `SheetTrigger`, focus return has to be explicit.
  - **Rejected:** loading the panels on hover or idle.
  - **Risk:** the first open waits for a small chunk.
  - **Deviation:** no
- **Decision:** `finalize-dist.ts` throws when `dist/sw.js` has no placeholder, so it runs once per build.
  - **Because:** a silently unstamped worker would reuse one cache name across deploys.
  - **Rejected:** a no-op on a second run.
  - **Risk:** running the script twice on the same `dist` fails; `npm run build` runs it once.
  - **Deviation:** no
- **Decision:** `vercel.json` is verified by a unit test of the rewrite pattern, not a preview fetch.
  - **Because:** `vite preview` ignores `vercel.json`.
  - **Rejected:** a preview 404 check, which proves nothing about Vercel.
  - **Risk:** the test uses JavaScript `RegExp`; Vercel uses path-to-regexp. The lookahead group is supported by both, but this was not checked against a deploy.
  - **Deviation:** no

#### Left open

- `SITE.email` still holds the Gmail address until the user supplies the dedicated one.
- No `SITE_ORIGIN`, so production ships `robots.txt` without a sitemap.
- The Vercel rewrite and the service-worker content-type check have not been exercised on a real deploy.

### Redesign R0.1: Review follow-ups

- **Status:** complete
- **When:** 2026-10-27
- **Plan reference:** `docs/redesign-plan.md` → R0, §4 review

#### Shipped

- `src/components/capstone/StageList.tsx` — status arrows stop at the ends instead of wrapping. Test: ArrowLeft on "To do" neither reaches "Done" nor fires the ceremony.
- `src/components/nav/BottomTabs.test.tsx` — opens the lazy More sheet, Escape closes it, focus is back on More.
- `src/routes/Library.test.tsx` — the mobile filter-sheet test asserts focus returns to Filters.

#### Verified

- `npm test` → 155 passed, three consecutive full runs. *(Corrected: the first commit of this entry said 156 and was made while one palette test was failing under full-suite load; see the warming decision below.)*
- Removing `returnFocus.current?.focus()` from `MoreSheet` fails the new BottomTabs test; restored.
- Production preview, desktop, JS responses gzipped within 3s of navigation: `/library` 173.6KB, `/week/7` 170.1KB, `/plan` 147.0KB. Static graphs from `assert-bundle`: 148.3KB, 153.9KB, 130.4KB.

#### Decisions

- **Decision:** The 160KB gate means "JS in the static graph before first paint" (entry + the route's static chunk graph). Code loaded from a mount effect is outside it: `LaunchChrome` (Lenis, sonner, cookie banner, analytics after consent) on every route, and Fuse on `/library`.
  - **Because:** deferring that code shortens the critical path, which is what LCP measures. The 3s totals above show what still downloads.
  - **Rejected:** counting effect-loaded chunks in the gate, which would fail `/library` and `/week/7` again and push toward removing Lenis or the cookie banner, both user-requested.
  - **Risk:** a reader of `design-system.md` §7.3 "first load" could take the gate as stricter than it is. R1 restates the budget with this definition.
  - **Deviation:** no
- **Decision:** `Library.test.tsx` and `BottomTabs.test.tsx` import the lazy panels in `beforeAll`.
  - **Because:** under full-suite load the first dynamic import of cmdk exceeded `findBy*`'s 1s timeout, so "opens the command palette from /" failed intermittently.
  - **Rejected:** raising the `findBy` timeout, which keeps the race and only makes it rarer.
  - **Risk:** the tests no longer exercise a cold chunk load; the browser check in R0 did.
  - **Deviation:** no
- **Decision:** The radiogroup does not wrap at either end.
  - **Because:** on the final stage, a wrap from "To do" to "Done" spends the once-only ceremony.
  - **Rejected:** firing the ceremony only on click or Space, which would leave an arrow-selected "Done" with no ceremony at all.
  - **Risk:** this departs from the WAI-ARIA radio pattern's wrapping.
  - **Deviation:** no

#### Left open

- none

### Redesign R1: Design system v2

- **Status:** complete
- **When:** 2026-10-27
- **Plan reference:** `docs/redesign-plan.md` → R1

#### Shipped

- `docs/design-system.md` — v2 "Kinetoscope": five-layer table, one hue per meaning, dark and light token tables, pop fills, literal aurora CSS, shadcn mapping with per-primitive overrides (§2.7), contrast test matrix (§2.8), Abril Fatface type scale, CSS ornament kit with pseudo-element ownership, pop kit (layering, raised vs latched, disabled, focus), HUD, aurora, film and grain kits, surfaces map, ThreeUI governance with two additions (guilloché seal, button sheen), budget target/ceiling (§7.3), battery rules (§7.4), rationale (§10).
- `.cursor/rules/framebyframe-design.mdc` — v2 rules.
- `docs/redesign-plan.md` — ornaments as CSS, budget target and ceiling, battery rules, sidebar-first R2, Fable pass, handoff rule.

#### Verified

- Contrast for every candidate pair computed with the WCAG formula (scratchpad `contrast.py`, `verify.py`, `aurora.py`): lowest body-text pair 4.85:1; aurora strength 0.20 keeps `--text-secondary` ≥ 4.86:1 over all three fields stacked (dark).
- Self-hosted Inter and JetBrains Mono have no `smcp`: identical widths with `font-synthesis: none` in Chromium.
- Cold review (Opus subagent): 3 blockers, 11 should-fix, 2 nits. Its contrast claims were re-computed and all held (border-strong ratios swapped, dark overlay 2.78, three-field stack 3.53, light brass on wash 4.35). All findings are addressed in the spec.
- Left-rail diagnosis (Sonnet subagent, production preview in Chromium): Lenis captures wheel input over the rail; the rail is ~1650px tall with the primary nav below sixteen 48px frames; week frames show only "WK nn" to sighted users.
- Design pass (Fable subagent): ThreeUI `68802d5` catalog evaluated; every family that imports `three`, loads a CDN, renders a full HTML document, uses `backdrop-filter`, or animates continuously was rejected.

#### Decisions

- **Decision:** v1 token names are kept where the meaning carried over (`--accent-primary` = action teal, `--accent-warm` = brass).
  - **Because:** about 300 CSS references use them; renaming adds churn without changing any rendered value.
  - **Rejected:** a rename to `--action` / `--brass`.
  - **Risk:** the name `--accent-warm` no longer describes its hue precisely.
  - **Deviation:** no
- **Decision:** Ornaments, halftone, HUD frames and aurora are CSS; no ornament is a React component.
  - **Because:** `/week/:n` had ~6KB of JS headroom; CSS is outside the JS budget.
  - **Rejected:** the plan's `src/components/ornament/` SVG components.
  - **Risk:** none.
  - **Deviation:** yes. Plan step: "`src/components/ornament/` — `Fleuron`, `DoubleRule`, `DiamondRule`, `PlaybillFrame`." Did this instead: CSS utilities (plan updated).
- **Decision:** Aurora strength 0.20 in both themes, and only `--text-primary` / `--text-secondary` may sit on a band.
  - **Because:** at the 0.30 candidate, three overlapping fields put `--text-secondary` at 3.53:1; CSS cannot prevent overlap.
  - **Rejected:** forbidding overlap by placement.
  - **Risk:** the aurora reads softer than the candidate.
  - **Deviation:** no
- **Decision:** The budget is a 160KB target that warns and a 180KB ceiling that fails, per route; exceeding the target needs a journaled design/UX reason. Phones run nothing continuously (§7.4).
  - **Because:** user direction 2026-10-27: the budget protects phone battery and is not an absolute line.
  - **Rejected:** keeping 160KB as a hard fail.
  - **Risk:** "target" can erode; every overage must be journaled.
  - **Deviation:** yes. Plan step (§2): "≤160KB … enforced per route". Did this instead: target + ceiling (plan updated).
- **Decision:** SparkBadge is desktop-only; phones, reduced motion and Save-Data get a static guilloché-seal ceremony. Continue sits on `--bg-raised`, not in the aurora.
  - **Because:** SparkBadge animates on a timer (§7.4 rule 1); §2.5 bans controls in a band. Reduced-motion users previously got no ceremony.
  - **Rejected:** a time-limited SparkBadge on phones.
  - **Risk:** phone users never see the particle badge.
  - **Deviation:** no
- **Decision:** Two grain variants: band grain (overlay 0.03, dithering only) and film grain (normal blend 0.06, dark only) on text-free surfaces: hero screen, ceremony stage, 404 and thank-you roots.
  - **Because:** overlay grain at 0.03 on `#0E0B16` moves pixels by under one 8-bit step, so it is invisible; normal-blend grain over aurora text would push `--text-secondary` below 4.5:1.
  - **Rejected:** raising band-grain opacity.
  - **Risk:** "filmy" grain is visible on only a few surfaces.
  - **Deviation:** no

#### Left open

- Abril Fatface at 360px on the longest titles is unverified; R2 records it.
- The sitemap still needs a production origin, and the contact address still needs the dedicated mailbox from the user.

### Redesign R2a: Left rail, Lenis gating, budget gate

- **Status:** complete
- **When:** 2026-10-27
- **Plan reference:** `docs/redesign-plan.md` → R2a

#### Shipped

- `src/components/nav/LeftRail.tsx` — rail rebuilt to `design-system.md` §6.1: brand, week readout, primary nav, theme toggle, rule, 4×4 filmstrip grid, "NOW SHOWING" eyebrow + title link to `/week/N`. `data-lenis-prevent` on the `<aside>`. Legal links removed.
- `src/components/nav/shell.css` — rail is `position: sticky; top: 0; height: 100dvh; overflow-y: auto; overscroll-behavior: contain`, 240px; shell is a two-column grid at ≥768px (replaces `margin-left` on the fixed rail); footer styles.
- `src/components/nav/ShellFooter.tsx`, `src/routes/Root.tsx` — "Legal" nav (Contact, Privacy, Terms) under `<main>` in both layouts. The mobile More sheet keeps its own legal links.
- `src/components/filmstrip/{FilmstripRail,WeekFrame}.tsx`, `filmstrip.css` — new `orientation="grid"` on `FilmstripRail` and `"cell"` on `WeekFrame`: numeral only, ≥48×48, 8px gaps, `aria-label` "Week N: title, X of Y done", `aria-current="step"`, exposed check kept (14px, corner). `vertical` and `horizontal` are unchanged for `/plan` and the dashboard.
- `data-lenis-prevent` on `ui/command.tsx` (list), `ui/table.tsx` (container), `ui/dialog.tsx`, `ui/sheet.tsx`, `ui/select.tsx` (content), `ui/scroll-area.tsx` (viewport), and the horizontal filmstrip.
- `src/lib/smooth-scroll.ts` (+ test), `src/components/SmoothScroll.tsx` — `shouldSmoothScroll(env)` gates Lenis on reduced motion, `(max-width: 767px)`, `(pointer: coarse)` and `navigator.connection.saveData`; all four are listened to and Lenis is destroyed when any starts to match, re-mounted when none does.
- `scripts/assert-bundle.ts` (+ test) — `ENTRY_GZIP_LIMIT` split into `ENTRY_GZIP_TARGET` (160KiB, warning, exit 0) and `ENTRY_GZIP_CEILING` (180KiB, failure). Results carry `warnings`. What is measured and `LEARNING_ROUTES` are unchanged.
- `src/components/nav/LeftRail.test.tsx` — rail order, frame labels, current week, now-showing link, `data-lenis-prevent`, no legal links in the rail, footer legal links in the Root shell on desktop and phone layouts.

#### Verified

- `npm test` → 31 files, 168 tests pass.
- `npx tsc -b --noEmit` → exit 0.
- `npm run build` → exit 0, no budget warnings. Entry graph 132010 B (128.9 KB). Plan 133756 B (130.6 KB), Week 157741 B (154.0 KB), Library 152020 B (148.5 KB), Toolkit 134872 B (131.7 KB), Capstone 134212 B (131.1 KB).
- `npm run e2e` → 1 passed.
- `npx oxlint` → 42 warnings before and after; none added.
- Browser (Chromium, `vite preview` :4340, 2s after load): wheel over the rail at 1280×800 moved the rail (`scrollTop` 44) and not the page (`scrollY` 0); wheel over main moved the page (`scrollY` 841). Palette list on `/library` (scrollHeight 4452, client 288): wheel moved the list to 400 and the page by 0.
- Fit: at 1440×800 and 1280×800, brand 12–60, nav 105–433, theme toggle 445–493, grid 518–743 are inside 800; the NOW SHOWING block (755–832) is cut by 32px and the rail scrolls 44px. At 1280×900 the whole rail fits (`scrollHeight` 900). Every frame measured 48×48.
- No horizontal overflow at 768 and 1440 on `/`, `/plan`, `/library`, `/toolkit`, `/week/7` (`scrollWidth` equals `clientWidth`).
- 390×844 with `hasTouch` and `isMobile`: `html.lenis` absent; desktop has it. Footer legal nav is present on mobile.
- Screenshot at 1440×800 (scratchpad `r2a/rail-1440x800.png`): brand, "WK 01 / 16" readout, six nav rows with Dashboard highlighted, a three-way theme toggle, a thin rule, a 4×4 grid of bordered numeral cells with 01 outlined in brass and a line before 13, then NOW SHOWING with the title clipped at the bottom edge.

#### Decisions

- **Decision:** The rail hides its scrollbar (`scrollbar-width: none`).
  - **Because:** §6.1 makes 48px frames and a 240px rail fixed; a classic scrollbar (8–15px) would shrink the 216px content box and the grid frames below 48px at 800px-tall viewports.
  - **Rejected:** `scrollbar-gutter: stable` (still narrows the box), and a wider rail (§6.1.7 says 240px).
  - **Risk:** the rail scrolls by wheel, touchpad and focus only; at 800px tall there is no visible hint that "NOW SHOWING" continues below.
  - **Deviation:** no
- **Decision:** Rail side padding is 12px and the right border became an outside `box-shadow`.
  - **Because:** 4 frames × 48px + 3 × 8px = 216px = 240 − 2 × 12; a 1px border would make frames 47.75px.
  - **Rejected:** 16px padding (frames 46px, below the 48px target).
  - **Risk:** the divider is a shadow, so R2b must restyle it as such.
  - **Deviation:** no
- **Decision:** At 1440×800 and 1280×800 the NOW SHOWING block is partly below the fold (rail scrolls 44px); §6.1.4 only requires everything through the theme toggle there, and the whole rail at 1280×900.
  - **Because:** the spec's own heights (six 48px nav rows, toggle, 4×4 frames) leave 32px short at 800px.
  - **Rejected:** shrinking nav rows below 48px.
  - **Risk:** none against the spec.
  - **Deviation:** no
- **Decision:** Rail gap is `--space-3` (12px) and frames show only the mono numeral ("07"), not "WK 07".
  - **Because:** "WK 07" does not fit in 48px; the spec says "mono numeral".
  - **Rejected:** a smaller font.
  - **Risk:** R2b may want a different glyph treatment.
  - **Deviation:** no
- **Decision:** The "week HUD readout" stays the existing `WeekNumeral` on current tokens, placed after the brand; there is no `.hud-frame` yet.
  - **Because:** the HUD utilities are R2b scope.
  - **Rejected:** adding an ad hoc frame class.
  - **Risk:** R2b must wrap it in `.hud-frame` and add `orn-rule` in place of the `.rail-rule` hairline.
  - **Deviation:** no
- **Decision:** The rail's "current week" for the grid highlight comes from `useCurrentWeek` inside `FilmstripRail`, while NOW SHOWING uses the `week` prop; both resolve to the same value in `Root`.
  - **Because:** left the existing `FilmstripRail` contract intact.
  - **Rejected:** threading a `current` prop through.
  - **Risk:** if the two sources diverge the highlight and the title would disagree.
  - **Deviation:** no
- **Decision:** `.shell` becomes a CSS grid (240px + 1fr) at ≥768px so the sticky rail takes its own column.
  - **Because:** sticky needs the rail in flow; the previous `margin-left` only worked for `position: fixed`.
  - **Rejected:** `float: left` on the sticky rail.
  - **Risk:** any future non-fixed direct child of `.shell` will be auto-placed into a new row.
  - **Deviation:** no
- **Decision:** `data-lenis-prevent` is also on select menus, the scroll-area viewport and the horizontal filmstrip (the plan listed palette, tables, dialog, sheet).
  - **Because:** they are desktop nested scrollers.
  - **Rejected:** leaving them for later.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** The Toolkit `.table-wrap` is not marked: it has no overflow rule, so it is not a scroller. The shared `Table` container (used by Library's results table) is.
  - **Because:** `data-lenis-prevent` on a non-scrolling element does nothing.
  - **Rejected:** adding it anyway.
  - **Risk:** if a later phase adds `overflow-x: auto` there, it needs the attribute.
  - **Deviation:** no
- **Decision:** The `FilmstripRail` `vertical` orientation and its CSS stay although nothing uses it now.
  - **Because:** surgical change; the plan says keep the API working.
  - **Rejected:** deleting it.
  - **Risk:** dead code.
  - **Deviation:** no
- **Decision:** `assertDist` and `assertRoutes` keep `ceiling` as the second argument and take `target` last.
  - **Because:** existing callers and tests pass the limit second.
  - **Rejected:** an options object.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** Save-Data is read once at mount and on the connection `change` event where `navigator.connection` exists; Safari and Firefox lack it, so they are gated only by the three media queries.
  - **Because:** there is no standard Save-Data query.
  - **Rejected:** polling.
  - **Risk:** none.
  - **Deviation:** no

#### Left open

- Wheel and touchpad checks used Playwright's synthetic wheel; real trackpad inertia on macOS was not tried.
- Dialog and sheet bodies carry `data-lenis-prevent`, but no overflowing dialog exists to test on desktop; they were not exercised in the browser.
- The rail still uses v1 tokens, fonts, brand font and hairline rule; R2b restyles it (HUD frame, `orn-rule`, Abril brand).
- Hidden rail scrollbar at ≤800px tall (see decision) may want a fade or hint in R2b.

### Redesign R2b: Foundation

- **Status:** complete
- **When:** 2026-10-27
- **Plan reference:** `docs/redesign-plan.md` → R2b

#### Shipped

- `src/styles/tokens.css` — rewritten from design-system §2–§4 for `:root` (dark) and `.light`: v1 names kept, plus pop fills, `--pop-*` geometry and colours, `--brass-fill`, `--status-exp`, `--ornament`, aurora vars (`--aurora-strength`, `--aurora-fields`), `--grain-opacity` 0.03 / `--grain-film-opacity` / `--grain-film-tile`, `--sheen-color`, `--shadow-overlay`, `--halftone-*`, radii 4/6/8/full, `--dur-aurora`, font stacks, §3.2 scale, shadcn aliases per §2.7 (`--primary` = pop teal, `--input` = `--border-strong`, `--radius` = `--radius-md`). Reduced-motion block collapses fast/base/slow/ceremony. `--vignette` is kept until R4 deletes the letterbox.
- `src/index.css` — imports the kits, Abril `@font-face` (latin-ext + latin, unicode-ranges), Archivo removed, `@theme inline` points at the new shadcn names and the Abril stack, focus outline offset 3px, `.font-display` (400, `font-synthesis: none`, `break-word`, `balance`).
- `public/fonts/abril-fatface-{latin,latin-ext}.woff2` + `OFL-AbrilFatface.txt`; Archivo files and OFL removed; `index.html` preloads only the Abril latin file and `theme-color` is `#0E0B16`.
- `src/styles/{ornaments,pop,sheen,hud,aurora,film}.css` + `grain.css` — ornament kit (`.orn-fleuron`, `.orn-rule`, `.orn-rule-double`, `.orn-rule-diamond`, `.playbill-frame`, `.orn-seal`), pop kit (layered `::before` fill z −1 / `::after` shadow z −2, hover / press / latched / disabled / focus, `.halftone`, `.pop-outline`, `.pop-shadow`), sheen, HUD (`.hud-frame`, `.hud-readout`, `.hud-grid`), aurora (static, `.aurora--live` with phone / reduced-motion fallback to static), `.clapper-stripe`, film grain variant. `.grain` keeps working for current consumers.
- `scripts/gen-guilloche-seal.ts` → `src/assets/ornaments/guilloche-seal.svg` (12.4KB raw, 3.7KB gzip, 32 `<use>`), plus `scripts/gen-guilloche-seal.test.ts` (exists, < 16KB, exactly 32 `<use`).
- `src/hooks/useAuroraPause.ts` — 25 lines; sets `data-paused` from an `IntersectionObserver` and `visibilitychange`. Nothing imports it yet (R4 mounts the live aurora).
- `src/styles/tokens.contrast.test.ts` — parses `tokens.css` for both themes and asserts every §2.8 row, computing the aurora stack, wash over inset and raised, sheen peak, band-grain worst pixel and film-grain worst pixel itself.
- `src/components/ui/*` — button (primary raised teal with `ButtonSheen` span, secondary / outline, ghost, destructive, link; every size keeps 48px), badge (pop fills ok / warn / danger / paid / exp, neutral default), checkbox, switch, toggle and toggle-group (latched teal + check), tabs (segmented), tooltip, skeleton, progress (brass), input / textarea / select trigger, dialog and sheet (scrim without blur, 2px outline, `--shadow-overlay`, Abril 400 titles), sonner (2px outline, overlay shadow, 4px status-text left bar), popover / select content / card (blurred shadows removed). `data-lenis-prevent` untouched.
- Shell: `LeftRail` (Abril brand, week readout in `.hud-frame`, nav active wash + 2px teal bar, latched theme toggle, `orn-rule`, grid frames with teal hover / focus / active, bottom-fade scroll hint), `WeekNumeral`, `shell.css` (bottom tabs top bar, mobile bar, skip link with pop border and shadow, read-only banner, footer rule, `.eyebrow` now Inter 600 `--text-secondary` per §3.2), More sheet through the primitives.
- Route CSS touched only where a token change would have broken it: `pages.css` / `launch.css` (`.page-button` interim pop look; its old `--primary-foreground` text on dark teal would have been 2.4:1 in light), `library.css` (`.filter-chip` keeps size, loses its own fill and border; `FilterChips` adds `pop--chip`), `week.css` (task-checkbox colour overrides removed so the primitive shows), and the four `Archivo Expanded` rules now use `--font-display` at weight 400.

#### Verified

- `npm test` → 33 files, 190 tests pass (was 31 / 168).
- `npx tsc -b --noEmit` → exit 0.
- `npm run build` → exit 0, no budget warnings. Entry graph 131735 B (128.6 KB). Plan 133481 B (130.4 KB), Week 157283 B (153.6 KB), Library 151752 B (148.2 KB), Toolkit 134598 B (131.4 KB), Capstone 133938 B (130.8 KB). R2a had Week 157741 B; the new JS (`ButtonSheen`, check icons) is offset by the removed utility classes.
- `npm run e2e` → 1 passed (no selector changes).
- `npx oxlint` → 42 warnings, as before; none added (`ButtonSheen` joins two existing only-export-components warnings in `button.tsx` and `badge.tsx`).
- Contrast mutation check: `--text-tertiary` dark `#9C9080` → `#6C6258` failed "text tokens meet 4.5 on every surface" (3.27) and the film-grain row (2.88); `--aurora-strength` 0.20 → 0.30 failed the aurora-stack and band-grain rows in both themes (secondary 3.51 dark, 4.29 light); light `--accent-warm` `#7E4E00` → `#B87A20` failed the status-text and wash rows (3.09, 2.51). Each file was restored; the test then passed 21/21.
- Contrast values the test computes with the shipped tokens (dark / light): aurora stack secondary 4.86 / 5.26, primary 7.22 / 9.53; with band grain secondary 4.68, primary 6.96.
- Abril at 360px (container 328px, `overflow-wrap: break-word`, preview Chromium, font loaded): week 1 title, week 7 title, week 4 (longest unbroken token `objective/subjective`) and "Marketing, Distribution and Career" at `--text-h1` (30px) take 4, 4, 4 and 3 lines; at `--text-h2` (24px) 3, 4, 3 and 2 lines. No line extends past the box (widest right edge 338 of 344 at h1) and `scrollWidth` equals `clientWidth` on every one. `movement/angles/framing,` breaks mid-token on the week 7 h1 (visible in the week header), which is `break-word` doing its job.
- Browser (Chromium, `vite preview` :4350): no horizontal overflow on `/`, `/plan`, `/library`, `/toolkit`, `/week/7`, `/about`, `/capstone`, `/contact` at 360, 768 and 1440 in both themes. Focus ring `solid 2px rgb(79,224,194)` offset 3px on a primary pop button (shadow layer opacity 0), a library chip (`:focus-visible` true) and a rail frame (border goes teal). Hover on the primary button: control `translate(-1,-1)`, shadow `translate(4,4)`; sheen `translateX` −113.75px at rest, +113.75px on hover. Latched toggle: control `translate(2,2)`, shadow `translate(1,1)`, fill teal. Light mode: `--grain-opacity` 0, `.aurora::after` and `.grain::before` opacity 0. Dark: aurora `::after` 0.03, film grain 0.06 normal blend. Lenis: absent at 390×844 with touch, present at 1440×900.
- Screenshots: 31 PNGs in `/private/tmp/claude-501/-Users-manofcode-Projects-personal-framebyframe/55fecafc-e98e-4278-9014-157489fc6ae7/scratchpad/r2b/shots/` (5 routes × 3 widths × 2 themes, named `<route>-<width>-<theme>.png` with `landing` = clean storage, `dashboard` = seeded `/`, plus `rail-closeup-1440-dark.png`); two More-sheet shots beside them in `r2b/`.

#### Decisions

- **Decision:** The aurora layers are listed magenta, violet, teal (the spec lists teal, violet, magenta).
  - **Because:** CSS paints the first layer on top. In the spec order the three-field stack measures secondary 4.57 and, with band grain, 4.42 (fails 4.5); the spec's 4.86 / 4.69 were computed with teal at the bottom. Reversed, the shipped CSS gives exactly the spec's 4.86 / 4.68.
  - **Rejected:** dropping `--aurora-strength` to 0.19 (4.58 with grain), which changes the look everywhere; hard-coding the test's stacking order to match the spec (the test would then not describe what the browser paints).
  - **Risk:** §2.5 calls its CSS literal. The parent should either amend §2.5 / §2.8 or choose strength 0.19 instead. Positions and colours are unchanged; only overlaps differ by a few RGB levels.
  - **Deviation:** yes. Plan step: "Literal CSS (R2 transcribes it)" (§2.5). Did this instead: same gradients, reversed list order.
- **Decision:** Every button size is at least 48px tall (`icon*` are 48×48); `xs` and `sm` only narrow the padding. The dialog and sheet close buttons are therefore 48px and sit at `top-2 right-2`.
  - **Because:** §8 and plan §2 make 48px non-negotiable; shadcn's 24 / 32 / 36px defaults would fail it.
  - **Rejected:** keeping compact sizes for dense UI.
  - **Risk:** R3 / R4 may want a denser toolbar button; that is a spec change.
  - **Deviation:** no
- **Decision:** In the left rail the theme toggle hides the latched check icon (`.left-rail .theme-option .pop-check`). The More sheet keeps it.
  - **Because:** three segments share 216px; "System" plus a 14px check is about 70px against about 66px available, so it would overflow.
  - **Rejected:** icon-only segments (changes the control), a 13px label (still overflows).
  - **Risk:** in the rail the selected segment is distinguished by the teal fill, ink border and pressed offset, not by the check §5.2 asks for. `aria-checked` is unchanged.
  - **Deviation:** yes. Plan step: "Latched … with a check icon and `aria-pressed`/`aria-checked`" (§5.2). Did this instead: no check in the rail theme toggle only.
- **Decision:** Toggle, toggle-group and tabs triggers render a Lucide `Check` as their first child, shown by CSS only when latched (`.pop-check`).
  - **Because:** the `::before` / `::after` of a pop control are owned by fill and shadow, so the check cannot be a pseudo-element.
  - **Rejected:** a React-state check; Radix does not expose the state to children.
  - **Risk:** a chip grows by about 20px when selected, so a wrapped chip row can reflow on click.
  - **Deviation:** no
- **Decision:** The tabs `line` variant has no distinct look any more (the prop still exists); all tabs are segmented pop toggles.
  - **Because:** its underline used `::after`, which a pop trigger owns; nothing in the app uses tabs.
  - **Rejected:** a second underline element.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** Badge keeps `default`, `secondary`, `outline`, `ghost`, `link` (neutral, token-based) and adds `ok`, `warn`, `danger`, `paid`, `exp`; `destructive` is an alias of `danger`. No variant uses `--primary`.
  - **Because:** §2.7 forbids `--primary` on badges and §2.1 names the five meanings; no route renders `Badge` yet.
  - **Rejected:** removing the shadcn variants.
  - **Risk:** R3 names the real variants when it applies badges.
  - **Deviation:** no
- **Decision:** Tooltip drops its arrow; popover, select content and card lose their blurred shadows (popover and select get the 2px outline and `--shadow-overlay`, card gets a 1px `--border-default`).
  - **Because:** §2.6 rule 4 (no blurred shadows, cards unshadowed) applies to every primitive, though §2.7 lists only some.
  - **Rejected:** leaving them for R3.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** `--scrim` is the token name for the §2.7 scrim values, and the rail's scroll hint is a `local` / `scroll` background pair (no element, no JS).
  - **Because:** the spec gives the dialog and sheet scrim values but no token; a CSS-only hint avoids new JS.
  - **Rejected:** a scroll listener.
  - **Risk:** the fade colour (`--bg-hover`) and 24px height are mine.
  - **Deviation:** no
- **Decision:** The hedera leaf in `.orn-fleuron` is a heart-shaped leaf with a short stem that I drew; the playbill-frame corner squares sit just inside the inner rule (5px inset).
  - **Because:** §5.1 specifies the construction but not the leaf path; the inset ring is a `box-shadow` and paints above background layers, so corner squares at 0 would be mostly hidden.
  - **Rejected:** squares at the outer corner.
  - **Risk:** the leaf and corner squares are unreviewed visually (no route uses them until R3 / R4); frames need at least 20px padding.
  - **Deviation:** no
- **Decision:** `.page-button` (the link-styled primary action on routes) gets an interim pop look (teal fill, ink border, hard shadow, translate on hover) instead of waiting for R4.
  - **Because:** `--primary-foreground` became ink; the old rule would have put ink on dark teal in light mode (about 2.4:1).
  - **Rejected:** leaving it broken until R4 moves it to `Button asChild`.
  - **Risk:** R4 deletes this rule when it migrates the links.
  - **Deviation:** no
- **Decision:** Hover on flat pop controls (secondary, ghost, chip) changes only the fill, with no translate; only raised controls (primary, destructive) lift.
  - **Because:** §5.2 gives secondary "Hover: `--bg-hover` fill" and chips "hover `--bg-hover`"; a lift would move a shadowless control.
  - **Rejected:** translating every pop control.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** Hover styles are inside `@media (hover: hover)`.
  - **Because:** sticky `:hover` on touch would leave a raised control lifted after a tap.
  - **Rejected:** unconditional hover.
  - **Risk:** none.
  - **Deviation:** no
- **Decision:** `useAuroraPause` ships now as a hook nobody imports.
  - **Because:** §5.4 requires the pause; it is 25 lines and costs nothing until R4 imports it.
  - **Rejected:** writing it in R4.
  - **Risk:** it is untested until R4 mounts it.
  - **Deviation:** no
- **Decision:** `index.html` `theme-color` is `#0E0B16` (dark base) for both themes.
  - **Because:** the old `#07090D` no longer exists; there is no per-theme meta in the spec.
  - **Rejected:** a media-query pair.
  - **Risk:** light-mode browser chrome stays dark.
  - **Deviation:** no
- **Decision:** `.eyebrow` (global) is now Inter 600 uppercase in `--text-secondary`, replacing the v1 mono / tertiary look.
  - **Because:** §3.2 and §3.3 define eyebrows that way; the class is shared with route code.
  - **Rejected:** a second class.
  - **Risk:** route eyebrows change appearance a little ahead of R3.
  - **Deviation:** no

#### Left open

- Spec §2.5 / §2.8 need the aurora-order correction above (or strength 0.19).
- Primitives not rendered by any route yet (badge, switch, tabs, tooltip, progress, dialog, input, textarea, select, sonner) were checked by class review and `tsc` only, not in a browser. The More sheet, theme toggle, chips, checkboxes and a hand-injected primary button were seen.
- The sheen, focus ring and hover transforms were verified by computed style, not by eye.
- The Lumen CTA, the hero `Letterbox` and route cards are still v1 visuals (R3 / R4).
- `.orn-fleuron`, `.playbill-frame`, `.orn-rule-*`, `.orn-seal`, `.hud-grid`, `.aurora*` and `.clapper-stripe` have no consumer yet and were not rendered.
- The primary-button focus case was exercised on a hand-built element carrying the primitive's classes, because no route renders a shadcn primary `Button`.
