import type { CapstoneStage } from "@/lib/types";
import { weeks } from "./weeks";

const criteria = (...ns: number[]): string[] =>
  ns.flatMap((n) => weeks.find((week) => week.n === n)!.assignment.checks);

export const capstone: CapstoneStage[] = [
  { id: "premise", label: "Premise", order: 1, weeks: [1], criteria: criteria(1) },
  { id: "script", label: "Script", order: 2, weeks: [2], criteria: criteria(2) },
  { id: "shot-list", label: "Shot list", order: 3, weeks: [3, 5, 6], criteria: criteria(3, 5, 6) },
  { id: "shoot", label: "Shoot", order: 4, weeks: [7, 8, 13], criteria: criteria(7, 8, 13) },
  { id: "rough-cut", label: "Rough cut", order: 5, weeks: [9], criteria: criteria(9) },
  { id: "sound", label: "Sound", order: 6, weeks: [10, 14], criteria: criteria(10, 14) },
  { id: "final-cut", label: "Final cut", order: 7, weeks: [11, 15], criteria: criteria(11, 15) },
  { id: "submissions", label: "Submissions", order: 8, weeks: [12, 16], criteria: criteria(12, 16) },
];
