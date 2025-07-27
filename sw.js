const CACHE_NAME = 'shallow-sea-scorepad-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './app.js',         // main scoring logic
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/background.png',
  './images/turtle.png',
  './images/orange.png',
  './images/blue.png',
  './images/ocean.png',
  './images/sealife.png',
  './images/incomplete.png'
];

// Install: cache all files
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy with network fallback
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return (
        response ||
        fetch(evt.request).then((fetchRes) => {
          // optional: cache new requests
          return fetchRes;
        })
      );
    })
  );
});
