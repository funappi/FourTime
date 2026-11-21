// FourTimer — service worker : app 100 % hors ligne.
// Pour publier une mise à jour, change simplement le numéro de VERSION.
const VERSION = 'fourtimer-v11';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './icon-maskable.png', './favicon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Pages et code : réseau d'abord (la dernière version s'affiche dès qu'il y a internet),
// sinon la copie en cache (hors ligne). Images : cache d'abord.
const put = (req, res) => { if (res && res.ok) { const c = res.clone(); caches.open(VERSION).then(x => x.put(req, c)); } return res; };
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const fresh = req.mode === 'navigate' || /\.(html|js|webmanifest)$|\/$/.test(new URL(req.url).pathname);
  if (fresh) {
    e.respondWith(
      Promise.race([fetch(req, { cache: 'no-store' }).then(r => put(req, r)), new Promise((_, no) => setTimeout(no, 4000))])
        .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => put(req, r))).catch(() => caches.match('./index.html')));
});

// Toucher la notification « plat prêt » ramène l'app au premier plan.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list =>
      list.length ? list[0].focus() : self.clients.openWindow('./index.html'))
  );
});
