import { lazy, startTransition, Suspense, useEffect, useState, type JSX } from "react";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { useHydrated } from "@/hooks/useHydrated";
import type { Resource } from "@/lib/types";
import { useMediaQuery } from "./useMediaQuery";

const VIRTUALIZE_AFTER = 200;

/**
 * Cards in the prerendered HTML and the hydration render: three rows at three columns, which reaches past the
 * fold up to 2560x1440 (and far past it at one column), so the rest arrive below the fold with no visible shift.
 */
const FIRST_PAGE = 9;

const VirtualResultsGrid = lazy(() =>
  import("./VirtualResultsGrid").then((m) => ({ default: m.VirtualResultsGrid })),
);

/** Row chunking for the virtualizer only; the plain grid takes its columns from CSS (library.css). */
function useColumnCount(): number {
  const three = useMediaQuery("(min-width: 1024px)");
  const two = useMediaQuery("(min-width: 640px)");
  if (three) return 3;
  if (two) return 2;
  return 1;
}

function VirtualGrid(props: { resources: Resource[]; fallback: JSX.Element }): JSX.Element {
  const columns = useColumnCount();
  return (
    <Suspense fallback={props.fallback}>
      <VirtualResultsGrid resources={props.resources} columns={columns} />
    </Suspense>
  );
}

export function ResultsGrid(props: { resources: Resource[] }): JSX.Element {
  const { resources } = props;
  const hydrated = useHydrated();
  // The prerender and the hydration render show the first page only; the rest follow in a transition once
  // hydrated. A plain client render (client navigation, createRoot, tests) shows everything at once.
  const [complete, setComplete] = useState(hydrated);
  useEffect(() => {
    if (!complete) startTransition(() => setComplete(true));
  }, [complete]);

  const shown = complete ? resources : resources.slice(0, FIRST_PAGE);
  const plain = (
    <div className="results-grid">
      {shown.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );

  if (!complete || resources.length <= VIRTUALIZE_AFTER) return plain;
  return <VirtualGrid resources={resources} fallback={plain} />;
}
