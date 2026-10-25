/* Hashed /assets are cache-first. Navigations are stale-while-revalidate:
   the last response for a visited URL is served immediately, including offline,
   and an online visit replaces it. A pure cache-first shell would keep a stale
   index.html until this file itself changed. */
const CACHE = "fbf-shell-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(event, request));
    return;
  }
  if (url.pathname.startsWith("/assets/")) event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) return cache.put(request, response.clone()).then(() => response);
      return response;
    })
    .catch(() => null);
  if (cached) {
    event.waitUntil(refresh.then(() => undefined));
    return cached;
  }
  const response = await refresh;
  if (response) return response;
  const shell = await cache.match("/");
  if (shell) return shell;
  return fetch(request);
}
