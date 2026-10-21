# Frame by Frame — v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The last step of every task appends to `docs/implementation-journal.md` and commits that entry with the task. Reviewers read the journal before the diff.

**Goal:** Ship a static, no-backend Vite site that presents a 16-week filmmaking curriculum week by week, tracks progress in the browser, and exposes a filterable directory of the verified resource ledger.

**Architecture:** Typed content modules in `src/content/` are validated by Zod at prebuild, so bad data fails the build rather than the page. All business logic lives in pure functions in `src/lib/` with storage injected, making it unit-testable without a DOM. React components are presentational and read state through a single `useProgress` hook over one versioned localStorage key. The decorative WebGL layer is vendored, lazy-loaded, and structurally barred from every route the learner works in.

**Tech Stack:** Vite 8.3.5 · React 19.3.1 · TypeScript (strict) · React Router 7.18.4 · Tailwind CSS 4.3.3 · shadcn/ui · Zod 4.6.7 · Fuse.js 7.5.0 · Lucide 1.61.0 · TanStack Virtual 3.14.21 · Vitest 5.0.5 · Playwright 1.64.1

**Read before starting:**
- `docs/prd.md` — product, IA, screen specs, data model, F1–F20
- `docs/design-system.md` — every visual decision; **never invent a color, size, duration, or font**
- `docs/implementation-journal.md` — the single journal; append one entry after your task verifies, using the template and `**Decision:**` flag in that file
- `Frame by Frame Research Ledger, Curriculum and PRD.md` — Part 1 is the resource content, Part 2 is the curriculum content

## Global Constraints

- **TypeScript strict mode on.** No `any`, no non-null assertions on parsed data.
- **Never invent a design value.** Every color, spacing step, radius, duration, and font size is already specified in `docs/design-system.md`. Transcribe; do not improvise.
- **`--accent-warm` is reserved for progress and completion only.** Never on a link, button, filter, or nav item (`design-system.md` §2.4).
- **Icons from Lucide only. No emoji, ever.**
- **Touch targets ≥48×48px with ≥8px separation.**
- **Body text never below 16px on mobile.** No horizontal scroll at 360px.
- **Animate `transform` and `opacity` only.** Hover states never use `scale`.
- **Grain is never in the same stacking layer as text**, and is off in light mode.
- **Three.js is never installed.** The atmosphere layer is vendored source (`design-system.md` §7.0).
- **Learning routes (`/plan`, `/week/:n`, `/library`, `/toolkit`, `/capstone`) load zero canvas code.**
- **Every resource needs a `cost` and a `verified` date; every assignment needs ≥2 done-when checks.** Build validation enforces both.
- Commit after every task with a conventional-commit message.
- **Journal before that commit.** Append one entry to `docs/implementation-journal.md` after the task's verify step passes. Flag every engineering decision with `**Decision:**`. The entry is part of the task commit. Full rules are in [Implementation journal](#implementation-journal).

## File Structure

| Path | Responsibility |
|---|---|
| `src/lib/types.ts` | All shared types. No logic. |
| `src/lib/schema.ts` | Zod schemas + cross-reference validation. Pure. |
| `src/lib/progress.ts` | Progress read/write/transform. Storage injected. Pure. |
| `src/lib/week.ts` | Week-number derivation and clamping. Pure. |
| `src/lib/search.ts` | Fuse index, facet filtering, status derivation. Pure. |
| `src/lib/webgl-guard.ts` | Single-surface lock + device capability gate. |
| `src/hooks/*` | React bindings over `src/lib/`. No business logic. |
| `src/content/*` | Typed curriculum and resource data. No logic. |
| `src/components/ui/*` | shadcn primitives, unmodified except token wiring. |
| `src/components/filmstrip/*` | The progress-rail metaphor, used by shell, plan, dashboard, capstone. |
| `src/components/resource/*` | Resource card, gap card, badge row. |
| `src/components/week/*` | Week header, task list, assignment card, done-when list, notes. |
| `src/components/atmosphere/*` | Grain, letterbox, vignette (static) + lazy canvas wrappers. |
| `src/vendor/threeui/*` | Vendored MIT source, unmodified. |
| `src/routes/*` | One file per route. Composition only. |
| `scripts/*` | `validate-content.ts`, `check-links.ts`, `assert-bundle.ts` |
| `docs/implementation-journal.md` | The only implementation journal. One append-only entry per completed task. Review record of decisions and deviations. |

## Implementation journal

`docs/implementation-journal.md` is the only journal. Every agent writes there after its task verifies and before its commit. Reviewers read that file against this plan: the diff shows what changed, the journal shows which choices were made and which specified steps were not followed.

Every task inherits these rules. The last step of each task repeats the concrete heading and the `git add` path, because an implementer may have only that task in context.

1. Write the entry only after that task's verify step has passed.
2. Re-read `docs/implementation-journal.md` immediately before appending. Add the entry at the end of `## Entries`.
3. The heading is `### Task N: <title>` copied from this plan. One entry per task. If that heading already exists, stop.
4. Do not edit another task's entry. Do not reorder entries. Do not maintain a status table. Reviewers match headings to the required list in the journal.
5. Flag every engineering decision with a bullet whose line starts with `**Decision:**`. A decision is a choice this plan did not already make, or a choice that departs from this plan, `docs/prd.md`, or `docs/design-system.md`. Carrying out a specified step is not a decision.
6. When nothing was decided beyond the plan, the decisions section is exactly one bullet: `**Decision:** none. Implemented as specified.`
7. A departure from a specified step adds `**Deviation:**` on that same decision and quotes the step.
8. The entry is part of the task commit. The commit step's `git add` includes `docs/implementation-journal.md`.
9. Writes are serial. Subagent-driven execution reviews between tasks, so the next task starts after the previous entry is committed. If two tasks would finish together, the parent appends one entry, commits, then the next. Two writers appending at once will drop an entry.

Task 17's entry also states which of the 17 required headings are missing.

---

### Task 1: Scaffold and toolchain

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`, `components.json`
- Create: `src/lib/noop.test.ts` (temporary toolchain proof, deleted in Task 3)

**Interfaces:**
- Consumes: nothing.
- Produces: the `@/*` path alias resolving to `src/*`; `npm run dev`, `npm run build`, `npm run test`, `npm run e2e` scripts.

- [x] **Step 1: Initialise the repo and scaffold Vite**

```bash
cd /Users/manofcode/Projects/personal/framebyframe
git init
npm create vite@latest . -- --template react-ts
npm install
```

If Vite refuses to scaffold into a non-empty directory, scaffold into `.tmp-scaffold/`, move its contents up, and delete the folder. Keep the existing `docs/` and the research ledger markdown untouched.

- [x] **Step 2: Install dependencies at the verified versions**

```bash
npm install react@19.3.1 react-dom@19.3.1 react-router-dom@7.18.4 fuse.js@7.5.0 zod@4.6.7 lucide-react@1.61.0 @tanstack/react-virtual@3.14.21
npm install -D tailwindcss@4.3.3 @tailwindcss/vite@4.3.3 vitest@5.0.5 @vitest/coverage-v8@5.0.5 jsdom @testing-library/react @testing-library/user-event @playwright/test@1.64.1 tsx
```

Do **not** install `three` or `@designcodeio/threeui`.

- [x] **Step 3: Configure the path alias and Tailwind plugin**

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("src/vendor/threeui")) return "atmosphere";
          return undefined;
        },
      },
    },
  },
});
```

Add to `tsconfig.app.json` under `compilerOptions`: `"baseUrl": "."`, `"paths": { "@/*": ["./src/*"] }`, and confirm `"strict": true`.

- [x] **Step 4: Configure Vitest**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "jsdom", globals: true, include: ["src/**/*.test.{ts,tsx}"] },
});
```

- [x] **Step 5: Add scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "vite",
    "prebuild": "tsx scripts/validate-content.ts",
    "build": "tsc -b && vite build && tsx scripts/assert-bundle.ts",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "validate": "tsx scripts/validate-content.ts",
    "check-links": "tsx scripts/check-links.ts"
  }
}
```

`scripts/validate-content.ts` and `scripts/assert-bundle.ts` do not exist yet, so `npm run build` will fail until Tasks 3 and 17. That is expected and correct — the pipeline is wired before it is filled.

- [x] **Step 6: Write a toolchain proof test**

`src/lib/noop.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("toolchain", () => {
  it("resolves the @ alias and runs TypeScript", async () => {
    const mod = await import("@/main.tsx").catch(() => null);
    expect(mod === null || typeof mod === "object").toBe(true);
  });
});
```

- [x] **Step 7: Verify**

Run: `npm run test`
Expected: 1 passing test.

Run: `npx tsc -b --noEmit`
Expected: exit 0, no output.

Run: `npm run dev`, open the printed URL.
Expected: the default Vite React page renders with no console errors.

- [x] **Step 8: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 1: Scaffold and toolchain` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "chore: scaffold vite + react + typescript toolchain"
```

The journal entry ships in this commit.

---

### Task 2: Design tokens, theme, and grain

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/grain.css`, `src/index.css`
- Create: `src/hooks/useTheme.ts`, `src/lib/theme.ts`, `src/lib/theme.test.ts`
- Modify: `index.html` (inline pre-paint theme script)

**Interfaces:**
- Produces: `type Theme = 'dark' | 'light' | 'system'`; `resolveTheme(pref: Theme, prefersDark: boolean): 'dark' | 'light'`; `applyTheme(resolved: 'dark' | 'light', root: HTMLElement): void`; `useTheme(): { theme: Theme; resolved: 'dark' | 'light'; setTheme(t: Theme): void }`; a `.grain` utility class.

- [x] **Step 1: Transcribe the tokens**

Create `src/styles/tokens.css`. Transcribe **every** token from `docs/design-system.md` §2.1 into `:root` (dark is the default) and **every** token from §2.2 into `.light`. Then add §4's spacing, radius, z-index, easing, and duration tokens, and §3.2's type scale. Also map shadcn's variable names per §2.3.

Invent nothing. If a value you need is not in the design system, stop and ask rather than choosing one.

Structure (abbreviated — fill in all tokens):

```css
:root {
  --bg-base: #07090D;
  --text-primary: #E8EDF5;
  --accent-primary: #6AB8FF;
  --accent-warm: #F2A65A;
  --grain-opacity: 0.025;
  /* …all remaining §2.1 tokens… */

  --space-1: 4px;  /* …through --space-10: 128px… */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 150ms; --dur-base: 220ms; --dur-slow: 420ms; --dur-ceremony: 900ms;

  /* shadcn mapping, §2.3 */
  --background: var(--bg-base);
  --foreground: var(--text-primary);
  --primary: var(--accent-primary);
  --ring: var(--accent-primary);
  --radius: 0.5rem;
  /* …remaining mappings… */
}

.light {
  --bg-base: #F7F8FA;
  --text-primary: #0E141C;
  --accent-primary: #0B63CE;
  --accent-warm: #A35A09;
  --grain-opacity: 0;
  /* …all remaining §2.2 tokens… */
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur-base: 1ms; --dur-slow: 1ms; --dur-ceremony: 1ms; }
}
```

- [x] **Step 2: Wire Tailwind v4 and the grain utility**

`src/index.css`:

```css
@import "tailwindcss";
@import "./styles/tokens.css";
@import "./styles/grain.css";

@theme inline {
  --color-background: var(--bg-base);
  --color-foreground: var(--text-primary);
  --color-primary: var(--accent-primary);
  --color-warm: var(--accent-warm);
  --color-border: var(--border-default);
  --font-display: "Archivo Expanded", "Arial Black", system-ui;
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  /* …extend with the remaining tokens the components need… */
}

@custom-variant dark (&:where(:not(.light) *));
```

`src/styles/grain.css` — copy the `.grain` implementation from `design-system.md` §5.3 verbatim. Generate the 128px `feTurbulence` SVG, inline it as a data URI in `--grain-tile`, and set `baseFrequency` around `0.85` with `numOctaves="3"`.

- [x] **Step 3: Write the failing theme test**

`src/lib/theme.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { resolveTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("returns the explicit preference when not system", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("follows the OS when preference is system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});
```

- [x] **Step 4: Run it and watch it fail**

Run: `npm run test -- theme`
Expected: FAIL — cannot resolve `@/lib/theme`.

- [x] **Step 5: Implement**

`src/lib/theme.ts`:

```ts
export type Theme = "dark" | "light" | "system";
export const THEME_KEY = "fbf:theme";

export function resolveTheme(pref: Theme, prefersDark: boolean): "dark" | "light" {
  if (pref === "system") return prefersDark ? "dark" : "light";
  return pref;
}

export function applyTheme(resolved: "dark" | "light", root: HTMLElement): void {
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}
```

- [x] **Step 6: Verify the test passes**

Run: `npm run test -- theme`
Expected: 2 passing.

- [x] **Step 7: Prevent the flash of wrong theme**

Add to `index.html` as the **first** element inside `<head>`, before any stylesheet:

```html
<script>
  (function () {
    try {
      var p = localStorage.getItem("fbf:theme") || "system";
      var dark = p === "dark" || (p === "system" && !window.matchMedia("(prefers-color-scheme: light)").matches);
      if (!dark) document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (e) {}
  })();
</script>
```

Also add the font `<link rel="preload">` for Archivo Expanded only, per `design-system.md` §3.1, and self-host the three families as woff2 under `public/fonts/`.

- [x] **Step 8: Implement `useTheme`**

`src/hooks/useTheme.ts` reads `THEME_KEY`, subscribes to `matchMedia("(prefers-color-scheme: light)")`, calls `applyTheme` on change, and persists on `setTheme`. Wrap all storage access in try/catch.

- [x] **Step 9: Verify both modes by eye**

Temporarily render a swatch page in `App.tsx` showing every token as a labelled chip with its contrast ratio against the current background. Toggle both themes.
Expected: no token is invisible against its intended background; `--text-tertiary` is legible at weight 400; grain is visible on dark and absent on light.

- [x] **Step 10: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 2: Design tokens, theme, and grain` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: design tokens, theme switching, and grain utility"
```

The journal entry ships in this commit.

---

### Task 3: Content types and build-time validation

**Files:**
- Create: `src/lib/types.ts`, `src/lib/schema.ts`, `src/lib/schema.test.ts`, `scripts/validate-content.ts`
- Create: `src/content/index.ts` (empty barrel, filled in Tasks 4–5)
- Delete: `src/lib/noop.test.ts`

**Interfaces:**
- Produces: every type in `docs/prd.md` §5 (`Resource`, `Task`, `Gap`, `Week`, `Progress`, plus `Tool` and `CapstoneStage`); `validateContent(content): ValidationIssue[]`; `type ValidationIssue = { kind: string; where: string; message: string }`.

- [ ] **Step 1: Transcribe the types**

`src/lib/types.ts` — copy every type from `docs/prd.md` §5 verbatim, then add:

```ts
export type Tool = {
  id: string; name: string; purpose: string; license: string; url: string;
  firstWeek: number; experimental?: boolean; limitations?: string[];
};

export type CapstoneStage = {
  id: string; label: string; order: number; weeks: number[]; criteria: string[];
};

export type Content = {
  resources: Resource[]; weeks: Week[]; gaps: Gap[];
  tools: Tool[]; capstone: CapstoneStage[];
};
```

- [ ] **Step 2: Write the failing validation tests**

`src/lib/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateContent } from "@/lib/schema";
import type { Content } from "@/lib/types";

const base: Content = { resources: [], weeks: [], gaps: [], tools: [], capstone: [] };

const resource = {
  id: "r1", title: "T", url: "https://example.com", type: "article" as const,
  topics: ["x"], weeks: [1], level: "beginner" as const, cost: "free" as const,
  language: "en", why: "because", verified: "2026-10-21",
};

const week = {
  n: 1, module: 1, title: "W1", topics: ["x"],
  tasks: [{ id: "t1", kind: "read" as const, text: "read it", resourceIds: ["r1"], minutes: 30, core: true }],
  assignment: { id: "a1", text: "do it", checks: ["check one", "check two"] },
  community: "r/Screenwriting",
};

describe("validateContent", () => {
  it("accepts well-formed content", () => {
    expect(validateContent({ ...base, resources: [resource], weeks: [week] })).toEqual([]);
  });

  it("rejects a resource with no verified date", () => {
    const bad = { ...resource, verified: "" };
    const issues = validateContent({ ...base, resources: [bad], weeks: [] });
    expect(issues.some((i) => i.where.includes("r1") && /verified/.test(i.message))).toBe(true);
  });

  it("rejects duplicate resource ids", () => {
    const issues = validateContent({ ...base, resources: [resource, { ...resource, title: "Other" }], weeks: [] });
    expect(issues.some((i) => i.kind === "duplicate-id")).toBe(true);
  });

  it("rejects a task referencing an unknown resource id", () => {
    const bad = { ...week, tasks: [{ ...week.tasks[0], resourceIds: ["nope"] }] };
    const issues = validateContent({ ...base, resources: [resource], weeks: [bad] });
    expect(issues.some((i) => i.kind === "unknown-resource" && i.where.includes("week 1"))).toBe(true);
  });

  it("rejects an assignment with fewer than two checks", () => {
    const bad = { ...week, assignment: { id: "a1", text: "do it", checks: ["only one"] } };
    const issues = validateContent({ ...base, resources: [resource], weeks: [bad] });
    expect(issues.some((i) => /two checks/.test(i.message))).toBe(true);
  });

  it("rejects a week outside 1-16", () => {
    const issues = validateContent({ ...base, resources: [resource], weeks: [{ ...week, n: 17 }] });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejects an empty week with no declared gap", () => {
    const bad = { ...week, tasks: [], gapIds: undefined };
    const issues = validateContent({ ...base, resources: [resource], weeks: [bad] });
    expect(issues.some((i) => i.kind === "empty-week")).toBe(true);
  });

  it("accepts an empty week that declares a gap", () => {
    const gap = { id: "g1", scope: "week" as const, ref: "1", missing: "m", attempted: ["q"], note: "n" };
    const bad = { ...week, tasks: [], gapIds: ["g1"] };
    expect(validateContent({ ...base, resources: [resource], weeks: [bad], gaps: [gap] })).toEqual([]);
  });
});
```

- [ ] **Step 3: Run and watch it fail**

Run: `npm run test -- schema`
Expected: FAIL — cannot resolve `@/lib/schema`.

- [ ] **Step 4: Implement the schemas**

`src/lib/schema.ts`. Use `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "verified must be an ISO date")` for `verified` rather than a version-specific date helper. Build `resourceSchema`, `taskSchema`, `gapSchema`, `weekSchema`, `toolSchema`, `capstoneStageSchema`, then:

```ts
export function validateContent(content: Content): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (kind: string, where: string, message: string) => issues.push({ kind, where, message });

  const seen = new Set<string>();
  for (const r of content.resources) {
    const parsed = resourceSchema.safeParse(r);
    if (!parsed.success) {
      for (const e of parsed.error.issues) push("schema", `resource ${r.id}`, `${e.path.join(".")}: ${e.message}`);
    }
    if (seen.has(r.id)) push("duplicate-id", `resource ${r.id}`, "duplicate resource id");
    seen.add(r.id);
    for (const w of r.weeks) if (w < 1 || w > 16) push("week-range", `resource ${r.id}`, `week ${w} outside 1-16`);
  }

  const gapIds = new Set(content.gaps.map((g) => g.id));
  const weekNumbers = new Set<number>();
  for (const w of content.weeks) {
    const parsed = weekSchema.safeParse(w);
    if (!parsed.success) {
      for (const e of parsed.error.issues) push("schema", `week ${w.n}`, `${e.path.join(".")}: ${e.message}`);
    }
    if (weekNumbers.has(w.n)) push("duplicate-id", `week ${w.n}`, "duplicate week number");
    weekNumbers.add(w.n);
    if (w.assignment.checks.length < 2) push("rubric", `week ${w.n}`, "assignment needs at least two checks");
    if (w.tasks.length === 0 && !(w.gapIds && w.gapIds.length > 0)) {
      push("empty-week", `week ${w.n}`, "empty tasks array with no declared gap");
    }
    for (const t of w.tasks) {
      for (const id of t.resourceIds) {
        if (!seen.has(id)) push("unknown-resource", `week ${w.n} task ${t.id}`, `unknown resource id "${id}"`);
      }
    }
    for (const id of w.gapIds ?? []) {
      if (!gapIds.has(id)) push("unknown-gap", `week ${w.n}`, `unknown gap id "${id}"`);
    }
  }
  return issues;
}
```

Note the `weekSchema` must itself enforce `n` within 1–16 so the "week outside 1-16" test passes through the schema branch.

- [ ] **Step 5: Verify the tests pass**

Run: `npm run test -- schema`
Expected: 8 passing.

- [ ] **Step 6: Write the prebuild gate**

`scripts/validate-content.ts` imports the content barrel, runs `validateContent`, prints each issue as `kind · where · message`, and calls `process.exit(1)` when any exist. On success it prints the counts: resources, weeks, gaps, tools, stages.

- [ ] **Step 7: Verify the gate**

Run: `npm run validate`
Expected: exit 0 with all counts at zero (content is still empty).

Temporarily add a resource with `verified: ""` to the barrel, re-run.
Expected: exit 1, naming the resource and the field. Revert.

- [ ] **Step 8: Clean up, journal, then commit**

```bash
rm src/lib/noop.test.ts
```

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 3: Content types and build-time validation` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: content types and build-time validation"
```

The journal entry ships in this commit.

---

### Task 4: Port the resource ledger

**Files:**
- Create: `src/content/resources.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `Resource` from `@/lib/types`.
- Produces: `export const resources: Resource[]`.

- [ ] **Step 1: Transcribe every resource from the ledger**

Source: `Frame by Frame Research Ledger, Curriculum and PRD.md` Part 1, all seven module sections plus "Cross-cutting". Every row becomes one `Resource`.

Transcription rules, all load-bearing:
- `id` is a stable kebab-case slug: `lessons-from-the-screenplay`, `studiobinder-180-degree-rule`.
- `why` carries the ledger's license caveat **inline**, not just the reason. The BBC Sound Effects Archive's `why` must state it is non-commercial only; Freesound's must state licensing is per-file; Pixabay's must state the pre/post-2019 split. This is requirement F19.
- `verified: "2026-10-21"` for everything, matching the ledger's session date.
- `emailGated: true` for the StudioBinder script-breakdown sheet, actor release form, and EPK template.
- `grayArea: true` for anything the ledger flags as gray area. Script Slug and IMSDb are **excluded entirely**, not flagged.
- `benchmarkOnly: true` for ShotDeck, WGA East registration, and the paid genre festivals.
- `experimental: true` for ArtCraft only.
- **HitFilm is omitted entirely** — the ledger marks it discontinued.
- **Kickstarter is omitted** as a launch option — the ledger confirms India-based creators cannot launch there.
- Resources whose ledger entry is a search term rather than a URL (mcpro24fps, several No Film School articles) point at the site root with the search term stated in `why`.
- `language: "hi"` for the Cursa Hindi screenwriting course. Everything else verified is `"en"`. Do not guess a language for anything else.

- [ ] **Step 2: Export the barrel**

`src/content/index.ts`:

```ts
import { resources } from "./resources";
import type { Content } from "@/lib/types";

export const content: Content = { resources, weeks: [], gaps: [], tools: [], capstone: [] };
export { resources };
```

- [ ] **Step 3: Verify**

Run: `npm run validate`
Expected: exit 0, resource count printed. Cross-check the printed count against your transcription tally before moving on.

Run: `npx tsc -b --noEmit`
Expected: exit 0.

- [ ] **Step 4: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 4: Port the resource ledger` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add src/content docs/implementation-journal.md
git commit -m "feat: port the verified resource ledger to typed content"
```

The journal entry ships in this commit. This step stages `src/content` only, plus the journal, so unrelated files stay out of the commit.

---

### Task 5: Port the curriculum, gaps, tools, and capstone stages

**Files:**
- Create: `src/content/weeks.ts`, `src/content/gaps.ts`, `src/content/tools.ts`, `src/content/capstone.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Produces: `weeks: Week[]` (all 16), `gaps: Gap[]`, `tools: Tool[]`, `capstone: CapstoneStage[]`.

- [ ] **Step 1: Transcribe weeks 1–16**

Source: ledger Part 2's table. Each row becomes one `Week`. Rules:
- Split the "Watch", "Read", and "Do" cells into separate `Task` entries with `kind` set accordingly and `resourceIds` pointing at Task 4's slugs.
- `minutes` apportions the row's core-hours estimate across its tasks. Record the total in the week's own hours display; do not inflate the sum beyond the stated estimate.
- `core: false` for anything the ledger marks stretch — the week 3 storyboard and the week 8 lighting test.
- `heavy: true` on weeks 3 and 8 only.
- `extension: true` on weeks 13–16.
- `assignment.checks` comes from the "Done when" column, split into ≥2 discrete checks. Several cells contain two checks joined by a semicolon — split on it.
- `brochureNo` set where Part 2 names an assignment number (A1, A2, A4…). Weeks 7, 8 and 12 have replaced assignments and week 6's is new — omit `brochureNo` there and state the replacement reason in the assignment text.
- `communityCaveat` for r/Screenwriting ("read the FAQ and Logline Monday rules first") and any subreddit the ledger flags.
- Extension weeks 13–16 have empty `tasks` arrays by design, so each **must** declare a `gapIds` entry explaining why — otherwise Task 3's `empty-week` check will correctly fail the build.

- [ ] **Step 2: Transcribe the gaps**

`src/content/gaps.ts`. At minimum, from the ledger's gap notes:
- `indian-language-craft` (scope `global`) — zero verified Hindi/Tamil/Telugu/Malayalam/Marathi/Bengali filmmaking-craft channels across three research passes. `attempted` lists the direct-language queries, named-channel guesses, and known-person leads Batch G documented.
- `raw-footage-practice` (scope `global`) — no verified public-domain or CC raw dramatic footage for rough-cut practice; the fallback is the learner's own week 7 camera-test footage.
- `india-public-shooting-law` (scope `module`, ref `2`) — only the formal commercial-production system is documented; the site states practical norms, not verified law.
- `hindi-resolve-sound` (scope `module`, ref `5`) and `hindi-blender-vfx` (scope `module`, ref `6`).
- One per extension week explaining the buffer design.

- [ ] **Step 3: Transcribe the toolkit**

`src/content/tools.ts`. Every tool named in the ledger with its license, official download URL, and first week of use. `limitations` carries the hard caveats: DaVinci Resolve free edition lacks hardware-accelerated H.264/H.265 decode, noise reduction, and several ResolveFX. `experimental: true` on ArtCraft with GIMP/Krita/Inkscape listed as the reliable default. HitFilm absent.

- [ ] **Step 4: Transcribe the capstone stages**

`src/content/capstone.ts`. Eight stages in order — premise, script, shot list, shoot, rough cut, sound, final cut, submissions — each with its `weeks` range and `criteria` pulled from the matching week's done-when checks.

- [ ] **Step 5: Verify**

Run: `npm run validate`
Expected: exit 0; printed counts read 16 weeks, 8 capstone stages, and non-zero gaps and tools.

Write a content guard test, `src/content/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { content } from "@/content";

describe("content integrity", () => {
  it("has all sixteen weeks exactly once", () => {
    const ns = content.weeks.map((w) => w.n).sort((a, b) => a - b);
    expect(ns).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
  });

  it("gives every assignment at least two checks", () => {
    for (const w of content.weeks) expect(w.assignment.checks.length).toBeGreaterThanOrEqual(2);
  });

  it("gives every core week watch, read and do work", () => {
    for (const w of content.weeks.filter((x) => !x.extension)) {
      for (const kind of ["watch", "read", "do"] as const) {
        const has = w.tasks.some((t) => t.kind === kind) || (w.gapIds ?? []).length > 0;
        expect(has, `week ${w.n} is missing ${kind}`).toBe(true);
      }
    }
  });

  it("gives every resource a cost and a verified date", () => {
    for (const r of content.resources) {
      expect(r.cost, r.id).toBeTruthy();
      expect(r.verified, r.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("marks weeks 3 and 8 heavy", () => {
    for (const n of [3, 8]) expect(content.weeks.find((w) => w.n === n)?.heavy).toBe(true);
  });

  it("names a first week for every tool", () => {
    for (const t of content.tools) expect(t.firstWeek).toBeGreaterThanOrEqual(1);
  });

  it("does not ship HitFilm", () => {
    const all = JSON.stringify(content).toLowerCase();
    expect(all.includes("hitfilm")).toBe(false);
  });
});
```

Run: `npm run test -- content`
Expected: 7 passing.

- [ ] **Step 6: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 5: Port the curriculum, gaps, tools, and capstone stages` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: port curriculum, gaps, toolkit and capstone content"
```

The journal entry ships in this commit.

---

### Task 6: Progress engine

**Files:**
- Create: `src/lib/progress.ts`, `src/lib/progress.test.ts`, `src/hooks/useProgress.ts`

**Interfaces:**
- Produces, and later tasks depend on these exact names:

```ts
export const STORAGE_KEY = "fbf:progress:v1";
export const emptyProgress: Progress;
export type LoadStatus = "ok" | "empty" | "corrupt" | "unavailable";
export function loadProgress(storage?: Storage | null): { progress: Progress; status: LoadStatus };
export function saveProgress(p: Progress, storage?: Storage | null): "ok" | "unavailable";
export function toggleDone(p: Progress, id: string): Progress;
export function setNote(p: Progress, id: string, text: string): Progress;
export function setCapstoneStage(p: Progress, id: string, s: "todo" | "doing" | "done"): Progress;
export function exportProgress(p: Progress): string;
export function importProgress(json: string): { ok: true; progress: Progress } | { ok: false; reason: string };
export function countDone(p: Progress, ids: string[]): number;
```

`useProgress()` returns `{ progress, status, toggle, note, stage, setStartDate, setWeekOverride, replace }` and debounces writes by 300ms.

- [ ] **Step 1: Write the failing tests**

`src/lib/progress.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY, emptyProgress, loadProgress, saveProgress, toggleDone,
  setNote, setCapstoneStage, exportProgress, importProgress, countDone,
} from "@/lib/progress";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => { map.delete(k); },
    setItem: (k, v) => { map.set(k, v); },
  } as Storage;
}

describe("progress", () => {
  let store: Storage;
  beforeEach(() => { store = memoryStorage(); });

  it("reports empty when nothing is stored", () => {
    expect(loadProgress(store)).toEqual({ progress: emptyProgress, status: "empty" });
  });

  it("round-trips through storage", () => {
    const p = toggleDone(emptyProgress, "t1");
    expect(saveProgress(p, store)).toBe("ok");
    expect(loadProgress(store)).toEqual({ progress: p, status: "ok" });
  });

  it("reports unavailable instead of throwing when storage fails", () => {
    const broken = { ...memoryStorage(), setItem() { throw new Error("quota"); } } as Storage;
    expect(saveProgress(emptyProgress, broken)).toBe("unavailable");
    expect(loadProgress(null).status).toBe("unavailable");
  });

  it("reports corrupt and falls back to empty on bad JSON", () => {
    store.setItem(STORAGE_KEY, "{not json");
    const { progress, status } = loadProgress(store);
    expect(status).toBe("corrupt");
    expect(progress).toEqual(emptyProgress);
  });

  it("toggles a task on and off without mutating the input", () => {
    const on = toggleDone(emptyProgress, "t1");
    expect(on.done.t1).toBe(true);
    expect(emptyProgress.done.t1).toBeUndefined();
    expect(toggleDone(on, "t1").done.t1).toBe(false);
  });

  it("stores notes and capstone stages", () => {
    expect(setNote(emptyProgress, "a1", "hello").notes.a1).toBe("hello");
    expect(setCapstoneStage(emptyProgress, "script", "doing").capstone.script).toBe("doing");
  });

  it("counts only ids that are currently true", () => {
    const p = toggleDone(toggleDone(emptyProgress, "a"), "b");
    expect(countDone(p, ["a", "b", "c"])).toBe(2);
    expect(countDone(toggleDone(p, "b"), ["a", "b"])).toBe(1);
  });

  it("imports what it exports", () => {
    const p = setNote(toggleDone(emptyProgress, "t1"), "a1", "note");
    const result = importProgress(exportProgress(p));
    expect(result).toEqual({ ok: true, progress: p });
  });

  it("rejects an import with the wrong version, naming both versions", () => {
    const result = importProgress(JSON.stringify({ ...emptyProgress, version: 2 }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/2.*1|1.*2/);
  });

  it("rejects malformed import without throwing", () => {
    expect(importProgress("[]").ok).toBe(false);
    expect(importProgress("{bad").ok).toBe(false);
  });

  it("ignores orphan keys rather than failing", () => {
    const p = toggleDone(emptyProgress, "removed-task");
    expect(countDone(p, ["still-here"])).toBe(0);
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm run test -- progress`
Expected: FAIL — cannot resolve `@/lib/progress`.

- [ ] **Step 3: Implement**

Every function is pure and returns a new object; `loadProgress` and `saveProgress` wrap all storage access in try/catch and default `storage` to `globalThis.localStorage ?? null`. `importProgress` parses, checks `version === 1`, checks that `done`, `notes` and `capstone` are plain objects, and returns a specific `reason` string on each failure — never throws.

- [ ] **Step 4: Verify**

Run: `npm run test -- progress`
Expected: 11 passing.

- [ ] **Step 5: Implement the hook**

`src/hooks/useProgress.ts` loads once on mount, holds progress in state, debounces `saveProgress` by 300ms, and exposes `status` so the shell can render the read-only banner when it is `unavailable`. No business logic here — it only calls `src/lib/progress.ts`.

- [ ] **Step 6: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 6: Progress engine` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: progress engine with storage fallbacks and json round-trip"
```

The journal entry ships in this commit.

---

### Task 7: Week derivation

**Files:**
- Create: `src/lib/week.ts`, `src/lib/week.test.ts`, `src/hooks/useCurrentWeek.ts`

**Interfaces:**

```ts
export const TOTAL_WEEKS = 16;
export const CORE_WEEKS = 12;
export function rawWeekNumber(startDate: string, now: Date): number;  // may be <1 or >16
export function clampWeek(n: number): number;                          // 1..16
export function resolveCurrentWeek(p: Progress, now: Date): {
  week: number;
  source: "override" | "derived" | "unset";
  complete: boolean;
};
```

- [ ] **Step 1: Write the failing tests**

`src/lib/week.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clampWeek, rawWeekNumber, resolveCurrentWeek } from "@/lib/week";
import { emptyProgress } from "@/lib/progress";

const at = (iso: string) => new Date(`${iso}T12:00:00`);

describe("rawWeekNumber", () => {
  it("is week 1 on the start date", () => {
    expect(rawWeekNumber("2026-10-22", at("2026-10-22"))).toBe(1);
  });

  it("stays week 1 through day six", () => {
    expect(rawWeekNumber("2026-10-22", at("2026-10-28"))).toBe(1);
  });

  it("rolls to week 2 on day seven", () => {
    expect(rawWeekNumber("2026-10-22", at("2026-10-29"))).toBe(2);
  });

  it("returns below one for a future start date", () => {
    expect(rawWeekNumber("2026-11-01", at("2026-10-22"))).toBeLessThan(1);
  });

  it("returns above sixteen past the end", () => {
    expect(rawWeekNumber("2026-01-01", at("2026-10-22"))).toBeGreaterThan(16);
  });
});

describe("clampWeek", () => {
  it("clamps both ends", () => {
    expect(clampWeek(0)).toBe(1);
    expect(clampWeek(-4)).toBe(1);
    expect(clampWeek(17)).toBe(16);
    expect(clampWeek(7)).toBe(7);
  });
});

describe("resolveCurrentWeek", () => {
  it("is unset with no start date", () => {
    expect(resolveCurrentWeek(emptyProgress, at("2026-10-22"))).toEqual({ week: 1, source: "unset", complete: false });
  });

  it("derives from the start date", () => {
    const p = { ...emptyProgress, startDate: "2026-10-22" };
    expect(resolveCurrentWeek(p, at("2026-11-05"))).toEqual({ week: 3, source: "derived", complete: false });
  });

  it("lets the override win over the derived week", () => {
    const p = { ...emptyProgress, startDate: "2026-10-22", weekOverride: 9 };
    expect(resolveCurrentWeek(p, at("2026-11-05"))).toEqual({ week: 9, source: "override", complete: false });
  });

  it("flags completion past week sixteen but still returns a valid week", () => {
    const p = { ...emptyProgress, startDate: "2026-01-01" };
    const r = resolveCurrentWeek(p, at("2026-10-22"));
    expect(r.complete).toBe(true);
    expect(r.week).toBe(16);
  });

  it("clamps a future start date to week one without flagging completion", () => {
    const p = { ...emptyProgress, startDate: "2026-12-01" };
    expect(resolveCurrentWeek(p, at("2026-10-22"))).toEqual({ week: 1, source: "derived", complete: false });
  });

  it("ignores an out-of-range override", () => {
    const p = { ...emptyProgress, startDate: "2026-10-22", weekOverride: 99 };
    expect(resolveCurrentWeek(p, at("2026-10-22")).week).toBe(16);
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm run test -- week`
Expected: FAIL — cannot resolve `@/lib/week`.

- [ ] **Step 3: Implement**

Compare local midnights, not raw timestamps, so a learner crossing midnight mid-session does not jump a week:

```ts
function localMidnight(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function rawWeekNumber(startDate: string, now: Date): number {
  const [y, m, d] = startDate.split("-").map(Number);
  const start = new Date(y, m - 1, d).getTime();
  const days = Math.floor((localMidnight(now) - start) / 86_400_000);
  return Math.floor(days / 7) + 1;
}
```

`resolveCurrentWeek` returns `complete: rawWeekNumber(...) > TOTAL_WEEKS` and always clamps `week`.

- [ ] **Step 4: Verify**

Run: `npm run test -- week`
Expected: 12 passing.

- [ ] **Step 5: Implement the hook, journal, then commit**

`src/hooks/useCurrentWeek.ts` wraps `resolveCurrentWeek(progress, new Date())` and recomputes on progress change.

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 7: Week derivation` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: week derivation with override and completion detection"
```

The journal entry ships in this commit.

---

### Task 8: App shell and navigation

**Files:**
- Create: `src/routes/Root.tsx`, `src/components/nav/LeftRail.tsx`, `src/components/nav/BottomTabs.tsx`, `src/components/nav/MoreSheet.tsx`, `src/components/nav/ThemeToggle.tsx`, `src/components/SkipLink.tsx`, `src/router.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`

**Interfaces:**
- Consumes: `useProgress`, `useCurrentWeek`, `useTheme`.
- Produces: the router with all 8 route entries from `docs/prd.md` §3; `NAV_ITEMS` as an exported array of `{ to, label, icon }`.

- [ ] **Step 1: Install the shadcn primitives**

```bash
npx shadcn@latest init
npx shadcn@latest add button checkbox card badge tabs accordion dialog command sheet progress separator tooltip sonner select toggle-group scroll-area skeleton switch alert table popover collapsible textarea
```

During `init`, point the CSS file at `src/index.css` and the alias at `@/components`. After it finishes, open the generated CSS and **remove any color variables it added that duplicate ours** — `src/styles/tokens.css` is the single source of truth.

- [ ] **Step 2: Build the routes**

`src/router.tsx` using `createBrowserRouter`, with every route lazily imported except `Root` and the dashboard. Route table per `docs/prd.md` §3. `/week/:n` validates `n` as 1–16 and renders a not-found state otherwise.

- [ ] **Step 3: Build the shell**

`Root.tsx` renders: `SkipLink` → `LeftRail` (≥768px) or sticky mobile top bar + `BottomTabs` (<768px) → `<Outlet />` → `<Toaster />`. Render the read-only banner when `useProgress().status === "unavailable"`.

- `LeftRail`: 240px fixed, brand mark, `FilmstripRail` (Task 9), then Dashboard · Plan · Library · Capstone · Toolkit · About, current week numeral in mono at the top.
- `BottomTabs`: 5 items — Today, Plan, Library, Capstone, More — 56px tall plus `env(safe-area-inset-bottom)`, each target ≥48px.
- `MoreSheet`: Toolkit, About, theme toggle, export/import.
- Active route marked with `--accent-primary-wash` plus an icon state. Never `--accent-warm`.

- [ ] **Step 4: Verify responsive behaviour**

Run: `npm run dev`, then in devtools check 360px, 768px, 1024px, 1440px.
Expected: no horizontal scroll at 360px; the rail/tabs swap exactly at 768px; no primary action sits above 60% viewport height on mobile (F17); every nav target measures ≥48px in the box model.

Tab through the page from a cold load.
Expected: the skip link is the first focusable element; focus rings are visible on every nav item; tab order matches visual order.

- [ ] **Step 5: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 8: App shell and navigation` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: app shell, routing, and responsive navigation"
```

The journal entry ships in this commit.

---

### Task 9: Filmstrip components

**Files:**
- Create: `src/components/filmstrip/FilmstripRail.tsx`, `src/components/filmstrip/WeekFrame.tsx`, `src/components/filmstrip/filmstrip.css`, `src/components/filmstrip/WeekFrame.test.tsx`

**Interfaces:**

```ts
export type FrameState = "exposed" | "current" | "unexposed";
export function WeekFrame(props: {
  n: number; module: number; title: string; state: FrameState;
  ratio?: { done: number; total: number }; extension?: boolean; heavy?: boolean;
  orientation: "rail" | "card";
}): JSX.Element;
export function FilmstripRail(props: { orientation: "vertical" | "horizontal"; compact?: boolean }): JSX.Element;
```

- [ ] **Step 1: Write the failing test**

`src/components/filmstrip/WeekFrame.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { WeekFrame } from "./WeekFrame";

const base = { n: 7, module: 4, title: "Lighting", orientation: "card" as const };
const renderFrame = (p = {}) =>
  render(<MemoryRouter><WeekFrame {...base} state="current" {...p} /></MemoryRouter>);

describe("WeekFrame", () => {
  it("renders the week number as padded timecode", () => {
    renderFrame();
    expect(screen.getByText(/WK 07/)).toBeTruthy();
  });

  it("marks the exposed state accessibly, not by colour alone", () => {
    renderFrame({ state: "exposed" });
    expect(screen.getByRole("link").getAttribute("aria-current")).toBeNull();
    expect(screen.getByLabelText(/complete/i)).toBeTruthy();
  });

  it("marks the current week with aria-current", () => {
    renderFrame({ state: "current" });
    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("step");
  });

  it("shows the heavy-week chip", () => {
    renderFrame({ heavy: true });
    expect(screen.getByText(/heavy/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm run test -- WeekFrame`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Per `design-system.md` §6: sprocket perforations via `repeating-linear-gradient`; `exposed` fills with `--accent-warm-wash` plus a Lucide `Check` carrying an accessible label; `current` outlines in `--accent-warm` and sets `aria-current="step"`; `unexposed` uses `--border-subtle`. Extension weeks 13–16 are preceded by a splice gap. Each frame is a `<Link>` to `/week/:n` with a ≥48px target.

- [ ] **Step 4: Verify**

Run: `npm run test -- WeekFrame`
Expected: 4 passing.

- [ ] **Step 5: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 9: Filmstrip components` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: filmstrip progress rail and week frames"
```

The journal entry ships in this commit.

---

### Task 10: `/plan`

**Files:**
- Create: `src/routes/Plan.tsx`, `src/components/plan/ModuleGroup.tsx`

**Interfaces:**
- Consumes: `FilmstripRail`, `WeekFrame`, `useProgress`, `useCurrentWeek`, `content`.

- [ ] **Step 1: Build the page**

Per `docs/prd.md` §4.3. Vertical filmstrip on mobile, 2-up grid at ≥768px, grouped under the 7 module headers with a mono eyebrow each. Weeks 13–16 sit in a spliced "Buffer" group carrying the one-line reason from the ledger: no mentors, no supplied footage, and thin brochure coverage in sound and VFX. Each frame shows numeral, module, title, hours, completion ratio, and capstone stage.

- [ ] **Step 2: Verify**

Run: `npm run dev`, visit `/plan`.
Expected: 16 frames in 7 module groups plus the buffer group; the current week is outlined in warm; completed weeks read as exposed; clicking any frame navigates to its week; no horizontal scroll at 360px.

- [ ] **Step 3: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 10: /plan` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: plan page with module grouping and buffer weeks"
```

The journal entry ships in this commit.

---

### Task 11: `/week/:n`

**Files:**
- Create: `src/routes/Week.tsx`, `src/components/week/WeekHeader.tsx`, `src/components/week/TaskList.tsx`, `src/components/week/AssignmentCard.tsx`, `src/components/week/DoneWhenChecklist.tsx`, `src/components/week/NotesField.tsx`, `src/components/resource/ResourceCard.tsx`, `src/components/resource/BadgeRow.tsx`, `src/components/resource/GapCard.tsx`
- Create: `src/components/week/TaskList.test.tsx`

**Interfaces:**

```ts
export function ResourceCard(props: { resource: Resource; minutes?: number }): JSX.Element;
export function GapCard(props: { gap: Gap }): JSX.Element;
export function TaskList(props: { kind: "watch" | "read" | "do"; tasks: Task[] }): JSX.Element;
export function DoneWhenChecklist(props: { assignmentId: string; checks: string[] }): JSX.Element;
```

Done-when check ids are `` `${assignmentId}:check:${index}` `` — later tasks and the export format depend on this exact shape.

- [ ] **Step 1: Write the failing persistence test**

`src/components/week/TaskList.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TaskList } from "./TaskList";
import { STORAGE_KEY } from "@/lib/progress";

const tasks = [
  { id: "t1", kind: "read" as const, text: "Read the thing", resourceIds: [], minutes: 30, core: true },
  { id: "t2", kind: "read" as const, text: "Stretch goal", resourceIds: [], minutes: 20, core: false },
];

describe("TaskList", () => {
  beforeEach(() => localStorage.clear());

  it("separates stretch tasks from core tasks", () => {
    render(<MemoryRouter><TaskList kind="read" tasks={tasks} /></MemoryRouter>);
    expect(screen.getByText(/stretch/i)).toBeTruthy();
  });

  it("persists a ticked task to storage", async () => {
    render(<MemoryRouter><TaskList kind="read" tasks={tasks} /></MemoryRouter>);
    await userEvent.click(screen.getByRole("checkbox", { name: /Read the thing/ }));
    await new Promise((r) => setTimeout(r, 400));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done.t1).toBe(true);
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm run test -- TaskList`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the components**

Follow `docs/prd.md` §4.4 for page order and §4.5–4.6 for the cards. Required behaviours:
- `ResourceCard` links out with `rel="noopener noreferrer"` and an external-link icon, and renders title, type, cost badge, level, `why`, verified date, and a `BadgeRow`. Every badge has an icon **and** text (F19, and the no-colour-alone rule).
- `GapCard` renders dashed, with the help-wanted chip, what is missing, the attempted search terms, and how to contribute — never an empty section (F16).
- `TaskList` renders a "stretch" divider before any `core: false` task.
- `AssignmentCard` carries the 2px `--accent-warm` left border (the slate rule), the brochure number where present, and `DoneWhenChecklist`.
- `NotesField` autosaves debounced 500ms with a subtle saved state.
- Checkboxes have a 48px hit area around a 20px visual box.
- Progress changes announce via `aria-live="polite"`.
- Where a week has no resource for a section, render the `GapCard` in its place.

- [ ] **Step 4: Verify**

Run: `npm run test -- TaskList`
Expected: 2 passing.

Run: `npm run dev`, walk `/week/1` through `/week/16`.
Expected: no empty Watch/Read/Do section anywhere; weeks 3 and 8 show the heavy chip; weeks 13–16 show gap cards; every assignment lists ≥2 checks; ticking a box and reloading preserves it.

- [ ] **Step 5: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 11: /week/:n` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: week page, resource cards, gap cards, and notes"
```

The journal entry ships in this commit.

---

### Task 12: Library search and filter logic

**Files:**
- Create: `src/lib/search.ts`, `src/lib/search.test.ts`

**Interfaces:**

```ts
export type StatusFlag = "clean" | "gray-area" | "benchmark" | "experimental" | "email-gated";
export type Facets = {
  type: string[]; topic: string[]; week: number[];
  level: string[]; cost: string[]; language: string[]; status: StatusFlag[];
};
export const emptyFacets: Facets;
export function statusOf(r: Resource): StatusFlag[];
export function filterResources(all: Resource[], facets: Facets): Resource[];
export function createIndex(all: Resource[]): Fuse<Resource>;
export function searchResources(index: Fuse<Resource>, all: Resource[], query: string, facets: Facets): Resource[];
export function facetOptions(all: Resource[]): Record<keyof Facets, (string | number)[]>;
```

Semantics, relied on by Task 13: OR within a facet, AND across facets, empty array means no constraint, empty query means "all, filtered". `facetOptions` returns the **full** option set including values with zero matches, so the language gap stays visible (F16).

- [ ] **Step 1: Write the failing tests**

`src/lib/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createIndex, emptyFacets, facetOptions, filterResources, searchResources, statusOf } from "@/lib/search";
import type { Resource } from "@/lib/types";

const r = (over: Partial<Resource>): Resource => ({
  id: "x", title: "Thing", url: "https://e.com", type: "article", topics: ["editing"],
  weeks: [9], level: "beginner", cost: "free", language: "en", why: "reason",
  verified: "2026-10-21", ...over,
});

const all = [
  r({ id: "a", title: "Blocking and Staging", type: "article", topics: ["directing"], weeks: [5], language: "en" }),
  r({ id: "b", title: "Cursa Screenwriting Hindi", type: "course", topics: ["writing"], weeks: [1], language: "hi" }),
  r({ id: "c", title: "ShotDeck", type: "tool", cost: "paid", benchmarkOnly: true, weeks: [7] }),
  r({ id: "d", title: "ArtCraft", type: "tool", experimental: true, weeks: [11] }),
  r({ id: "e", title: "Actor Release Form", type: "template", emailGated: true, weeks: [3] }),
];

describe("statusOf", () => {
  it("reports clean when no flag is set", () => expect(statusOf(all[0])).toEqual(["clean"]));
  it("reports every flag that is set", () => {
    expect(statusOf(all[2])).toContain("benchmark");
    expect(statusOf(all[3])).toContain("experimental");
    expect(statusOf(all[4])).toContain("email-gated");
  });
});

describe("filterResources", () => {
  it("returns everything for empty facets", () => {
    expect(filterResources(all, emptyFacets)).toHaveLength(5);
  });

  it("ORs within a facet", () => {
    expect(filterResources(all, { ...emptyFacets, type: ["tool", "course"] })).toHaveLength(3);
  });

  it("ANDs across facets", () => {
    expect(filterResources(all, { ...emptyFacets, type: ["tool"], cost: ["paid"] })).toHaveLength(1);
  });

  it("filters by week membership", () => {
    expect(filterResources(all, { ...emptyFacets, week: [5] }).map((x) => x.id)).toEqual(["a"]);
  });

  it("filters by language", () => {
    expect(filterResources(all, { ...emptyFacets, language: ["hi"] }).map((x) => x.id)).toEqual(["b"]);
  });

  it("returns nothing for a language with no resources", () => {
    expect(filterResources(all, { ...emptyFacets, language: ["ta"] })).toHaveLength(0);
  });

  it("filters by derived status", () => {
    expect(filterResources(all, { ...emptyFacets, status: ["experimental"] }).map((x) => x.id)).toEqual(["d"]);
  });
});

describe("searchResources", () => {
  it("finds by fuzzy title", () => {
    const hits = searchResources(createIndex(all), all, "blockng", emptyFacets);
    expect(hits[0]?.id).toBe("a");
  });

  it("intersects the query with the facets", () => {
    const hits = searchResources(createIndex(all), all, "screenwriting", { ...emptyFacets, language: ["en"] });
    expect(hits).toHaveLength(0);
  });

  it("returns the filtered set for an empty query", () => {
    expect(searchResources(createIndex(all), all, "  ", { ...emptyFacets, type: ["tool"] })).toHaveLength(2);
  });
});

describe("facetOptions", () => {
  it("keeps options with zero matches so gaps stay visible", () => {
    expect(facetOptions(all).type).toContain("template");
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm run test -- search`
Expected: FAIL — cannot resolve `@/lib/search`.

- [ ] **Step 3: Implement**

`createIndex` uses Fuse with `keys: [{ name: "title", weight: 0.5 }, { name: "why", weight: 0.3 }, { name: "topics", weight: 0.15 }, { name: "type", weight: 0.05 }]`, `threshold: 0.38`, `ignoreLocation: true`. `searchResources` filters first, then searches the filtered set, so facets always constrain the query.

- [ ] **Step 4: Verify**

Run: `npm run test -- search`
Expected: 13 passing.

- [ ] **Step 5: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 12: Library search and filter logic` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: library search index and facet filtering"
```

The journal entry ships in this commit.

---

### Task 13: `/library` UI

**Files:**
- Create: `src/routes/Library.tsx`, `src/components/library/FilterChips.tsx`, `src/components/library/FilterSheet.tsx`, `src/components/library/SearchPalette.tsx`, `src/components/library/ResultsGrid.tsx`, `src/components/library/ResultsTable.tsx`, `src/hooks/useLibraryFilters.ts`

**Interfaces:**
- Consumes: everything from Task 12 and `ResourceCard` / `GapCard` from Task 11.
- Produces: `useLibraryFilters()` returning `{ query, facets, setQuery, toggleFacet, clearAll, results, options }`, with state mirrored into the URL query string so a filtered view is linkable.

- [ ] **Step 1: Build the page**

Per `docs/prd.md` §4.5. Always-visible inline search input plus a `command` palette on `⌘K` and `/`. Facets as `toggle-group` chips at ≥768px, inside a `sheet` with an applied-count badge below it. Active filters render as removable chips above the results with "clear all". Result count in mono. Card grid at 1/2/3 columns, with a table-view toggle as the accessible alternative. Virtualize with TanStack Virtual only once rendered items exceed 200. `aria-live="polite"` on the result count.

Selecting a language facet with zero matches renders the `indian-language-craft` gap card, never "0 results" (F16).

- [ ] **Step 2: Verify**

Run: `npm run dev`, visit `/library`.
Expected: typing filters as you type; `⌘K` opens the palette; every facet combination updates the count; the URL reflects the filter state and survives a reload; selecting Tamil shows the gap card.

Measure in devtools: apply four facets at once and record the interaction.
Expected: under 100ms from input to paint (F6). If it exceeds that, memoize the filter with `useMemo` keyed on the facets before changing anything else.

- [ ] **Step 3: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 13: /library UI` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: library page with faceted filtering and fuzzy search"
```

The journal entry ships in this commit.

---

### Task 14: Dashboard, landing, capstone, toolkit, about

**Files:**
- Create: `src/routes/Dashboard.tsx`, `src/routes/Landing.tsx`, `src/routes/Capstone.tsx`, `src/routes/Toolkit.tsx`, `src/routes/About.tsx`, `src/components/dashboard/StartDateControl.tsx`, `src/components/dashboard/NextTasks.tsx`, `src/components/capstone/StageList.tsx`
- Create: `src/routes/Dashboard.test.tsx`
- Modify: `src/lib/week.ts` (add `nextIncompleteTasks`)

**Interfaces:**
- Consumes: `useProgress`, `useCurrentWeek`, `FilmstripRail`, `content`.
- Produces: `nextIncompleteTasks(week: Week, progress: Progress, limit: number): Task[]`, exported from `src/lib/week.ts`.

- [ ] **Step 1: Write the failing dual-state test**

`src/routes/Dashboard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { STORAGE_KEY, emptyProgress } from "@/lib/progress";
import { Home } from "@/routes/Dashboard";

describe("dual-state home", () => {
  beforeEach(() => localStorage.clear());

  it("shows the landing when no start date is stored", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.queryByText(/next up/i)).toBeNull();
  });

  it("shows the dashboard once a start date exists", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress, startDate: "2026-10-22" }));
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText(/WK 0?1 \/ 16/)).toBeTruthy();
  });
});
```

`Home` is the single exported component that branches between `Landing` and `Dashboard`.

- [ ] **Step 2: Run and watch it fail**

Run: `npm run test -- Dashboard`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

- **`Home`** branches on `progress.startDate`. Both branches mount under `/`.
- **`Landing`** per `docs/prd.md` §4.1, with the canvas slot left as a static poster for now — Task 16 fills it.
- **`Dashboard`** per §4.2: current-week card, next three incomplete tasks, filmstrip progress with `7 / 16 weeks · 41 / 96 tasks` in mono, capstone stage, and the start-date control with the manual week override. Changing the start date must never clear completion state — assert this by hand before committing.
- **`Capstone`** per §4.7: eight stages as a vertical filmstrip, each with its week range and criteria. Leave the ceremony hook as a no-op callback for Task 16.
- **`Toolkit`** per §4.8, carrying the Resolve free-edition limits and the ArtCraft caveat inline.
- **`About`** per §4.9, including every legal note, the consolidated open-items list, the help-wanted gaps, and the "see the intro again" link.

Past week 16, the dashboard switches to the curriculum-complete state pointing at `/capstone` and the feedback communities.

- [ ] **Step 4: Verify**

Run: `npm run test -- Dashboard`
Expected: 2 passing.

By hand: clear storage, land on `/`, set a start date, confirm it lands on `/week/1`, reload `/` and confirm the dashboard renders instead of the landing. Tick several tasks, change the start date, and confirm the ticks survive.

- [ ] **Step 5: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 14: Dashboard, landing, capstone, toolkit, about` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: dual-state home, capstone tracker, toolkit and about"
```

The journal entry ships in this commit.

---

### Task 15: Static atmosphere

**Files:**
- Create: `src/components/atmosphere/GrainSurface.tsx`, `src/components/atmosphere/Letterbox.tsx`, `src/components/atmosphere/atmosphere.css`
- Modify: the week header, plan module cards, and landing hero to wrap in these

**Interfaces:**

```ts
export function GrainSurface(props: { children: React.ReactNode; className?: string }): JSX.Element;
export function Letterbox(props: { children: React.ReactNode; ratio?: "2.39" | "1.85" }): JSX.Element;
```

- [ ] **Step 1: Implement**

`GrainSurface` applies the `.grain` class from Task 2 and renders children in the `z-index: 2` layer. `Letterbox` applies `aspect-ratio: 2.39/1` with `--bg-inset` bars and the `--vignette` gradient. Add the bleach-bypass image filter and the slate rule as utilities in `atmosphere.css`, per `design-system.md` §6.

- [ ] **Step 2: Apply to the approved surfaces only**

Landing hero, letterboxed image containers, week header panel, capstone ceremony surface, and plan module cards. **Not** library resource cards, tables, forms, or anything inside `--container-prose` (`design-system.md` §5.3).

- [ ] **Step 3: Verify**

Inspect the week header in devtools.
Expected: the grain pseudo-element sits at `z-index: 1`, all text at `z-index: 2`; `background-size` is `128px 128px`; `pointer-events: none`.

Switch to light mode.
Expected: `--grain-opacity` computes to `0` and no noise is visible.

Zoom to 200% and check a 3× DPR emulation.
Expected: the grain tile stays visually consistent — no moiré, not invisible.

- [ ] **Step 4: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 15: Static atmosphere` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: static grain, letterbox and vignette atmosphere"
```

The journal entry ships in this commit.

---

### Task 16: Vendored canvas layer and guards

**Files:**
- Create: `src/vendor/threeui/LICENSE`, `src/vendor/threeui/SOURCE.md`, and the vendored component files
- Create: `src/lib/webgl-guard.ts`, `src/lib/webgl-guard.test.ts`, `src/hooks/useFpsGuard.ts`, `src/components/atmosphere/HeroCanvas.tsx`, `src/components/atmosphere/CeremonyBadge.tsx`
- Create: `public/posters/hero-crt.webp`
- Modify: `src/routes/Landing.tsx`, `src/routes/Capstone.tsx`, `src/routes/About.tsx`

**Interfaces:**

```ts
export function acquireWebglSlot(name: string): boolean;
export function releaseWebglSlot(name: string): void;
export function shouldRenderCanvas(env: CanvasEnv): boolean;
export type CanvasEnv = {
  reducedMotion: boolean; width: number;
  cores?: number; memory?: number; saveData?: boolean;
};
export function useFpsGuard(enabled: boolean): boolean;  // false once sustained fps < 30
```

- [ ] **Step 1: Vendor the source**

Copy from `MengTo/threeui` at `main` into `src/vendor/threeui/`:

```bash
mkdir -p src/vendor/threeui/{crt,lumen-cta,spark-badge,article-headings}
BASE=https://raw.githubusercontent.com/MengTo/threeui/main
for f in crt/CrtBackground.tsx crt/crtRenderer.ts crt/crtShaders.ts crt/crtScreens.ts \
         lumen-cta/LumenCta.tsx lumen-cta/lumen-cta.css \
         spark-badge/SparkBadge.tsx \
         article-headings/articleHeadingDecode.ts; do
  curl -fsSL "$BASE/src/shaders/$f" -o "src/vendor/threeui/$f"
done
curl -fsSL "$BASE/LICENSE" -o src/vendor/threeui/LICENSE
```

Write `src/vendor/threeui/SOURCE.md` recording the upstream repo, the exact commit SHA copied from, the date, the MIT license, and a line stating these files are unmodified and must not be edited — restyle through props and tokens only.

Verify none of them import `three`:

```bash
grep -rn "from \"three" src/vendor/threeui || echo "clean: no three imports"
```
Expected: `clean: no three imports`.

- [ ] **Step 2: Write the failing guard tests**

`src/lib/webgl-guard.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { acquireWebglSlot, releaseWebglSlot, shouldRenderCanvas } from "@/lib/webgl-guard";

const env = { reducedMotion: false, width: 1440, cores: 8, memory: 8, saveData: false };

describe("single-surface lock", () => {
  beforeEach(() => releaseWebglSlot("hero"));

  it("grants the first claim and refuses the second", () => {
    expect(acquireWebglSlot("hero")).toBe(true);
    expect(acquireWebglSlot("ceremony")).toBe(false);
  });

  it("grants again after release", () => {
    acquireWebglSlot("hero");
    releaseWebglSlot("hero");
    expect(acquireWebglSlot("ceremony")).toBe(true);
    releaseWebglSlot("ceremony");
  });
});

describe("shouldRenderCanvas", () => {
  it("allows a capable desktop", () => expect(shouldRenderCanvas(env)).toBe(true));
  it("refuses reduced motion", () => expect(shouldRenderCanvas({ ...env, reducedMotion: true })).toBe(false));
  it("refuses narrow viewports", () => expect(shouldRenderCanvas({ ...env, width: 480 })).toBe(false));
  it("refuses low core counts", () => expect(shouldRenderCanvas({ ...env, cores: 4 })).toBe(false));
  it("refuses low memory", () => expect(shouldRenderCanvas({ ...env, memory: 4 })).toBe(false));
  it("refuses save-data", () => expect(shouldRenderCanvas({ ...env, saveData: true })).toBe(false));
  it("allows when optional hints are absent", () => {
    expect(shouldRenderCanvas({ reducedMotion: false, width: 1440 })).toBe(true);
  });
});
```

- [ ] **Step 3: Run and watch it fail**

Run: `npm run test -- webgl-guard`
Expected: FAIL — cannot resolve `@/lib/webgl-guard`.

- [ ] **Step 4: Implement the guards**

Module-level `let holder: string | null`. `acquireWebglSlot` returns false when `holder` is set to a different name, and logs a dev-only warning. `shouldRenderCanvas` refuses on any of: `reducedMotion`, `width < 768`, `cores <= 4`, `memory <= 4`, `saveData`. Absent optional hints are treated as capable.

`useFpsGuard` samples `requestAnimationFrame` deltas for 2000ms and returns `false` once the mean falls below 30fps.

- [ ] **Step 5: Verify**

Run: `npm run test -- webgl-guard`
Expected: 9 passing.

- [ ] **Step 6: Build `HeroCanvas`**

```tsx
const CrtBackground = lazy(() => import("@/vendor/threeui/crt/CrtBackground"));
```

Behaviour, all required by `design-system.md` §7.2:
- Render `<img src="/posters/hero-crt.webp">` immediately so LCP never waits on the canvas.
- Mount the canvas only when `shouldRenderCanvas` passes **and** `acquireWebglSlot("hero")` returns true; release on unmount.
- Wrap the mount in an error boundary — `crtRenderer` **throws** `"CRT requires WebGL"` rather than returning null.
- Listen for `webglcontextlost` and unmount to the poster.
- Pause the loop via `IntersectionObserver` when off-screen and on `visibilitychange`; a paused loop must not call `requestAnimationFrame`.
- Unmount to the poster when `useFpsGuard` returns false.
- Fade the canvas in over `--dur-slow` once mounted.
- `aria-hidden="true"` on the canvas and the poster.

Capture the poster by screenshotting the mounted canvas at 1440×900 and exporting WebP at quality 80.

- [ ] **Step 7: Wire the remaining three**

`LumenCta` on the landing primary action only. `CeremonyBadge` wrapping `SparkBadge`, fired once when the final capstone stage flips to `done`, guarded by `progress.ceremonySeen` so it never repeats. `articleHeadingDecode` on the `/about` heading and the landing H1, rendering the final string immediately under reduced motion.

- [ ] **Step 8: Verify the quarantine**

```bash
npm run build
grep -rl "crtRenderer\|CRT_FRAGMENT" dist/assets/*.js
```
Expected: matches only in the `atmosphere-*.js` chunk, never in the main entry chunk.

```bash
grep -rn "three" package.json
```
Expected: no dependency match.

In devtools, open `/library` with the Network tab filtered to JS.
Expected: no `atmosphere-*.js` request. Repeat for `/plan`, `/week/7`, `/toolkit`, `/capstone`.

Emulate a mid-tier mobile and reload `/` with storage cleared.
Expected: the poster renders and no canvas mounts.

- [ ] **Step 9: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 16: Vendored canvas layer and guards` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

```bash
git add -A
git commit -m "feat: vendored canvas atmosphere with device and fps guards"
```

The journal entry ships in this commit.

---

### Task 17: Hardening and release gates

**Files:**
- Create: `scripts/assert-bundle.ts`, `scripts/check-links.ts`, `.github/workflows/link-check.yml`, `e2e/smoke.spec.ts`, `vercel.json`, `src/components/ExportImport.tsx`, `public/sw.js`
- Modify: `src/components/nav/MoreSheet.tsx`

- [ ] **Step 1: Bundle assertion**

`scripts/assert-bundle.ts` reads `dist/`, finds the main entry chunk, and exits 1 if it contains `crtRenderer`, `CRT_FRAGMENT`, or any `three` import, or if the gzipped entry graph exceeds **160KB**. Print the measured size either way so regressions are visible in CI logs.

- [ ] **Step 2: Export/import UI**

`ExportImport.tsx` in the More sheet and on `/about`. Export downloads `frame-by-frame-progress.json` via a Blob. Import reads the file, calls `importProgress`, and on failure shows the returned `reason` in a `sonner` toast without touching existing state.

Verify by hand: tick several tasks, write a note, export, clear storage, import, and confirm the state is identical.

- [ ] **Step 3: Link checker**

`scripts/check-links.ts` walks `content.resources`, issues `HEAD` (falling back to `GET` on 405) with a 10s timeout and a 4-wide concurrency limit, and reports non-2xx/3xx results as `week N · resource-id · url · status`. Skip any resource whose `url` is a bare site root with a search term in `why`. Exit 1 on real failures.

`.github/workflows/link-check.yml` runs it weekly on a cron and on manual dispatch, and opens an issue on failure rather than blocking merges — link rot is upstream, not a code defect.

- [ ] **Step 4: Playwright smoke test**

`e2e/smoke.spec.ts` covers the one path that must never break: land on `/` with clean storage, set a start date, arrive at `/week/1`, tick the first task, reload, confirm it is still ticked, navigate to `/library`, search, apply a filter, and confirm the count changes.

Run: `npx playwright install chromium && npm run e2e`
Expected: 1 passing spec.

- [ ] **Step 5: Vercel config**

`vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

- [ ] **Step 6: Service worker (P2)**

`public/sw.js` with a cache-first strategy for the app shell and visited week pages, registered only in production. Ship this last and drop it from v1 if anything else is at risk — F13 is P2.

- [ ] **Step 7: Final gate**

Run the full suite:

```bash
npm run validate && npm run test && npm run build && npm run e2e
```
Expected: all green, and `assert-bundle` prints an entry size at or under 160KB gzipped.

Run Lighthouse mobile on `/`, `/plan`, `/week/7`, and `/library`.
Expected: ≥90 performance and ≥95 accessibility on every one; LCP under 2.0s on throttled 4G for the learning routes.

Final manual audit against `docs/design-system.md` §8 and the pre-delivery checklist: contrast in both themes, focus visible everywhere, no emoji, no scale-on-hover, no horizontal scroll at 360px, grain off in light mode, `--accent-warm` nowhere except progress and completion.

- [ ] **Step 8: Journal, then commit**

Append one entry to `docs/implementation-journal.md` before this commit. Re-read the file, then add a heading `### Task 17: Hardening and release gates` at the end of `## Entries`. Follow the template in that file. Do not edit any other task's entry. A bullet starting with `**Decision:**` is required even when the choice was to follow the plan.

In **Left open**, list any heading from the journal's required-entries list that is still missing. If all 17 are present, write `none`.

```bash
git add -A
git commit -m "chore: bundle assertions, link checking, e2e smoke, and deploy config"
```

The journal entry ships in this commit.

---

## Deferred to post-v1

Agreed with the user: revisit after v1 ships rather than blocking on it.

- Light mode polish beyond correctness (F12 is P1; dark ships first)
- Service worker offline reading (F13, P2)
- Swapping the hero from `crt` to `condensation` if the retro read is wrong
- Virtualization, if the library stays under 200 rendered items in practice
- Closing the five human-check open items in `docs/prd.md` §11 before the public launch
