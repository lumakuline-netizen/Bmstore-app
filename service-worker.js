const NAMA_CACHE = 'bmstore-cache-v1';

const FILE_PENTING = [
  '/Bmstore-app/',
  '/Bmstore-app/index.html',
  '/Bmstore-app/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NAMA_CACHE).then((cache) => {
      return cache.addAll(FILE_PENTING);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((semuaCache) => {
      return Promise.all(
        semuaCache
          .filter((nama) => nama !== NAMA_CACHE)
          .map((nama) => caches.delete(nama))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((responFromCache) => {
      if (responFromCache) {
        return responFromCache;
      }
      return fetch(event.request).then((responFromNetwork) => {
        return caches.open(NAMA_CACHE).then((cache) => {
          cache.put(event.request, responFromNetwork.clone());
          return responFromNetwork;
        });
      });
    })
  );
});
