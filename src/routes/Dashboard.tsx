import { TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BreakableTitle } from "@/components/BreakableTitle";
import { StartDateControl } from "@/components/dashboard/StartDateControl";
import { NextTasks } from "@/components/dashboard/NextTasks";
import { WorkingHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonSheen } from "@/components/ui/button";
import { FilmstripRail } from "@/components/filmstrip/FilmstripRail";
import { content } from "@/content";
import { BUFFER_TITLE, MODULES } from "@/content/modules";
import { WithProgress, type ProgressApi } from "@/hooks/ProgressProvider";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { countDone } from "@/lib/progress";
import { toRoman } from "@/lib/title";
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
    <article className="page dashboard">
      {current.complete ? (
        <WorkingHeader
          eyebrow="Past week 16"
          title="Course complete"
          note="The calendar is past the sixteen weeks. What is left is the capstone, and a place to get feedback."
        />
      ) : (
        <WorkingHeader eyebrow="Dashboard" title="Today's programme" />
      )}
      {current.complete ? (
        <section className="stack" aria-labelledby="feedback-heading">
          <Button asChild className="self-start">
            <Link to="/capstone" data-page-cta><ButtonSheen />Open the capstone</Link>
          </Button>
          <h2 id="feedback-heading">Feedback communities</h2>
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
        <div className="dash-now">
          {/* One primary per page: once the capstone owns it, the week card's action is secondary. */}
          <WeekCard week={week} primary={!current.complete} />
          <NextTasks tasks={nextIncompleteTasks(week, api.progress, 3)} api={api} />
        </div>
      ) : null}
      <section className="stack" aria-labelledby="progress-heading">
        <h2 id="progress-heading">Progress</h2>
        <p className="hud-frame hud-readout dash-progress">
          <strong>{counts.weeksDone}</strong> / {TOTAL_WEEKS} weeks · <strong>{counts.tasksDone}</strong> / {counts.tasksTotal} tasks
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

/** The current week as a "now showing" poster (design-system.md 5.2, 6): halftone offset shadow, the brass
    week numeral at h1 size in a HUD frame, and one action. */
function WeekCard(props: { week: Week; primary: boolean }): JSX.Element {
  const { week, primary } = props;
  const moduleTitle = MODULES.find((item) => item.n === week.module)?.title ?? BUFFER_TITLE;
  const moduleBit = week.module > 0
    ? `Module ${toRoman(week.module)} · ${moduleTitle}`
    : BUFFER_TITLE;

  return (
    <section className="now-showing" aria-labelledby="current-week-heading">
      <div className="now-showing__shadow halftone" aria-hidden="true" />
      <div className="now-showing__card">
        <p className="eyebrow">Now showing · {moduleBit}</p>
        <p className="hud-frame hud-readout now-showing__numeral">
          WK <span className="hud-current">{pad(week.n)}</span> / {pad(TOTAL_WEEKS)}
        </p>
        <h2 id="current-week-heading"><BreakableTitle text={week.title} /></h2>
        <div className="now-showing__meta">
          <p className="hud-readout">~{formatHours(weekMinutes(week))}</p>
          {week.heavy ? (
            <Badge variant="warn">
              <TriangleAlert aria-hidden="true" />
              Heavy
            </Badge>
          ) : null}
        </div>
        <Button asChild variant={primary ? "default" : "outline"}>
          <Link to={`/week/${week.n}`} data-page-cta={primary ? "" : undefined}>
            {primary ? <ButtonSheen /> : null}
            Open this week
          </Link>
        </Button>
      </div>
    </section>
  );
}
