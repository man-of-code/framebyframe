# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frame by Frame is a static, no-backend Vite + React 19 site presenting a 16-week filmmaking curriculum. It tracks learner progress in the browser (single versioned localStorage key) and exposes a filterable directory of ~160 verified free resources. One learner, no accounts, no server.

The authoritative specs live in `docs/`:
- `docs/prd.md` — product, IA, screen specs, data model, features F1–F20 (locked).
- `docs/design-system.md` — every visual value; **never invent a color, size, duration, or font** (locked).
- `docs/implementation-plan.md` — the v1 task list and source of truth for scope.
- `docs/implementation-journal.md` — append-only record; see journal rules below.

Read the relevant doc before changing behavior or UI. When a change departs from a locked doc, say so in the reply and the journal.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc -b` + `vite build` + `assert-bundle.ts` (bundle gate; fails the build on violation). `prebuild` runs content validation first.
- `npm test` / `npm run test:watch` — Vitest (jsdom). Single file: `npx vitest run src/lib/week.test.ts`. By name: `npx vitest run -t "clamps"`.
- `npm run e2e` — Playwright smoke tests; auto-starts dev server on `127.0.0.1:5197`.
- `npm run validate` — Zod content validation (`scripts/validate-content.ts`).
- `npm run check-links` — probes every resource URL in the ledger.
- `npm run lint` — oxlint.

Tests live next to code as `*.test.ts` / `*.test.tsx` (also `scripts/**/*.test.ts`). Path alias `@/*` → `src/*`.

## Architecture

The layering is strict and enforced by the cursor rules and the bundle gate — respect it:

- **`src/lib/`** — pure business logic, no React, no DOM. Storage is injected, not reached for. `types.ts` is types only; `schema.ts` is Zod only; `progress.ts`, `week.ts`, `search.ts`, `route-week.ts`, `webgl-guard.ts`, `theme.ts` stay pure and unit-tested. A route must call a helper here rather than compute rules inline (e.g. `parseWeekParam(n)`, not inline clamping).
- **`src/content/`** — typed curriculum/resource data, no logic. Every resource needs `cost` and `verified`; every assignment needs ≥2 done-when checks. `npm run validate` must pass after any content edit.
- **`src/hooks/`** — binds React to `src/lib/`. No business rules here. Learner progress flows through `useProgress` (over `ProgressProvider`) and the one versioned localStorage key — do not add a server or a second storage key for it.
- **`src/routes/`** — one file per route, composition only. Routes are lazy-loaded in `src/router.tsx`.
- **`src/components/ui/`** — shadcn primitives. Wire design tokens; do not restyle primitives with new colors.
- **`src/styles/tokens.css`** — all design tokens. Components reference tokens, never raw hex.

## Hard constraints (enforced)

- **TypeScript strict. No `any`, no non-null assertions on parsed data.**
- **Do not install `three` or `@designcodeio/threeui`.** The decorative WebGL "atmosphere" is vendored under `src/vendor/threeui/` and lazy-loaded. It is quarantined to 3 moments (landing hero, landing CTA, capstone-complete ceremony) plus `/about`'s heading.
- **Learning routes (`/`, `/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`) load zero canvas code.** Only one WebGL surface exists at a time. `scripts/assert-bundle.ts` fails the build if the entry graph exceeds ~160KB gzip, or if `crtRenderer`, `CRT_FRAGMENT`, or an import of `three` appears in that graph. The CRT atmosphere is split into its own chunk via `vite.config.ts`.
- **`--accent-warm` is for progress and completion only** — never on a link, button, filter, or nav item.
- **Icons are Lucide only. No emoji.**
- **Animate `transform` and `opacity` only; hover never uses `scale`.** `prefers-reduced-motion: reduce` collapses durations.
- **Accessibility:** touch targets ≥48×48px with ≥8px gaps; body text ≥16px on mobile; no horizontal scroll at 360px; decorative canvases/grain are `aria-hidden`; focus is `outline: 2px solid var(--accent-primary)` and is never removed without a replacement. Breakpoints: 360 (floor), 640, 768 (bottom tabs → left rail), 1024, 1440.

## Journal

After an `implementation-plan.md` task passes its verify step, append one `### Task N: <title>` entry under `## Entries` in `docs/implementation-journal.md` (re-read the file first; stop if the heading already exists; never edit another entry). Exactly one bullet starts with `**Decision:**` — use `**Decision:** none. Implemented as specified.` when the plan decided everything, and add `**Deviation:**` quoting the step when you departed from it. Commit the entry with the task.
