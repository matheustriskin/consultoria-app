// Service Worker para Consultoria Esportiva PWA - v8 (Auto-Update e Cache Clean)
const CACHE_NAME = 'consultoria-v8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/app.css?v=8',
  './js/database.js?v=8',
  './js/visuals.js?v=8',
  './js/app.js?v=8',
  './manifest.json?v=8',
  './assets/logo.jpg?v=8',
  './assets/icon-192.png?v=8',
  './assets/icon-512.png?v=8',
  './assets/apple-touch-icon.png?v=8',
  './assets/favicon.png?v=8'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Limpando cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia Network-First para arquivos de código (sempre pega o mais novo na internet)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
