import { useCallback, useState, type JSX } from "react";
import "@/components/filmstrip/filmstrip.css";
import { CeremonyBadge } from "@/components/atmosphere/CeremonyBadge";
import { PlaybillHeader } from "@/components/PageHeader";
import { StageList } from "@/components/capstone/StageList";
import { capstone } from "@/content/capstone";
import { WithProgress } from "@/hooks/ProgressProvider";
import "./pages.css";

export function Capstone(): JSX.Element {
  const stages = [...capstone].sort((a, b) => a.order - b.order);
  const [ceremony, setCeremony] = useState(false);
  const closeCeremony = useCallback(() => setCeremony(false), []);

  return (
    <WithProgress>
      {(api) => (
        <article className="page prose-page">
          <PlaybillHeader
            eyebrow="Capstone"
            title="Eight stages"
            note="Premise through submissions. Each stage lists the weeks it covers and the done-when checks from those weeks."
          />
          <StageList
            stages={stages}
            capstone={api.progress.capstone}
            onStage={api.stage}
            onCeremony={() => {
              if (api.seeCeremony()) setCeremony(true);
            }}
          />
          <CeremonyBadge open={ceremony} onClose={closeCeremony} />
        </article>
      )}
    </WithProgress>
  );
}
