import { pathToFileURL } from "node:url";
import { content } from "@/content";

export type LinkTarget = { id: string; url: string; why: string; weeks: number[] };

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 4;

export function shouldSkip(resource: LinkTarget): boolean {
  return isBareSiteRoot(resource.url) && /\bsearch(?:\s+term)?\b/i.test(resource.why);
}

export function failureLine(resource: LinkTarget, status: string): string {
  const week = resource.weeks.length === 0 ? "—" : String(Math.min(...resource.weeks));
  return `week ${week} · ${resource.id} · ${resource.url} · ${status}`;
}

export async function checkResources(
  resources: LinkTarget[],
  fetchImpl: typeof fetch = fetch,
): Promise<string[]> {
  const pending = resources.filter((resource) => !shouldSkip(resource));
  const results = await mapPool(pending, CONCURRENCY, async (resource) => {
    const status = await probe(resource.url, fetchImpl);
    return status === null ? null : failureLine(resource, status);
  });
  return results.filter((line): line is string => line !== null);
}

async function probe(url: string, fetchImpl: typeof fetch): Promise<string | null> {
  const head = await request(url, "HEAD", fetchImpl);
  if (head === "405") {
    const get = await request(url, "GET", fetchImpl);
    return get === "ok" ? null : get;
  }
  return head === "ok" ? null : head;
}

async function request(url: string, method: "HEAD" | "GET", fetchImpl: typeof fetch): Promise<"ok" | string> {
  try {
    const response = await fetchImpl(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 405) return "405";
    if (response.status >= 200 && response.status < 400) return "ok";
    return String(response.status);
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) return "timeout";
    return "error";
  }
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index]!);
    }
  });
  await Promise.all(workers);
  return results;
}

function isBareSiteRoot(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (parsed.pathname === "/" || parsed.pathname === "") && parsed.search === "" && parsed.hash === "";
  } catch {
    return false;
  }
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  const skipped = content.resources.filter((resource) => shouldSkip(resource)).length;
  const failures = await checkResources(content.resources);
  console.log(`checked ${content.resources.length - skipped}, skipped ${skipped}`);
  if (failures.length > 0) {
    for (const line of failures) console.error(line);
    process.exit(1);
  }
}
