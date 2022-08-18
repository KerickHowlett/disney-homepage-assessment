const cacheName = 'disney-v1';

const preCachedAssets = [
    './',
    '../index.html',
    './styles.css',
    './favicon.ico',
    './main.ts',
    'https://static-assets.bamgrid.com/fonts/avenir-world-for-disney/AvenirWorldforDisneyv2-Demi.c737f3bb45822159626cd7952dc1636e.woff2',
    'https://static-assets.bamgrid.com/fonts/avenir-world-for-disney/AvenirWorldforDisneyv2.d63aa1080e072dcb10992153d5ebd496.woff2',
    'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/73FE8AEF93AE19518421FDA85EE671B6EECE6C8DD02B1E7434D3DE719E97E72B/scale?format=jpeg&quality=90&scalingAlgorithm=lanczos3&width=500',
];
self.addEventListener('install', async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(preCachedAssets);
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
    }

    return cache.match(request);
}
