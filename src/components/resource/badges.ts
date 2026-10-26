import { BadgeCheck, CircleDollarSign, FlaskConical, Gauge, Mail, Star, TriangleAlert, type LucideIcon } from "lucide-react";
import type { Resource } from "@/lib/types";

/** Pop badge variants that carry a meaning (design-system.md 2.1). `outline` is the neutral level badge. */
export type BadgeTone = "ok" | "warn" | "paid" | "exp" | "outline";

export type BadgeSpec = { key: string; label: string; tone: BadgeTone; icon: LucideIcon };

const COST: Record<Resource["cost"], { label: string; tone: BadgeTone; icon: LucideIcon }> = {
  free: { label: "Free", tone: "ok", icon: BadgeCheck },
  freemium: { label: "Freemium", tone: "warn", icon: CircleDollarSign },
  paid: { label: "Paid", tone: "paid", icon: CircleDollarSign },
};

export function costBadge(cost: Resource["cost"]): BadgeSpec {
  return { key: "cost", ...COST[cost] };
}

/**
 * Free is lime, freemium / gray area / email-gated are yellow, paid / benchmark are magenta,
 * experimental is violet, and level stays a neutral outline. Every badge pairs an icon with a word.
 */
export function resourceBadges(resource: Resource): BadgeSpec[] {
  const level = resource.level.charAt(0).toUpperCase() + resource.level.slice(1);
  const badges: BadgeSpec[] = [costBadge(resource.cost), { key: "level", label: level, tone: "outline", icon: Gauge }];
  if (resource.grayArea) badges.push({ key: "gray", label: "Gray area", tone: "warn", icon: TriangleAlert });
  if (resource.benchmarkOnly) badges.push({ key: "benchmark", label: "Benchmark", tone: "paid", icon: Star });
  if (resource.experimental) badges.push({ key: "experimental", label: "Experimental", tone: "exp", icon: FlaskConical });
  if (resource.emailGated) badges.push({ key: "email", label: "Email required", tone: "warn", icon: Mail });
  return badges;
}
