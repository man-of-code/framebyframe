import { lazy, Suspense, useCallback, useState, type JSX } from "react";
import "@/components/filmstrip/filmstrip.css";
import { PlaybillHeader } from "@/components/PageHeader";
import { StageList } from "@/components/capstone/StageList";
import { capstone } from "@/content/capstone";
import { WithProgress } from "@/hooks/ProgressProvider";
import { openCeremonyWhenLoaded } from "@/lib/ceremony";
import "./pages.css";

// A live surface (design-system.md 7.2 rule 1): loaded only when the ceremony opens.
const loadCeremony = () => import("@/components/atmosphere/CeremonyBadge");
const CeremonyBadge = lazy(() => loadCeremony().then((mod) => ({ default: mod.CeremonyBadge })));

function ceremonyFailed() {
  // sonner is already loaded by the deferred chrome; importing it here keeps it out of this route's static graph.
  void import("sonner").then(({ toast }) => {
    toast.error("The capstone ceremony could not load. Reload the page to see it.");
  });
}

export function Capstone(): JSX.Element {
  const stages = [...capstone].sort((a, b) => a.order - b.order);
  const [ceremony, setCeremony] = useState(false);
  const closeCeremony = useCallback(() => setCeremony(false), []);

  return (
    <WithProgress>
      {(api) => (
        <article className="page prose-page prose-centered">
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
              if (api.progress.ceremonySeen) return;
              void openCeremonyWhenLoaded({
                load: loadCeremony,
                see: api.seeCeremony,
                open: () => setCeremony(true),
                fail: ceremonyFailed,
              });
            }}
          />
          {ceremony ? (
            <Suspense fallback={null}>
              <CeremonyBadge open onClose={closeCeremony} />
            </Suspense>
          ) : null}
        </article>
      )}
    </WithProgress>
  );
}
