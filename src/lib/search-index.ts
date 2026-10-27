import Fuse, { type IFuseOptions } from "fuse.js";
import type { Resource } from "@/lib/types";

// Split from search.ts so Fuse loads after the library's first paint.
const INDEX_OPTIONS: IFuseOptions<Resource> = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "why", weight: 0.3 },
    { name: "topics", weight: 0.15 },
    { name: "type", weight: 0.05 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
};

export function createIndex(all: Resource[]): Fuse<Resource> {
  return new Fuse(all, INDEX_OPTIONS);
}
