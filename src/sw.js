const cacheName = 'disney-v1';
const staticAssets = ['./', '../index.html', './styles.css', './favicon.ico', './main.ts'];

self.addEventListener('install', async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', () => {
    self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
    const request = event.request;
    const url = new URL(request.url);
    const cachedRequest = url.origin === location.origin ? await cacheFirst(request) : await networkAndCache(request);
    event.respondWith(cachedRequest);
});

async function cacheFirst(request) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || fetch(request);
}

async function networkAndCache(request) {
    const cache = await caches.open(cacheName);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.error(error);
        return cache.match(request);
    }
}
