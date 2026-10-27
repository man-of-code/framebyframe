import { TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StartDateControl } from "@/components/dashboard/StartDateControl";
import { NextTasks } from "@/components/dashboard/NextTasks";
import { Button, ButtonSheen } from "@/components/ui/button";
import { FilmstripRail } from "@/components/filmstrip/FilmstripRail";
import { content } from "@/content";
import { BUFFER_TITLE, MODULES } from "@/content/modules";
import { WithProgress, type ProgressApi } from "@/hooks/ProgressProvider";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { countDone } from "@/lib/progress";
import type { Progress, Week } from "@/lib/types";
import { formatHours, nextIncompleteTasks, TOTAL_WEEKS, weekCompletion, weekMinutes } from "@/lib/week";
import { Landing } from "@/routes/Landing";
import "./pages.css";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function totals(progress: Progress): { weeksDone: number; tasksDone: number; tasksTotal: number } {
  let weeksDone = 0;
  let tasksDone = 0;
  let tasksTotal = 0;
  for (const week of content.weeks) {
    if (weekCompletion(week, progress).complete) weeksDone += 1;
    tasksTotal += week.tasks.length;
    tasksDone += countDone(progress, week.tasks.map((task) => task.id));
  }
  return { weeksDone, tasksDone, tasksTotal };
}

function feedbackPlaces(): { label: string; url?: string }[] {
  const seen = new Set<string>();
  const places: { label: string; url?: string }[] = [];
  for (const week of content.weeks) {
    const parts = week.community.split(/\s+(?:or|\/)\s+/i).map((part) => part.trim()).filter(Boolean);
    for (const label of parts) {
      const key = label.toLowerCase();
      if (seen.has(key) || label.split(/\s+/).length > 4) continue;
      seen.add(key);
      const match = content.resources.find((resource) => resource.title.toLowerCase() === key);
      places.push({ label, url: match?.url });
    }
  }
  return places;
}

export function Home(): JSX.Element {
  const [params] = useSearchParams();
  const replay = params.get("intro") === "1";
  return (
    <WithProgress>
      {(api) => (
        !api.progress.startDate || replay
          ? <Landing api={api} replay={Boolean(api.progress.startDate)} />
          : <Dashboard api={api} />
      )}
    </WithProgress>
  );
}

function Dashboard({ api }: { api: ProgressApi }): JSX.Element {
  const current = useCurrentWeek(api.progress);
  const week = content.weeks.find((item) => item.n === current.week);
  const counts = totals(api.progress);
  const stages = [...content.capstone].sort((a, b) => a.order - b.order);
  const active = stages.find((stage) => api.progress.capstone[stage.id] !== "done") ?? stages[stages.length - 1];
  const showWeek = week !== undefined && (!current.complete || current.source === "override");

  return (
    <article className="page">
      {current.complete ? (
        <section className="stack" aria-labelledby="complete-heading">
          <p className="eyebrow">Past week 16</p>
          <h1 id="complete-heading">Curriculum complete</h1>
          <p className="page-copy">
            The calendar is past the sixteen weeks. What is left is the capstone, and a place to get feedback.
          </p>
          <Button asChild className="self-start">
            <Link to="/capstone" data-page-cta><ButtonSheen />Open the capstone</Link>
          </Button>
          <h2>Feedback communities</h2>
          <ul className="link-list">
            {feedbackPlaces().map((place) => (
              <li key={place.label}>
                {place.url ? (
                  <a className="text-link" href={place.url} target="_blank" rel="noopener noreferrer">
                    {place.label}
                  </a>
                ) : (
                  <p className="page-copy">{place.label}</p>
                )}
              </li>
            ))}
          </ul>
          {current.source === "override" ? (
            <p className="note">You set week {current.week}, so that week stays open below.</p>
          ) : null}
        </section>
      ) : null}
      {showWeek && week ? (
        <WeekCard week={week} heading={current.complete ? "h2" : "h1"} />
      ) : null}
      {showWeek && week ? (
        <NextTasks tasks={nextIncompleteTasks(week, api.progress, 3)} api={api} />
      ) : null}
      <section className="stack" aria-labelledby="progress-heading">
        <h2 id="progress-heading">Progress</h2>
        <p className="mono">
          {counts.weeksDone} / {TOTAL_WEEKS} weeks · {counts.tasksDone} / {counts.tasksTotal} tasks
        </p>
        <div className="dash-rail">
          <FilmstripRail orientation="horizontal" compact progress={api.progress} />
        </div>
      </section>
      {active ? (
        <section className="stack" aria-labelledby="capstone-heading">
          <h2 id="capstone-heading">Capstone</h2>
          <p className="page-copy">
            Stage {active.order} of {stages.length} · {active.label}
          </p>
          <Link className="text-link" to="/capstone">Open the capstone</Link>
        </section>
      ) : null}
      <StartDateControl
        progress={api.progress}
        now={new Date()}
        onStartDate={api.setStartDate}
        onWeekOverride={api.setWeekOverride}
      />
    </article>
  );
}

function WeekCard(props: { week: Week; heading: "h1" | "h2" }): JSX.Element {
  const { week, heading: Heading } = props;
  const moduleTitle = MODULES.find((item) => item.n === week.module)?.title ?? BUFFER_TITLE;
  const moduleBit = week.module > 0
    ? `Module ${pad(week.module)} · ${moduleTitle}`
    : BUFFER_TITLE;

  return (
    <section className="dash-card" aria-labelledby="current-week-heading">
      <p className="eyebrow">
        <span className="week-now">WK {pad(week.n)} / {pad(TOTAL_WEEKS)}</span>
        {` · ${moduleBit}`}
      </p>
      <Heading id="current-week-heading">{week.title}</Heading>
      <p className="mono">~{formatHours(weekMinutes(week))}</p>
      {week.heavy ? (
        <p className="heavy-chip">
          <TriangleAlert aria-hidden="true" size={16} />
          Heavy week
        </p>
      ) : null}
      <Button asChild>
        <Link to={`/week/${week.n}`} data-page-cta><ButtonSheen />Open this week</Link>
      </Button>
    </section>
  );
}
