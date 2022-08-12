import { Singleton } from '@common/decorators';
import { isUndefined } from '@common/functions';
import { ServiceWorkerStore } from '@common/store';

@Singleton()
export class HomeDataFetching {
    constructor(private readonly cache: ServiceWorkerStore = new ServiceWorkerStore()) {}

    async get<T = unknown>(endpoint: string): Promise<T | null> {
        const endpointUrl: URL = new URL(endpoint);

        try {
            const response: Response =
                // @NOTE: Ideally, we'd later want the means to insert a
                //        TTL (Time-To-Live) for the cache, so we can control
                //        how often we want to fetch fresh data.
                (await this.cache.get(endpointUrl)) ||
                (await fetch(endpoint, {
                    method: 'GET',
                }));

            if (this.isValidResponse(response)) {
                const payload: T = await response.json();
                this.cache.saveApiResponse(endpointUrl, payload);
                return payload;
            }
        } catch (error: unknown) {
            console.error(error);
        }

        return null;
    }

    private isEmptyResponse(response: Response): boolean {
        return !response.ok || response.status === 404;
    }

    private isValidResponse(response?: Response): response is Response {
        return !isUndefined(response) && !this.isEmptyResponse(response);
    }
}
