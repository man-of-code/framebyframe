/// <reference types="node" />
import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom";
import { routes } from "./router";

/**
 * Build-time only (scripts/prerender.ts, after `vite build --ssr`). Renders one path with the same route objects
 * as the browser router. `prerenderToNodeStream` waits for every React.lazy route and Suspense boundary, so the
 * result is the finished page. No `window`: per-user state renders from its neutral server snapshot.
 */
export async function render(path: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(path, "http://prerender.local")));
  if (context instanceof Response) throw new Error(`prerender ${path}: the router answered with a redirect`);
  const router = createStaticRouter(handler.dataRoutes, context);
  // Same element shape as main.tsx (StrictMode around a router provider), so useId values match on hydration.
  // No loaders, so there is no hydration data to embed.
  // progressiveChunkSize: Infinity keeps every completed boundary inline. With the default (12.8 KB) React
  // outlines a large route into a hidden <div> behind the RouteFallback skeleton and reveals it from an
  // inline script on a later frame, so first paint would be the skeleton and LCP would wait for the swap.
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  );
  const decoder = new TextDecoder();
  let html = "";
  for await (const chunk of prelude) {
    html += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
  }
  return html + decoder.decode();
}
