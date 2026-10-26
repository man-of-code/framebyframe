import { lazy, Suspense, type JSX } from "react";
import { ResourceCard } from "@/components/resource/ResourceCard";
import type { Resource } from "@/lib/types";
import { useMediaQuery } from "./useMediaQuery";

const VIRTUALIZE_AFTER = 200;

const VirtualResultsGrid = lazy(() =>
  import("./VirtualResultsGrid").then((m) => ({ default: m.VirtualResultsGrid })),
);

function useColumnCount(): number {
  const three = useMediaQuery("(min-width: 1024px)");
  const two = useMediaQuery("(min-width: 640px)");
  if (three) return 3;
  if (two) return 2;
  return 1;
}

export function ResultsGrid(props: { resources: Resource[] }): JSX.Element {
  const { resources } = props;
  const columns = useColumnCount();
  const plain = (
    <div className="results-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );

  if (resources.length <= VIRTUALIZE_AFTER) return plain;
  return (
    <Suspense fallback={plain}>
      <VirtualResultsGrid resources={resources} columns={columns} />
    </Suspense>
  );
}
