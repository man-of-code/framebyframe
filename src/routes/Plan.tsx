import { useOutletContext } from "react-router-dom";
import { FilmstripRail } from "@/components/filmstrip/FilmstripRail";
import { ModuleGroup } from "@/components/plan/ModuleGroup";
import "@/components/plan/plan.css";
import { MODULES } from "@/content/modules";
import { weeks } from "@/content/weeks";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import type { ShellOutletContext } from "@/routes/Root";

const BUFFER_REASON =
  "No mentors, no supplied footage, and thin brochure coverage in sound and VFX.";

export function Plan() {
  const { progress } = useOutletContext<ShellOutletContext>();
  const { week } = useCurrentWeek(progress);

  return (
    <article className="plan">
      <header className="plan-intro">
        <p className="eyebrow">16 weeks</p>
        <h1>The plan</h1>
      </header>
      <div className="plan-rail">
        <FilmstripRail orientation="horizontal" compact progress={progress} />
      </div>
      {MODULES.map((module) => (
        <ModuleGroup
          key={module.n}
          eyebrow={`Module ${String(module.n).padStart(2, "0")}`}
          title={module.title}
          weeks={weeks.filter((item) => item.module === module.n)}
          current={week}
          progress={progress}
        />
      ))}
      <ModuleGroup
        eyebrow="Weeks 13–16"
        title="Buffer"
        note={BUFFER_REASON}
        spliced
        weeks={weeks.filter((item) => item.extension)}
        current={week}
        progress={progress}
      />
    </article>
  );
}
