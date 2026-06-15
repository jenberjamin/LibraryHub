const CACHE_NAME = 'lifehub-vault-v8'; // Bumped version to force update

// The "Furniture" List
// Everything the app needs to work without internet.
const ASSETS_TO_CACHE = [
  './', 
  './index.html',
  './LibraryHub.html',
  './LibraryHub-Collections.html',
  './Reading_Room.html',
  './manifest-libraryhub.json',
  
  // Scripts
  './js/library-core.js',
  './js/reading-engine.js',
  
  // Images & Icons (Critical for PWA Install)
  './icon.png',
  './icon_2.png',
  
  // External Fonts (Optional - caching these makes fonts work offline too)
  'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;700&family=Cinzel:wght@400;700&family=Oswald:wght@500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0'
];

// 1. INSTALL: Collect the Furniture
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[LifeHub] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// 2. FETCH: Serve from Cache first, then Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If we have it in the cache, give it to them (Offline Mode!)
      if (response) {
        return response;
      }
      // If not, try to go to the internet
      return fetch(event.request);
    })
  );
});

// 3. ACTIVATE: Clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[LifeHub] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // Tell the active service worker to take control of the page immediately.
  return self.clients.claim();
});