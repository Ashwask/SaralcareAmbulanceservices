/**
 * Service Worker for Saralcare Ambulances.
 *
 * Strategy:
 *  - HTML pages: stale-while-revalidate so navigation works offline.
 *  - /v1/*.json: stale-while-revalidate so the directory loads instantly,
 *    then refreshes silently.
 *  - Map tiles (tile.openstreetmap.org): cache-first with a small LRU budget.
 *  - Other (assets, fonts): cache-first.
 *  - Offline fallback page: /offline.html for navigations when nothing cached.
 */

const VERSION = "v1.0.3";
const SHELL = `shell-${VERSION}`;
const DATA = `data-${VERSION}`;
const TILES = `tiles-${VERSION}`;
const STATIC = `static-${VERSION}`;

const SHELL_URLS = [
  "/",
  "/explore",
  "/notice",
  "/disclaimer",
  "/saved",
  "/for-providers",
  "/offline.html",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(SHELL_URLS.map((u) => new Request(u, { cache: "reload" }))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (![SHELL, DATA, TILES, STATIC].includes(k)) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // OSM tiles
  if (url.host === "tile.openstreetmap.org") {
    event.respondWith(cacheFirst(req, TILES, 200));
    return;
  }

  // JSON API
  if (url.origin === location.origin && url.pathname.startsWith("/v1/")) {
    event.respondWith(staleWhileRevalidate(req, DATA));
    return;
  }

  // HTML navigations
  if (req.mode === "navigate") {
    event.respondWith(
      staleWhileRevalidate(req, SHELL).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Same-origin static assets
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req, STATIC));
    return;
  }
});

async function cacheFirst(req, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const resp = await fetch(req);
    if (resp.ok) {
      cache.put(req, resp.clone());
      if (maxEntries) await trim(cache, maxEntries);
    }
    return resp;
  } catch (e) {
    return hit || new Response("offline", { status: 503 });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((resp) => {
      if (resp && resp.ok) cache.put(req, resp.clone());
      return resp;
    })
    .catch(() => undefined);
  return hit || fetchPromise || new Response("offline", { status: 503 });
}

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length <= max) return;
  for (let i = 0; i < keys.length - max; i++) {
    await cache.delete(keys[i]);
  }
}
