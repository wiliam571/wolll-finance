const CACHE_NAME = 'wolll-cache-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo-wolll-finance.png',
  './logo-wolll-finance-white.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Instalación: guarda solo archivos visuales estáticos
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activación: limpia versiones viejas de caché
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptor de red inteligente
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // Si la petición va hacia Google Script / Google Sheets, NUNCA usar caché, ir directo a internet
  if (url.includes('script.google.com') || url.includes('script.googleusercontent.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Para imágenes y diseño local, responder con caché o red
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});