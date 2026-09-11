const CACHE_NAME = 'zhurnal-objektov-v1';
const CORE_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
    ))
  );
  self.clients.claim();
});

// Сеть в приоритете (для актуальных данных и кода), кэш — только как запасной
// вариант, если совсем нет связи. Запросы к Supabase не кэшируем никогда.
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if(url.includes('supabase.co')) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
