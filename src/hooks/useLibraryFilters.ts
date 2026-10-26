import { useEffect, useMemo, useRef, useState } from "react";
import type Fuse from "fuse.js";
import { useSearchParams } from "react-router-dom";
import { resources } from "@/content/resources";
import {
  facetOptions,
  searchResources,
  type Facets,
  type StatusFlag,
} from "@/lib/search";
import type { Resource } from "@/lib/types";

const FACET_KEYS = ["type", "topic", "week", "level", "cost", "language", "status"] as const;

const STATUSES = new Set<StatusFlag>(["clean", "gray-area", "benchmark", "experimental", "email-gated"]);

function isStatus(value: string): value is StatusFlag {
  return STATUSES.has(value as StatusFlag);
}

export function selectedEmptyLanguages(facets: Facets, all: Resource[]): string[] {
  return facets.language.filter((code) => !all.some((resource) => resource.language === code));
}

function readFacets(params: URLSearchParams): Facets {
  return {
    type: params.getAll("type"),
    topic: params.getAll("topic"),
    week: params
      .getAll("week")
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0),
    level: params.getAll("level"),
    cost: params.getAll("cost"),
    language: params.getAll("language"),
    status: params.getAll("status").filter(isStatus),
  };
}

function writeFacet(params: URLSearchParams, key: keyof Facets, values: readonly (string | number)[]) {
  params.delete(key);
  for (const value of values) params.append(key, String(value));
}

export function useLibraryFilters() {
  const [params, setParams] = useSearchParams();
  const search = params.toString();
  const written = useRef(search);
  const inflight = useRef(false);
  if (search === written.current) inflight.current = false;
  else if (!inflight.current) written.current = search;

  const query = params.get("q") ?? "";
  const view = params.get("view") === "table" ? "table" : "cards";
  const facets = useMemo(() => readFacets(new URLSearchParams(search)), [search]);
  const [index, setIndex] = useState<Fuse<Resource> | null>(null);
  useEffect(() => {
    let live = true;
    void import("@/lib/search-index").then(({ createIndex }) => {
      if (live) setIndex(createIndex(resources));
    });
    return () => {
      live = false;
    };
  }, []);
  const options = useMemo(() => facetOptions(resources), []);
  const results = useMemo(
    () => searchResources(index, resources, query, facets),
    [index, query, facets],
  );

  function commit(mutate: (draft: URLSearchParams) => void, replace = false) {
    const next = new URLSearchParams(written.current);
    mutate(next);
    written.current = next.toString();
    inflight.current = true;
    setParams(next, replace ? { replace: true } : undefined);
  }

  function setQuery(nextQuery: string) {
    commit((draft) => {
      if (nextQuery.trim() === "") draft.delete("q");
      else draft.set("q", nextQuery);
    }, true);
  }

  function toggleFacet(key: keyof Facets, value: string | number) {
    commit((draft) => {
      const current = readFacets(draft)[key].map(String);
      const token = String(value);
      const next = current.includes(token) ? current.filter((item) => item !== token) : [...current, token];
      writeFacet(draft, key, next);
    });
  }

  function clearAll() {
    commit((draft) => {
      draft.delete("q");
      for (const key of FACET_KEYS) draft.delete(key);
    });
  }

  function setView(nextView: "cards" | "table") {
    commit((draft) => {
      if (nextView === "table") draft.set("view", "table");
      else draft.delete("view");
    }, true);
  }

  return { query, facets, setQuery, toggleFacet, clearAll, results, options, view, setView };
}
