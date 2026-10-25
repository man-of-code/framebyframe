import type { Facets } from "@/lib/search";

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  mr: "Marathi",
  bn: "Bengali",
};

const STATUS_LABEL: Record<string, string> = {
  clean: "Clean",
  "gray-area": "Gray area",
  benchmark: "Benchmark",
  experimental: "Experimental",
  "email-gated": "Email gated",
};

export const FACET_ORDER = ["type", "topic", "week", "level", "cost", "language", "status"] as const satisfies readonly (keyof Facets)[];

export const FACET_LABEL: Record<keyof Facets, string> = {
  type: "Type",
  topic: "Topic",
  week: "Week",
  level: "Level",
  cost: "Cost",
  language: "Language",
  status: "Status",
};

export function facetValueLabel(key: keyof Facets, value: string | number): string {
  const raw = String(value);
  if (key === "language") return LANGUAGE_LABEL[raw] ?? raw;
  if (key === "status") return STATUS_LABEL[raw] ?? raw;
  if (key === "week") return `Week ${raw}`;
  if (raw === "youtube") return "YouTube";
  if (raw === "vfx") return "VFX";
  if (key === "type") {
    return raw
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
