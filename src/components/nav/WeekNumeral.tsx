import { TOTAL_WEEKS } from "@/lib/week";

export function WeekNumeral({ week }: { week: number }) {
  const current = String(week).padStart(2, "0");
  const total = String(TOTAL_WEEKS).padStart(2, "0");
  return (
    <p className="week-num" aria-label={`Week ${week} of ${TOTAL_WEEKS}`}>
      WK <span className="week-num-current">{current}</span> / {total}
    </p>
  );
}
