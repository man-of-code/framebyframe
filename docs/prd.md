# Frame by Frame — Web App PRD

**Status:** Locked Oct 22, 2026. **Companion:** `docs/design-system.md` (all visual decisions — do not re-decide them here).
**Content source of truth:** `Frame by Frame Research Ledger, Curriculum and PRD.md` (Part 1 = resource ledger, Part 2 = 16-week curriculum, Part 3 = original PRD). This document supersedes Part 3 where they conflict.

A public, static, no-backend learning site that presents a 16-week self-taught filmmaking curriculum week by week, tracks progress in the browser, and exposes a filterable directory of ~160 verified free resources. One learner, no accounts, no analytics without consent, free hosting.

---

## 1. Decisions locked this session

| # | Decision | Consequence |
|---|---|---|
| D1 | **`/` is dual-state.** First-run visitors (no `startDate` in storage) get the cinematic landing with the WebGL hero. Returning learners get the work-mode dashboard with zero WebGL. | Resolves the conflict between F1 ("opens with no extra clicks to the current week") and wanting a hero. The ceremony happens once. |
| D2 | **Tailwind CSS + shadcn/ui** for the interface layer, replacing the original PRD's hand-rolled CSS variables. | Accessible primitives out of the box; our semantic tokens drive shadcn's variables (`design-system.md` §2.3). |
| D3 | **WebGL is quarantined to 3 moments** (landing hero, landing CTA, capstone-complete ceremony) plus `/about`'s heading. Every learning route is CSS-only. | Learning routes: 160KB gzipped **target**, 180KB ceiling, plus phone battery rules (*amended 2026-10-27*). See `design-system.md` §7.3–7.4. |
| D4 | **Cold base + one warm accent.** Warm is reserved exclusively for progress and completion. | A semantic color rule, enforced in review. |
| D5 | **Dark default, real light mode as P1.** | Light mode must not block launch. |
| D6 | **Grain: static, dark-mode surfaces only, never over text.** | Justified as gradient-banding mitigation, not just mood. `design-system.md` §5. |
| D7 | **Equal mobile/desktop weight.** Desktop gets a persistent left rail; mobile gets a bottom tab bar in the thumb zone. Phones get the hero as a static poster, not a render loop. | |

Carried forward unchanged from the ledger's Part 3: Android-first camera guidance, TypeScript throughout, public site with a LevelUp brochure credit, ArtCraft flagged experimental, no fixed start date, extension weeks 13–16 shown by default.

---

## 2. Users and goals

**The user:** one self-taught filmmaker, works full time, shoots on an Android phone, no budget, no mentors. Reads on a phone between shifts; works on a desktop next to DaVinci Resolve on editing days.

**Goals**
1. Open the site and know what to do today, with no navigation.
2. Every week exposes Watch / Read / Do with a link, a time estimate, and a done-when rubric of ≥2 checks.
3. Progress and notes survive a reload and can be exported as a file.
4. The resource directory is searchable and filterable, and shows verified gaps honestly rather than hiding them.
5. Zero running cost, zero accounts, zero tracking without consent. *(Amended 2026-10-27: consent-gated Vercel Web Analytics is allowed; see §8.)*

**Non-goals:** hosting video, mirroring scripts or courses, accounts, comments, payments, reproducing LevelUp's paid lesson content, replacing mentor feedback, any server-side anything.

---

## 3. Information architecture

| Route | State | WebGL | Purpose |
|---|---|---|---|
| `/` | **first-run** (no `startDate`) | Yes — hero + CTA | Landing: what this is, the 16-week shape, set your start date |
| `/` | **returning** (`startDate` set) | No | Dashboard: current week, progress, next 3 tasks, capstone stage |
| `/plan` | — | No | All 16 weeks as a filmstrip, grouped by the 7 modules |
| `/week/:n` | `n` = 1–16 | No | The week's Watch / Read / Do, assignment, done-when checks, community |
| `/library` | — | No | Filterable, fuzzy-searchable resource directory |
| `/capstone` | — | Ceremony only, one-shot | 8-stage capstone tracker |
| `/toolkit` | — | No | Free software, license, download, first week of use |
| `/about` | — | Heading effect only | Credits, method, licensing notes, the open gaps, help-wanted |

Vercel needs `rewrites: [{ source: "/(.*)", destination: "/index.html" }]` for deep links.

**Navigation model**

- **≥768px:** persistent left rail (240px) — brand mark, the filmstrip progress rail, then Dashboard · Plan · Library · Capstone · Toolkit · About. Current week badge in mono at the top.
- **<768px:** bottom tab bar, 5 items max, 56px tall + safe-area inset — **Today** (`/`) · **Plan** · **Library** · **Capstone** · **More** (sheet containing Toolkit, About, theme, export/import). Primary destinations sit in the thumb zone; destructive and settings actions live behind **More**.
- Sticky top bar on mobile carries only the page eyebrow + week numeral, 48px tall, so it costs almost no vertical space.

---

## 4. Screen specifications

### 4.1 `/` — first-run landing

Order: hero — the CRT screen beside a playbill-framed title block on a live aurora (*v2, 2026-10-27*; display H1, one-sentence promise, `lumen-cta` → "Start week 1", secondary text link → "Browse the plan first") → the 16-week shape as a horizontal filmstrip of module blocks → "What you'll make" (the capstone brief: 3–5 min thriller or sci-fi short, one location, ≤2 actors, Android phone, free Resolve) → "What this costs" (₹0, with the honest exceptions: script registration, festival fees, optional clip-on lens) → "What's missing" (the Indian-language gap, stated plainly, linking to `/about`) → start-date picker.

Setting a start date writes `startDate` and navigates to `/week/1`. Every subsequent visit to `/` renders the dashboard. A "see the intro again" link lives on `/about`.

### 4.2 `/` — returning dashboard

Zero-navigation design. Order:
1. **Current week card** — eyebrow `WK 07 / 16 · MODULE 4 · CINEMATOGRAPHY`, week title, core-hours estimate, a "heavy week" warning chip where the ledger marks one (weeks 3 and 8), and a primary button → `/week/7`.
2. **Next three incomplete tasks** across the current week, each a one-tap checkbox with its kind icon (watch/read/do) and minutes.
3. **Progress** — filmstrip rail showing exposed/current/unexposed weeks, plus `7 / 16 weeks · 41 / 96 tasks` in mono.
4. **Capstone stage** — current stage of 8, with a link to `/capstone`.
5. **Start-date control** — editable, plus a manual "I'm actually on week N" override for anyone ahead or behind. Changing the start date never clears completion state.

### 4.3 `/plan`

All 16 weeks as a vertical filmstrip on mobile, a 2-up grid on desktop, grouped under the 7 module headers. Extension weeks 13–16 appear under a visually spliced "Buffer" group with a one-line explanation of why they're shown by default (no mentors, no supplied footage, thin coverage in sound and VFX). Each week frame shows: numeral, module, title, hours, completion ratio, capstone stage. Current week outlined in warm. Clicking a frame goes to `/week/:n`.

### 4.4 `/week/:n`

1. **Header panel** (playbill frame on a static aurora band, *v2*) — eyebrow, title, core-hours in mono, capstone stage, prev/next week. (Topic chips dropped in v2: the title already lists the topics.)
2. **Watch** — resource cards (§4.5), each with minutes.
3. **Read** — same.
4. **Do** — the assignment card, headed "Assignment", with the clapper stripe (*v2*; replaced the v1 brass slate rule). Contains the assignment text, the brochure number where one exists, and the **done-when checklist** (≥2 checks, independently tickable).
5. **Notes** — a `textarea` per assignment, autosaved debounced 500ms, with a subtle "saved" state.
6. **Community** — the week's named subreddit or platform, with the ledger's caveat where one exists (e.g. "read the FAQ and Logline Monday rules first").
7. **Gap notice** — where the ledger has no verified resource for a section, render the gap card (§4.6) instead of an empty section. Never render an empty section.
8. **Self-review prompt** — the repeating weekly checklist from Part 2, collapsed by default.

Tasks marked `core: false` render under a "stretch" divider so a time-pressed week is obvious.

### 4.5 `/library`

- **Search:** Fuse.js over title, why, topics, type. `⌘K` / `/` opens the shadcn `command` palette; an inline input is also always visible.
- **Filters:** type · topic · week · level · cost · **language** · status, as `toggle-group` chips on desktop, inside a `sheet` on mobile with an applied-filter count badge. Multi-select within a facet (OR), intersect across facets (AND). Active filters render as removable chips above the results with a "clear all".
- **Results:** card grid (1 / 2 / 3 columns), count in mono, virtualized (TanStack Virtual) above 200 rendered items. A table view toggle provides the accessible alternative.
- **Resource card:** title (links out, `rel="noopener noreferrer"`, external-link icon) · type · cost badge · level · the one-line `why` · verified date · and any of the `grayArea` / `benchmarkOnly` / `experimental` / email-gated badges, each with icon + text. **No card ships without a cost and a verified date** — build validation enforces this.
- **Language facet never hides its empty options.** Selecting a language with no verified resources renders the gap card, not "0 results".

### 4.6 Gap card (a first-class component, not an empty state)

Dashed `--border-default`, `--bg-inset`, a "help wanted" chip in `--status-warn`. Contains: what's missing, that it was searched for across three research passes, the attempted search terms from the ledger, and how to contribute. Used for the Indian-language gap, the missing raw-footage practice source, and any week section with no verified resource.

This is a product requirement, not a nicety: the ledger's central finding is that zero Hindi/Tamil/Telugu/Malayalam/Marathi/Bengali filmmaking-craft channels were verified, and the site promises "English + Indian languages." Showing the gap keeps the promise honest.

### 4.7 `/capstone`

Eight stages: premise → script → shot list → shoot → rough cut → sound → final cut → submissions. Each is `todo | doing | done` with the week range it maps to and its done-when criteria pulled from the matching week. Rendered as a vertical filmstrip. Flipping the final stage to `done` fires the one-shot `spark-badge` ceremony (`design-system.md` §7.1) — once, recorded in storage so it never repeats.

### 4.8 `/toolkit`

Free software table: tool · purpose · license · official download · **first week of use** · experimental flag. Must carry the ledger's hard caveats inline: DaVinci Resolve free edition lacks hardware-accelerated H.264/H.265 decode (relevant to Android HEVC footage), noise reduction, and several ResolveFX; ArtCraft is early-alpha and optional, with GIMP/Krita/Inkscape as the reliable default; HitFilm is discontinued and must not appear at all.

### 4.9 `/about`

Method, trust levels (fetched vs seen), the LevelUp brochure credit line, every legal and licensing note from the ledger, the consolidated open-items list, the help-wanted gaps, and a "see the intro again" link that re-renders the first-run landing.

---

## 5. Data model

TypeScript throughout. `Resource`, `Task`, `Week` and `Progress` are carried forward from the ledger's Part 3 unchanged in structure. Additions this session:

```ts
type Resource = {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'repo' | 'subreddit' | 'article' | 'course' | 'book' | 'tool'
      | 'short-film' | 'podcast' | 'forum' | 'template' | 'festival' | 'community'
      | 'service' | 'platform' | 'grant' | 'docs' | 'spec' | 'aggregator' | 'reading';
  topics: string[];
  weeks: number[];
  level: 'beginner' | 'intermediate' | 'advanced';
  cost: 'free' | 'freemium' | 'paid';
  language: string;              // 'en' | 'hi' | ... — gaps stay visible, never backfilled with guesses
  why: string;                   // carries the license caveat inline, per the ledger's legal notes
  verified: string;              // ISO date
  grayArea?: boolean;
  benchmarkOnly?: boolean;
  experimental?: boolean;
  emailGated?: boolean;          // NEW — several StudioBinder templates require an email
  licenseNote?: string;          // NEW — e.g. BBC archive is non-commercial only
};

type Task = { id: string; kind: 'watch' | 'read' | 'do'; text: string; resourceIds: string[]; minutes: number; core: boolean };

type Gap = {                     // NEW — gap cards are content, not an absent state
  id: string; scope: 'week' | 'module' | 'global'; ref: string;
  missing: string; attempted: string[]; note: string;
};

type Week = {
  n: number; module: number; title: string; topics: string[];
  tasks: Task[];
  assignment: { id: string; brochureNo?: number; text: string; checks: string[] };
  capstoneStage?: string; extension?: boolean; community: string;
  communityCaveat?: string;      // NEW — e.g. r/Screenwriting's Logline Monday rule
  heavy?: boolean;               // NEW — weeks 3 and 8
  gapIds?: string[];             // NEW
};

type Progress = {
  version: 1;
  done: Record<string, boolean>;
  notes: Record<string, string>;
  capstone: Record<string, 'todo' | 'doing' | 'done'>;
  startDate?: string;
  weekOverride?: number;         // NEW — manual "I'm on week N"
  theme?: 'dark' | 'light' | 'system';   // NEW
  ceremonySeen?: boolean;        // NEW
};
```

Content lives as typed TS modules in `src/content/` (`resources.ts`, `weeks.ts`, `gaps.ts`, `tools.ts`, `capstone.ts`) — not JSON, so the compiler catches bad references.

**Storage:** one versioned localStorage key, `fbf:progress:v1`. Every read and write wrapped in `try/catch`; a parse failure falls back to empty progress and raises a non-blocking toast rather than throwing. Writes debounced 300ms.

---

## 6. Functional requirements

| ID | Requirement | Pri | Acceptance check |
|---|---|---|---|
| F1 | Dual-state `/`: first-run landing vs returning dashboard, with editable start date and manual week override | P0 | Returning visit reaches the current week in zero clicks; changing start date preserves completion state |
| F2 | `/plan` shows 12 core + 4 extension weeks, grouped by the 7 modules | P0 | Every week links to its page; extension group is visually distinct and explained |
| F3 | Week page renders Watch / Read / Do, assignment, hours, capstone step; a gap card replaces any section the ledger has no resource for | P0 | No week renders an empty section |
| F4 | Checkboxes on every task and every done-when check, persisted | P0 | State survives reload and a hard refresh |
| F5 | Export / import progress + notes as JSON | P1 | Round trip restores identical state; version mismatch is rejected with a named reason |
| F6 | Library fuzzy search + filters: type, topic, week, level, cost, language, status | P0 | Any filter combination returns in <100ms on a mid-range Android |
| F7 | Resource card shows title, type, cost, level, one-line why, verified date, and all applicable badges | P0 | Build fails if any resource lacks cost or verified date |
| F8 | 8-stage capstone tracker, persisted, surfaced on the dashboard | P0 | Status persists; completion ceremony fires exactly once |
| F9 | Toolkit page with purpose, license, download, first week of use, experimental flag | P1 | Every tool names its first week; HitFilm absent; Resolve free-edition limits stated |
| F10 | Per-assignment notes, autosaved locally, included in export | P1 | Notes persist and round-trip |
| F11 | Build-time content validation + scheduled link check | P1 | Schema error or dead link fails the check, naming the week and resource |
| F12 | Full design system per `docs/design-system.md`, dark default + light mode, keyboard navigable | P1 | Automated a11y scan passes; contrast verified in both modes |
| F13 | Offline reading via service worker | P2 | `/plan` and visited week pages load offline after one visit |
| F14 | Every assignment has a done-when rubric of ≥2 checks | P1 | Validation fails on fewer than 2 |
| **F15** | **WebGL governance:** one surface app-wide, forbidden on learning routes, lazy chunk, poster fallback, pause off-screen, FPS guard, context-loss recovery | **P0** | Build assertion fails if a vendored canvas module lands in the main chunk or if `three` appears in the bundle; no learning route loads either |
| **F16** | **Gap cards** render as content with attempted search terms and a help-wanted chip | **P0** | The Indian-language gap is visible from `/library`, `/about`, and any affected week |
| **F17** | **Thumb-zone mobile navigation** — bottom tabs, 48px targets, 8px separation | **P0** | Audit confirms no primary action above 60% viewport height on mobile |
| **F18** | **Heavy-week warning** on weeks 3 and 8, with core vs stretch tasks visually separated | **P1** | Both weeks show the chip; stretch tasks sit under a divider |
| **F19** | **License caveats surface on the card**, not only in the About page | **P1** | BBC archive's non-commercial restriction and Freesound's per-file licensing appear on their cards |
| **F20** | **Theme toggle** (dark / light / system), persisted | **P1** | No flash of wrong theme on load (inline pre-paint script) |

---

## 7. Tech stack

| Area | Choice | Note |
|---|---|---|
| Build | Vite + React 18 + **TypeScript strict** | Locked |
| Routing | React Router (data router) | 7 routes, route-level code splitting |
| Styling | **Tailwind CSS + shadcn/ui**, driven by our semantic CSS variables | Supersedes the original hand-rolled plan (D2) |
| Icons | **Lucide** only | No emoji, ever |
| Search | Fuse.js, index built at module load from typed content | A few hundred items |
| Virtualization | TanStack Virtual | Only if rendered items exceed 200 |
| State | React state + one versioned localStorage key, all access via a single `useProgress` hook | No global state library |
| Atmosphere | **Vendored** ThreeUI source in `src/vendor/threeui/` (MIT), lazy-imported | **Not** the npm package — it pulls 3 copies of Three.js. `design-system.md` §7.0 |
| Validation | Zod schemas run in a `prebuild` script over `src/content/` | Fails fast |
| Link check | Scheduled GitHub Action, weekly | Critical given how many ledger pages were only partially fetchable |
| Tests | Vitest for schema, progress logic, week derivation, filter logic; one Playwright smoke test | Covers what breaks quietly |
| Hosting | GitHub → Vercel, preview per branch, prod on main, SPA rewrite | Free tier |

**Suggested structure**

```
src/
  content/        resources.ts weeks.ts gaps.ts tools.ts capstone.ts
  lib/            progress.ts  week.ts  search.ts  schema.ts  webgl-guard.ts
  hooks/          useProgress.ts  useCurrentWeek.ts  useLibraryFilters.ts  useTheme.ts
  components/
    ui/           shadcn primitives
    filmstrip/    FilmstripRail  WeekFrame
    resource/     ResourceCard  GapCard  BadgeRow
    week/         WeekHeader  TaskList  AssignmentCard  DoneWhenChecklist  NotesField
    atmosphere/   (lazy) HeroCanvas  CeremonyBadge  DecodeHeading   (v2: Letterbox and GrainSurface retired; kits are CSS in src/styles/)
  routes/         Root Dashboard Landing Plan Week Library Capstone Toolkit About
scripts/          validate-content.ts  check-links.ts  assert-bundle.ts
```

---

## 8. Quality bars

- Learning routes: **160KB JS gzipped target / 180KB ceiling** before first paint, per route (*amended 2026-10-27*: the budget protects phone battery and is weighed against design and UX). Lighthouse mobile ≥90 and LCP <2.0s on throttled 4G are **targets**; measured results are recorded in the implementation journal (R5/R5.1).
- Phone battery: nothing runs continuously while reading (no canvas, live aurora, infinite animation, or smooth-scroll loop); see `design-system.md` §7.4.
- Landing/About: **+≤25KB** lazy canvas chunk loaded after LCP; Lighthouse mobile ≥90 here too. Three.js is never installed.
- No horizontal scroll at **360px**. Last two versions of evergreen browsers.
- Analytics only after explicit consent: Vercel Web Analytics loads after the visitor accepts the cookie banner, and never on Reject. Otherwise zero third-party network requests at runtime except outbound resource links the user clicks. *(Amended 2026-10-27, user decision.)*
- A broken link fails the build unless explicitly marked known-broken with a reason.
- Every resource card shows a verified date.
- Accessibility per `design-system.md` §8, verified in both themes.

---

## 9. Edge cases

| Case | Handling |
|---|---|
| localStorage unavailable (private mode, quota) | App runs read-only; a persistent banner explains progress won't save; export is disabled |
| Progress version mismatch on import | Rejected with the specific reason and the found/expected versions; existing state untouched |
| A resource is removed from content after being ticked | Orphan keys are retained in storage but ignored on render; never throw |
| Late start / fallen behind / jumped ahead | `weekOverride` wins over the derived week; the dashboard says which is in effect |
| Start date in the future | Clamped to week 1 with a note |
| Past week 16 | Dashboard switches to a "curriculum complete" state pointing at `/capstone` and the feedback communities |
| A week or language facet has zero resources | Gap card, never a blank section or "0 results" |
| WebGL unsupported or context lost | Poster image, silently; no error surfaced to the learner |
| Reduced motion, save-data, or low-end device | Poster image; no render loop ever starts |

---

## 10. Build order

1. **Content + schema** — port Part 1 and Part 2 into `src/content/`, write Zod schemas, make `validate-content` pass. *Verify: every week has Watch/Read/Do or an explicit gap; every assignment has ≥2 checks; every resource has cost + verified date.*
2. **Shell + tokens** — Tailwind, shadcn, both token sets, theme toggle with no flash, left rail / bottom tabs, routes. *Verify: contrast audit passes in both modes; no horizontal scroll at 360px.*
3. **Progress engine** — `useProgress`, week derivation, override, export/import. *Verify: Vitest covers reload, override, version mismatch, orphan keys.*
4. **Week + plan pages** — filmstrip, task lists, assignment card, done-when checklist, notes, gap cards. *Verify: all 16 weeks render; F3, F14, F16, F18 hold.*
5. **Library** — Fuse index, filters, cards, badges, table alternative. *Verify: filter combinations return <100ms; F7 and F19 hold.*
6. **Capstone + toolkit + about.** *Verify: F8, F9; HitFilm absent; Resolve limits stated.*
7. **Atmosphere** — grain, letterbox, vignette, bleach-bypass (*v1 build order; v2 replaced letterbox/vignette/bleach-bypass with the Kinetoscope kits*). *Verify: grain never shares a layer with text; light mode grain off.*
8. **WebGL, last** — hero, CTA, ceremony, poster fallbacks, guards. *Verify: `assert-bundle` confirms `three` is absent from the main chunk; learning routes don't load it; FPS guard and poster paths both exercised.*
9. **Hardening** — link-check action, Playwright smoke test, service worker, Lighthouse. *Verify: all §8 bars.*

---

## 11. Open items requiring a human check before public launch

Carried forward from the ledger, unchanged and still open: LevelUp's own terms of use for the brochure credit · current India copyright and SWA registration fees · Mixkit and YouTube Audio Library license text · getartcraft.com's actual license · whether TakeTen has an open 2026 cycle.

**Closed Oct 22, 2026** (both ThreeUI items from the first draft): `article-headings` imports nothing at all and is usable on any route; none of the four approved components render full HTML documents or need runtime assets copied into `public/`. See `design-system.md` §7.0 for the verification and the resulting decision to vendor rather than install.
