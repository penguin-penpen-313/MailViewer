// MailFocus Service Worker - Network First
// Cache name includes timestamp to force update
const CACHE = 'mailfocus-v1.6.5';

// On install: skip waiting immediately so new SW takes over fast
self.addEventListener('install', e => {
  self.skipWaiting();
});

// On activate: delete ALL caches and claim clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// On fetch: ALWAYS network for HTML, cache only for fonts/icons
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // External APIs: always network
  if (['googleapis.com','accounts.google.com','apis.google.com',
       'fonts.googleapis.com','fonts.gstatic.com'].some(d => url.hostname.includes(d))) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status:503})));
    return;
  }

  // HTML pages: ALWAYS network, never cache
  if (e.request.mode === 'navigate' ||
      e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request, {cache: 'no-store'}).catch(() =>
        new Response('<h1>オフラインです</h1>', {headers:{'Content-Type':'text/html'}})
      )
    );
    return;
  }

  // Everything else: network first, fall back to cache
  e.respondWith(
    fetch(e.request, {cache: 'no-store'}).catch(() => caches.match(e.request))
  );
});
