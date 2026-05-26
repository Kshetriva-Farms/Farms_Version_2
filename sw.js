const CACHE_NAME = 'kshetriva-farms-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './robots.txt',
  './sitemap.xml',
  './manifest.json',
  './images/favicon.png',
  './images/logo_pwa_192.png',
  './images/logo_pwa_512.png',
  './images/logo_nav.webp',
  './images/about_farm_wide.png',
  './images/farmer_surendhar.webp',
  './images/farmer_bhaskar.png',
  './images/farmer_ashok.webp',
  './images/farm_field.webp',
  './images/harvesting.webp',
  './images/quality_check.webp',
  './images/delivery_box.webp'
];

// Perform install steps
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🌾 Service Worker: Pre-caching static assets successfully.');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  // Only handle http/https requests, ignore chrome-extension / database origins
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }

        // Cache miss - fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Dynamically cache new static assets (skip dynamic firestore/admin requests)
          if (event.request.method === 'GET' && !event.request.url.includes('#admin')) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return networkResponse;
        });
      }).catch(() => {
        // Fallback for document pages if completely offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`🌾 Service Worker: Deleting deprecated cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
