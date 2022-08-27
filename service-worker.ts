/// <reference types="vite/client" />

// This is a hack to redefine the typing of "self", since there doesn't appear
// to be an official means of doing so in native TypeScript (without a library)
// yet.
type ClientsClaimOverride = { clients: { claim: () => Promise<void> } };

// @NOTE: Will need to apply a dotenv implementation to these hard-coded
//        variables.
const CACHE_STATIC_FILES_STORE_NAME = 'disney-v1-static';
const CACHE_FETCH_RESPONSES_STORE_NAME = 'disney-v1-fetch-responses';
const ASSET_API_DOMAIN = 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney';
const NO_CORS: RequestInit = { mode: 'no-cors' };
const NOT_FOUND = 404;
const NOT_FOUND_RESPONSE: Response = new Response(null, { status: NOT_FOUND });
const PRE_CACHED_STATIC_FILES: string[] = [
    '/',
    'index.html',
    'src/assets/default-content-tile.jpeg',
    'src/styles.css',
    'src/favicon.ico',
    'src/main.ts',
];

// Helpers
const addNoCORSHeaderToRequests = (urls: string[]): Request[] =>
    urls.reduce((requests: Request[], url: string): Request[] => {
        if (!url.includes('https://')) {
            const request: Request = new Request(url, NO_CORS);
            return [...requests, request];
        }
        return requests;
    }, []);
const isCallToAssetAPI = (event: FetchEvent): boolean => event.request.url.includes(ASSET_API_DOMAIN);
const isNetworkCall = (event: FetchEvent): boolean => event.request.url.indexOf('http') === 0;
const isSuccessful = (response: Response): boolean => response.ok && response.status !== NOT_FOUND;
const matchesWithACacheStoreName = (cacheName: string): boolean => {
    return cacheName === CACHE_STATIC_FILES_STORE_NAME || cacheName === CACHE_FETCH_RESPONSES_STORE_NAME;
};
const imageRequest = (event: FetchEvent): boolean => event.request.destination === 'image';
const requestForPreCachedFile = (event: FetchEvent): boolean => {
    const { pathname: requestUrl } = new URL(event.request.url);
    return PRE_CACHED_STATIC_FILES.includes(requestUrl);
};

// Caching Strategies.
const cacheFirstThenNetworkStrategy = (event: FetchEvent): void =>
    event.respondWith(
        caches.open(CACHE_FETCH_RESPONSES_STORE_NAME).then((cache: Cache): Promise<Response> => {
            return cache
                .match(event.request)
                .then((cachedResponse: Response | undefined): Response | Promise<Response> => {
                    return (
                        cachedResponse ||
                        (fetch(event.request.url, NO_CORS)
                            .then((networkResponse: Response): Response => {
                                if (isSuccessful(networkResponse)) {
                                    cache.put(event.request, networkResponse.clone());
                                }
                                return networkResponse;
                            })
                            .catch((): Response => NOT_FOUND_RESPONSE) as Promise<Response>)
                    );
                })
                .catch((): Response => NOT_FOUND_RESPONSE) as Promise<Response>;
        }),
    );

const cacheOnlyStrategy = (event: FetchEvent): void =>
    event.respondWith(
        caches
            .open(CACHE_STATIC_FILES_STORE_NAME)
            .then(
                (cache: Cache): Promise<Response> =>
                    cache.match(event.request).catch((): Response => NOT_FOUND_RESPONSE) as Promise<Response>,
            )
            .catch((): Response => NOT_FOUND_RESPONSE) as Promise<Response>,
    );

const networkFirstWithCacheFallbackStrategy = (event: FetchEvent): void =>
    event.respondWith(
        caches
            .open(CACHE_FETCH_RESPONSES_STORE_NAME)
            .then(
                (cache: Cache): Promise<Response> =>
                    fetch(event.request)
                        .then((response: Response): Response => {
                            if (isSuccessful(response)) {
                                cache.put(event.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch((): Promise<Response> => caches.match(event.request) as Promise<Response>),
            )
            .catch((): Response => NOT_FOUND_RESPONSE) as Promise<Response>,
    );

const preCacheEssentialStaticFilesStrategy = (event: ExtendableEvent): void =>
    event.waitUntil(
        caches.open(CACHE_STATIC_FILES_STORE_NAME).then((cache: Cache): Promise<void> => {
            const preCacheRequests: Request[] = addNoCORSHeaderToRequests(PRE_CACHED_STATIC_FILES);
            return cache.addAll(preCacheRequests);
        }),
    );

const removeOutdatedCacheStoresStrategy = (event: ExtendableEvent): void =>
    event.waitUntil(
        caches
            .keys()
            .then((keys: string[]) =>
                Promise.all(
                    keys.map((key: string): Promise<boolean> | void => {
                        if (!matchesWithACacheStoreName(key)) {
                            return caches.delete(key);
                        }
                    }),
                ),
            )
            .catch((): Response => NOT_FOUND_RESPONSE) as Promise<Response>,
    );

// Service Worker Event Handlers
self.addEventListener('install', (event: Event): void =>
    preCacheEssentialStaticFilesStrategy(event as ExtendableEvent),
);

self.addEventListener('activate', (event: Event): Promise<void> => {
    removeOutdatedCacheStoresStrategy(event as ExtendableEvent);
    return (self as unknown as ClientsClaimOverride).clients.claim();
});

self.addEventListener('fetch', (event: Event): void => {
    const fetchEvent: FetchEvent = event as FetchEvent;
    if (requestForPreCachedFile(fetchEvent)) {
        return cacheOnlyStrategy(fetchEvent);
    }
    if (imageRequest(fetchEvent) && isCallToAssetAPI(fetchEvent)) {
        return cacheFirstThenNetworkStrategy(fetchEvent);
    }
    if (isNetworkCall(fetchEvent)) {
        return networkFirstWithCacheFallbackStrategy(fetchEvent);
    }
});
