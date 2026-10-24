import { ChevronDown, ExternalLink } from "lucide-react";
import type { JSX } from "react";
import { useParams } from "react-router-dom";
import { AssignmentCard } from "@/components/week/AssignmentCard";
import { NotesField } from "@/components/week/NotesField";
import { TaskList } from "@/components/week/TaskList";
import { WeekHeader } from "@/components/week/WeekHeader";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GapCard } from "@/components/resource/GapCard";
import { ResourceCard } from "@/components/resource/ResourceCard";
import "@/components/week/week.css";
import { content } from "@/content";
import { parseWeekParam } from "@/lib/route-week";
import type { Gap, Resource, Task } from "@/lib/types";

const MODULES: Record<number, string> = {
  1: "Writing",
  2: "Pre-production",
  3: "Directing",
  4: "Cinematography",
  5: "Editing and Sound",
  6: "Post-production and VFX",
  7: "Marketing, Distribution and Career",
};

const SELF_REVIEW = [
  "Did I hit this week's done-when checks?",
  "What's the one thing I'd redo if I had another day?",
  "Post one update (even a single sentence + a frame grab) to this week's named community.",
];

function formatCoreHours(minutes: number): string {
  if (minutes <= 0) return "0h";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function cardsFor(tasks: Task[], byId: Map<string, Resource>): { resource: Resource; minutes: number }[] {
  const seen = new Set<string>();
  const cards: { resource: Resource; minutes: number }[] = [];
  for (const task of tasks) {
    for (const id of task.resourceIds) {
      if (seen.has(id)) continue;
      const resource = byId.get(id);
      if (!resource) continue;
      seen.add(id);
      cards.push({ resource, minutes: task.minutes });
    }
  }
  return cards;
}

function norm(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

function communityParts(community: string): string[] {
  return community.split(/\s+(?:or|\/)\s+/i).map((part) => part.trim()).filter(Boolean);
}

function matchCommunity(label: string, weekN: number, resources: Resource[]): Resource | undefined {
  const key = norm(label);
  const hits = resources.filter((resource) => {
    const title = norm(resource.title);
    return title === key || title.startsWith(key);
  });
  hits.sort((a, b) => communityScore(b, weekN) - communityScore(a, weekN) || a.id.localeCompare(b.id));
  return hits[0];
}

function communityScore(resource: Resource, weekN: number): number {
  let score = 0;
  if (resource.weeks.includes(weekN)) score += 4;
  if (resource.type === "subreddit" || resource.type === "community" || resource.type === "forum") score += 2;
  if (resource.type === "platform") score += 1;
  return score;
}

function KindSection({
  kind,
  title,
  tasks,
  gaps,
  byId,
}: {
  kind: "watch" | "read" | "do";
  title: string;
  tasks: Task[];
  gaps: Gap[];
  byId: Map<string, Resource>;
}): JSX.Element {
  const cards = cardsFor(tasks, byId);
  const empty = cards.length === 0 && tasks.length === 0;

  return (
    <section className="week-section" aria-labelledby={`${kind}-heading`}>
      <h2 id={`${kind}-heading`}>{title}</h2>
      {empty ? gaps.map((gap) => <GapCard key={`${kind}-${gap.id}`} gap={gap} />) : (
        <>
          {tasks.length > 0 ? <TaskList kind={kind} tasks={tasks} /> : null}
          {cards.map((card) => (
            <ResourceCard key={card.resource.id} resource={card.resource} minutes={card.minutes} />
          ))}
        </>
      )}
    </section>
  );
}

export function Week() {
  const params = useParams();
  const n = parseWeekParam(params.n);
  const week = n === null ? undefined : content.weeks.find((item) => item.n === n);
  if (!week || n === null) {
    return (
      <article>
        <p className="eyebrow">Week</p>
        <h1>Week not found</h1>
      </article>
    );
  }

  const byId = new Map(content.resources.map((resource) => [resource.id, resource]));
  const gaps = (week.gapIds ?? [])
    .map((id) => content.gaps.find((gap) => gap.id === id))
    .filter((gap): gap is Gap => gap !== undefined);
  const watch = week.tasks.filter((task) => task.kind === "watch");
  const read = week.tasks.filter((task) => task.kind === "read");
  const doing = week.tasks.filter((task) => task.kind === "do");
  const minutes = week.tasks.reduce((sum, task) => sum + task.minutes, 0);
  const stage = content.capstone.find((item) => item.id === week.capstoneStage);
  const parts = communityParts(week.community);

  return (
    <article className="week-page">
      <WeekHeader
        week={week}
        moduleTitle={MODULES[week.module] ?? "Buffer"}
        stageLabel={stage?.label ?? null}
        hoursLabel={formatCoreHours(minutes)}
      />
      <KindSection kind="watch" title="Watch" tasks={watch} gaps={gaps} byId={byId} />
      <KindSection kind="read" title="Read" tasks={read} gaps={gaps} byId={byId} />
      <section className="week-section" aria-labelledby="do-heading">
        <h2 id="do-heading">Do</h2>
        {doing.length > 0 ? <TaskList kind="do" tasks={doing} /> : null}
        {cardsFor(doing, byId).map((card) => (
          <ResourceCard key={card.resource.id} resource={card.resource} minutes={card.minutes} />
        ))}
        <AssignmentCard assignment={week.assignment} />
      </section>
      <section className="week-section" aria-labelledby="notes-heading">
        <h2 id="notes-heading">Notes</h2>
        <NotesField key={week.assignment.id} assignmentId={week.assignment.id} />
      </section>
      {parts.length > 0 ? (
        <section className="week-section" aria-labelledby="community-heading">
          <h2 id="community-heading">Community</h2>
          {parts.map((part) => {
            const match = matchCommunity(part, week.n, content.resources);
            return match ? (
              <a
                key={part}
                className="community-link"
                href={match.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
                <ExternalLink aria-hidden="true" size={16} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            ) : (
              <p key={part} className="community-name">{part}</p>
            );
          })}
          {week.communityCaveat ? <p className="community-caveat">{week.communityCaveat}</p> : null}
        </section>
      ) : null}
      <section className="week-section" aria-labelledby="review-heading">
        <Collapsible>
          <CollapsibleTrigger className="self-review-trigger" id="review-heading">
            Self-review
            <ChevronDown aria-hidden="true" size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul>
              {SELF_REVIEW.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </article>
  );
}
