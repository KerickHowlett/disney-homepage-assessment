import { getEnv, isUndefined } from '@disney/shared';
import { Singleton } from '@disney/shared/decorators';
import type { HomeAPIResponse, RefId, SetRefAPIResponse } from './types';

const HOME_JSON_API = 'home.json';

@Singleton()
export class HomeEffects {
    private readonly homeAPIDomain: string;
    constructor() {
        this.homeAPIDomain = getEnv('DISNEY_HOME_API_DOMAIN');
    }

    async fetchHomeJSON(): Promise<HomeAPIResponse | null> {
        const endpoint = `${this.homeAPIDomain}/${HOME_JSON_API}`;
        return this.fetchJSON<HomeAPIResponse>(endpoint);
    }

    async fetchHomeJSONByRefId(refId: RefId): Promise<SetRefAPIResponse | null> {
        const endpoint = `${this.homeAPIDomain}/sets/${refId}.json`;
        return this.fetchJSON<SetRefAPIResponse>(endpoint);
    }

    private async fetchJSON<T = unknown>(endpoint: string): Promise<T | null> {
        try {
            const response: Response = await fetch(endpoint);
            if (this.isValidResponse(response)) {
                return response.json();
            }
        } catch (error: unknown) {
            console.error(error);
        }

        return null;
    }

    private isEmptyResponse(response: Response): boolean {
        const NOT_FOUND = 404;
        return !response.ok || response.status === NOT_FOUND;
    }

    private isValidResponse(response?: Response): response is Response {
        return !isUndefined(response) && !this.isEmptyResponse(response);
    }
}
