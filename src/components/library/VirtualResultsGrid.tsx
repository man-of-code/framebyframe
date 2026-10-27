import { useRef, type JSX } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ResourceCard } from "@/components/resource/ResourceCard";
import type { Resource } from "@/lib/types";

/** Loaded only past the 200-item threshold, so the virtualizer stays out of the library's first load. */
export function VirtualResultsGrid(props: { resources: Resource[]; columns: number }): JSX.Element {
  const { resources, columns } = props;
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(resources.length / columns),
    estimateSize: () => 280,
    overscan: 4,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

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
