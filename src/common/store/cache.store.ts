import { getEnv, isUndefined } from '../functions';

export class CacheStore {
    private _store: Cache | undefined;

    constructor() {
        this.init();
    }

    get hasServiceWorker(): boolean {
        return 'serviceWorker' in navigator && isUndefined(this._store);
    }

    get store(): Cache | undefined {
        return this._store;
    }

    async get(request: URL): Promise<Response | undefined> {
        if (isUndefined(this._store)) return undefined;
        return this._store.match(request);
    }

    async saveApiResponse<T = unknown>(request: URL, response: T): Promise<void> {
        if (isUndefined(this._store)) return;
        await this._store.put(request, new Response(JSON.stringify(response)));
    }

    private async init(): Promise<void> {
        if (!this.hasServiceWorker) return;
        const cacheKey: string = getEnv('DISNEY_CACHE');
        this._store = await caches.open(cacheKey);
    }
}
