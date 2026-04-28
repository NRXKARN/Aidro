const CACHE_NAME = 'aidro-v3-zenith';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('CACHE_BUILT: MISSION_READY');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('maps.googleapis.com')) return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
              if (event.request.method === 'GET') cache.put(event.request.url, fetchRes.clone());
              return fetchRes;
          });
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});
