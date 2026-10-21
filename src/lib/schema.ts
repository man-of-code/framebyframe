import { z } from "zod";
import type { Content } from "@/lib/types";

export type ValidationIssue = { kind: string; where: string; message: string };

export const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  type: z.enum([
    "youtube",
    "repo",
    "subreddit",
    "article",
    "course",
    "book",
    "tool",
    "short-film",
    "podcast",
    "forum",
    "template",
    "festival",
    "community",
    "service",
    "platform",
    "grant",
    "docs",
    "spec",
    "aggregator",
    "reading",
  ]),
  topics: z.array(z.string()),
  weeks: z.array(z.number()),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  cost: z.enum(["free", "freemium", "paid"]),
  language: z.string(),
  why: z.string(),
  verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "verified must be an ISO date"),
  grayArea: z.boolean().optional(),
  benchmarkOnly: z.boolean().optional(),
  experimental: z.boolean().optional(),
  emailGated: z.boolean().optional(),
  licenseNote: z.string().optional(),
});

export const taskSchema = z.object({
  id: z.string(),
  kind: z.enum(["watch", "read", "do"]),
  text: z.string(),
  resourceIds: z.array(z.string()),
  minutes: z.number(),
  core: z.boolean(),
});

export const gapSchema = z.object({
  id: z.string(),
  scope: z.enum(["week", "module", "global"]),
  ref: z.string(),
  missing: z.string(),
  attempted: z.array(z.string()),
  note: z.string(),
});

export const weekSchema = z.object({
  n: z.number().min(1).max(16),
  module: z.number(),
  title: z.string(),
  topics: z.array(z.string()),
  tasks: z.array(taskSchema),
  assignment: z.object({
    id: z.string(),
    brochureNo: z.number().optional(),
    text: z.string(),
    checks: z.array(z.string()),
  }),
  capstoneStage: z.string().optional(),
  extension: z.boolean().optional(),
  community: z.string(),
  communityCaveat: z.string().optional(),
  heavy: z.boolean().optional(),
  gapIds: z.array(z.string()).optional(),
});

export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.string(),
  license: z.string(),
  url: z.string(),
  firstWeek: z.number(),
  experimental: z.boolean().optional(),
  limitations: z.array(z.string()).optional(),
});

export const capstoneStageSchema = z.object({
  id: z.string(),
  label: z.string(),
  order: z.number(),
  weeks: z.array(z.number()),
  criteria: z.array(z.string()),
});

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
