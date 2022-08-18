// This is a hack to redefine the typing of "self", since there doesn't appear
// to be an official means of doing so in native TypeScript yet.
// declare const self: ServiceWorkerGlobalScope;
// export { };

// Hardcoded Cache Store Names
const CACHE_STATIC_FILES_STORE_NAME = 'disney-v1-static';
const CACHE_FETCH_RESPONSES_STORE_NAME = 'disney-v1-fetch-responses';
const CONSOLE_GROUP_NAME = '[Service Worker]';
const ASSET_API_DOMAIN = 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney';
const HOME_API_DOMAIN = 'https://cd-static.bamgrid.com/dp-117731241344';
const NO_CORS_SETTINGS: RequestInit = { mode: 'no-cors' };
const NOT_FOUND = 404;

const PRE_CACHED_STATIC_FILES: string[] = [
    '/',
    'index.html',
    'src/styles.css',
    'src/favicon.ico',
    'src/main.ts',
    'https://static-assets.bamgrid.com/fonts/avenir-world-for-disney/AvenirWorldforDisneyv2-Demi.c737f3bb45822159626cd7952dc1636e.woff2',
    'https://static-assets.bamgrid.com/fonts/avenir-world-for-disney/AvenirWorldforDisneyv2.d63aa1080e072dcb10992153d5ebd496.woff2',
    'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/73FE8AEF93AE19518421FDA85EE671B6EECE6C8DD02B1E7434D3DE719E97E72B/scale?format=jpeg&quality=90&scalingAlgorithm=lanczos3&width=500',
];

// Helpers
const addNoCORSHeaderToRequests = (urls: string[]): Request[] =>
    urls.reduce((requests: Request[], url: string): Request[] => {
        if (!url.includes('https://')) {
            const request: Request = new Request(url, { mode: 'no-cors' });
            return [...requests, request];
        }
        return requests;
    }, []);
const isCallToAssetAPI = (event: FetchEvent): boolean => event.request.url.includes(ASSET_API_DOMAIN);
const isCallToHomeAPI = (event: FetchEvent): boolean => event.request.url.includes(HOME_API_DOMAIN);
const isSuccessful = (response: Response): boolean => response.ok && response.status !== NOT_FOUND;
const matchesWithACacheStoreName = (cacheName: string): boolean => {
    return cacheName === CACHE_STATIC_FILES_STORE_NAME || cacheName === CACHE_FETCH_RESPONSES_STORE_NAME;
};
const imageRequest = (event: FetchEvent): boolean => event.request.destination === 'image';
const requestForPreCachedFile = (event: FetchEvent): boolean => {
    const { pathname: requestUrl } = new URL(event.request.url);
    return PRE_CACHED_STATIC_FILES.includes(requestUrl);
};

// Cache Strategies.
const cacheFirstThenNetworkStrategy = (event: FetchEvent): void =>
    event.respondWith(
        caches.open(CACHE_FETCH_RESPONSES_STORE_NAME).then((cache: Cache): Promise<Response> => {
            return cache
                .match(event.request)
                .then((cachedResponse: Response | undefined): Response | Promise<Response> => {
                    return (
                        cachedResponse ||
                        fetch(event.request.url, NO_CORS_SETTINGS).then((networkResponse: Response): Response => {
                            if (isSuccessful(networkResponse)) {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        })
                    );
                });
        }),
    );

const cacheOnlyStrategy = (event: FetchEvent): void =>
    event.respondWith(
        caches.open(CACHE_STATIC_FILES_STORE_NAME).then(
            (cache: Cache): Promise<Response> =>
                cache.match(event.request).catch((error: Error): Response => {
                    console.error(`${CONSOLE_GROUP_NAME} ${error}`);
                    return new Response(null, { status: NOT_FOUND });
                }) as Promise<Response>,
        ),
    );

const networkFirstWithCacheFallbackStrategy = (event: FetchEvent): void =>
    event.respondWith(
        caches.open(CACHE_FETCH_RESPONSES_STORE_NAME).then(
            (cache: Cache): Promise<Response> =>
                fetch(event.request)
                    .then((response: Response): Response => {
                        if (isSuccessful(response)) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch((): Promise<Response> => caches.match(event.request) as Promise<Response>),
        ),
    );

const preCacheEssentialStaticFilesStrategy = (event: ExtendableEvent): void =>
    event.waitUntil(
        caches.open(CACHE_STATIC_FILES_STORE_NAME).then((cache: Cache): Promise<void> => {
            console.log(`${CONSOLE_GROUP_NAME} Caching App Shell...`);
            const preCacheRequests: Request[] = addNoCORSHeaderToRequests(PRE_CACHED_STATIC_FILES);
            return cache.addAll(preCacheRequests);
        }),
    );

const removeOutdatedCacheStoresStrategy = (event: ExtendableEvent): void =>
    event.waitUntil(
        caches.keys().then((keys: string[]) =>
            Promise.all(
                keys.map((key: string): Promise<boolean> | void => {
                    if (!matchesWithACacheStoreName(key)) {
                        console.log(`${CONSOLE_GROUP_NAME} Removing outdated cache: ${key}`);
                        return caches.delete(key);
                    }
                }),
            ),
        ),
    );

// Service Worker Event Handlers
console.groupCollapsed(CONSOLE_GROUP_NAME);

self.addEventListener('install', (event: Event): void => {
    console.log(`${CONSOLE_GROUP_NAME} Installing Service Worker...`, event);
    return preCacheEssentialStaticFilesStrategy(event as ExtendableEvent);
});

self.addEventListener('activate', (event: Event): Promise<void> => {
    console.log(`${CONSOLE_GROUP_NAME} Activating Service Worker...`, event);
    removeOutdatedCacheStoresStrategy(event as ExtendableEvent);
    return (self as unknown as { clients: { claim: () => Promise<void> } }).clients.claim();
});

self.addEventListener('fetch', (event: Event): void => {
    const fetchEvent: FetchEvent = event as FetchEvent;
    if (requestForPreCachedFile(fetchEvent)) {
        return cacheOnlyStrategy(fetchEvent);
    }
    if (imageRequest(fetchEvent) && isCallToAssetAPI(fetchEvent)) {
        return cacheFirstThenNetworkStrategy(fetchEvent);
    }
    return networkFirstWithCacheFallbackStrategy(fetchEvent);
});

console.groupEnd();
