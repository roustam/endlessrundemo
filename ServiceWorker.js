const CACHE_NAME = 'DefaultCompany-Ohmygrr-0.1.0';
const contentToCache = [
    '/',
    '/index.html',
    '/Build/SafariOptBuild1.loader.js',
    '/Build/SafariOptBuild1.framework.js.unityweb',
    '/Build/SafariOptBuild1.data.unityweb',
    '/Build/SafariOptBuild1.wasm.unityweb',
    '/TemplateData/style.css',
    '/TemplateData/favicon.ico'
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('[Service Worker] Caching all: app shell and content');
          return cache.addAll(contentToCache);
        })
        .catch(err => {
          console.error('Cache addAll error:', err);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
      caches.match(e.request)
        .then(response => {
          console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
          if (response) { return response; }

          return fetch(e.request)
            .then(response => {
              const cache = caches.open(CACHE_NAME);
              console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
              cache.put(e.request, response.clone());
              return response;
            });
        })
    );
});

// Unified error handling
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Unhandled rejection:', event.reason);
});
