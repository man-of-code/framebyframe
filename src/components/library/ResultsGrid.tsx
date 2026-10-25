import { useRef, type JSX } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ResourceCard } from "@/components/resource/ResourceCard";
import type { Resource } from "@/lib/types";
import { useMediaQuery } from "./useMediaQuery";

const VIRTUALIZE_AFTER = 200;

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
  const parentRef = useRef<HTMLDivElement>(null);
  const virtual = resources.length > VIRTUALIZE_AFTER;
  const virtualizer = useWindowVirtualizer({
    count: virtual ? Math.ceil(resources.length / columns) : 0,
    estimateSize: () => 280,
    overscan: 4,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
    enabled: virtual,
  });

  if (!virtual) {
    return (
      <div className="results-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    );
  }

  return (
    <div ref={parentRef} className="results-virtual">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columns;
          const row = resources.slice(start, start + columns);
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <div className="results-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {row.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
