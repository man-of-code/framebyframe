import type { JSX } from "react";
import { clampWeek, rawWeekNumber, resolveCurrentWeek, TOTAL_WEEKS } from "@/lib/week";
import type { Progress } from "@/lib/types";

export function StartDateControl(props: {
  progress: Progress;
  now: Date;
  onStartDate: (startDate: string) => void;
  onWeekOverride: (week: number | undefined) => void;
}): JSX.Element {
  const { progress, now, onStartDate, onWeekOverride } = props;
  const resolved = resolveCurrentWeek(progress, now);
  const raw = progress.startDate ? rawWeekNumber(progress.startDate, now) : null;
  const calendarWeek = raw === null ? resolved.week : clampWeek(raw);

  return (
    <section className="stack" aria-labelledby="start-date-heading">
      <h2 id="start-date-heading">Start date</h2>
      <label className="field">
        Start date
        <input
          type="date"
          value={progress.startDate ?? ""}
          onChange={(event) => {
            if (event.target.value) onStartDate(event.target.value);
          }}
        />
      </label>
      <label className="field">
        I'm actually on week
        <select
          value={progress.weekOverride ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            onWeekOverride(value === "" ? undefined : Number(value));
          }}
        >
          <option value="">The calendar week</option>
          {Array.from({ length: TOTAL_WEEKS }, (_, index) => index + 1).map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </label>
      {raw !== null && raw < 1 ? (
        <p className="note">That date is still ahead. This stays week 1 until it arrives.</p>
      ) : null}
      {resolved.source === "override" ? (
        <p className="note">
          Showing week {resolved.week} because you set it. The calendar says week {calendarWeek}.
        </p>
      ) : null}
    </section>
  );
}
