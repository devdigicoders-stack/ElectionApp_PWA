// Service Worker for basic PWA installability and offline support
const CACHE_NAME = 'janseva-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle by default, fallback if needed
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
