import type { JSX } from "react";
import "@/components/filmstrip/filmstrip.css";
import { StageList } from "@/components/capstone/StageList";
import { content } from "@/content";
import { WithProgress } from "@/hooks/ProgressProvider";
import "./pages.css";

export function Capstone(): JSX.Element {
  const stages = [...content.capstone].sort((a, b) => a.order - b.order);

  return (
    <WithProgress>
      {(api) => (
        <article className="page prose-page">
          <header className="stack">
            <p className="eyebrow">Capstone</p>
            <h1>Eight stages</h1>
            <p className="page-copy">
              Premise through submissions. Each stage lists the weeks it covers and the done-when checks from those weeks.
            </p>
          </header>
          <StageList
            stages={stages}
            capstone={api.progress.capstone}
            onStage={api.stage}
            onCeremony={() => {}}
          />
        </article>
      )}
    </WithProgress>
  );
}
