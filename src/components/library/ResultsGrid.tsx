import { lazy, Suspense, type JSX } from "react";
import { ResourceCard } from "@/components/resource/ResourceCard";
import type { Resource } from "@/lib/types";
import { useMediaQuery } from "./useMediaQuery";

const VIRTUALIZE_AFTER = 200;

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
  const plain = (
    <div className="results-grid">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );

  if (resources.length <= VIRTUALIZE_AFTER) return plain;
  return <VirtualGrid resources={resources} fallback={plain} />;
}
