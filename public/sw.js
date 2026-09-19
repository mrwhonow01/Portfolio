// High-Performance Service Worker for Juztin Yuen Portfolio
// Caches photos and static assets for instantaneous mobile and desktop loading

const CACHE_NAME = 'portfolio-media-v2';
const STATIC_ASSET_REGEX = /\.(webp|jpg|jpeg|png|svg|css|js|woff2)$/i;

self.addEventListener('install', (event) => {
  // Activate immediately without waiting for old clients to close
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache GET requests for photos, assets, or local static files
  if (event.request.method !== 'GET') return;
  if (!url.pathname.startsWith('/photos/') && !url.pathname.startsWith('/assets/') && !STATIC_ASSET_REGEX.test(url.pathname)) {
    return;
  }

  // Cache-First strategy with background update for media
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          return cachedResponse;
        }

        // Otherwise fetch from network and cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback if offline
          return cachedResponse;
        });
      });
    })
  );
});
