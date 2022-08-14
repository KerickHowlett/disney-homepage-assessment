import { Singleton } from '@common/decorators';
import { getEnv, isUndefined } from '../../functions';

@Singleton()
export class ServiceWorkerStore {
    // @NOTE: I couldn't put the body of 'init()' directly in the constructor
    //        due to it needing to be async when a constructor can't be.
    constructor() {
        this.init();
    }

    private _store?: Cache;

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

        const dataToCache: Response = response instanceof Response ? response : new Response(JSON.stringify(response));
        await this._store.put(request, dataToCache);
    }

    private async init(): Promise<void> {
        if (!this.hasServiceWorker) return;
        const cacheKey: string = getEnv('DISNEY_CACHE');
        this._store = await caches.open(cacheKey);
    }
}
