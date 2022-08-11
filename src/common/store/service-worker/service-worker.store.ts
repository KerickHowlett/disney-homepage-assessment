import { getEnv, isUndefined } from '../../functions';

export class ServiceWorkerStore {
    private _store: Cache | undefined;
    private static instance: ServiceWorkerStore | undefined;

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

    static getSingletonInstance(): ServiceWorkerStore {
        if (isUndefined(ServiceWorkerStore.instance)) {
            ServiceWorkerStore.instance = new ServiceWorkerStore();
        }
        return ServiceWorkerStore.instance;
    }

    private constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        if (!this.hasServiceWorker) return;
        const cacheKey: string = getEnv('DISNEY_CACHE');
        this._store = await caches.open(cacheKey);
    }
}
