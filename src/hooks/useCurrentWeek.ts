import { resolveCurrentWeek } from "@/lib/week";
import type { Progress } from "@/lib/types";

export function useCurrentWeek(progress: Progress) {
  return resolveCurrentWeek(progress, new Date());
}
