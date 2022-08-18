import { Singleton } from '@common/decorators';
import { isUndefined } from '@common/utils';

@Singleton()
export class HomeDataFetching {
    async get<T = unknown>(endpoint: string): Promise<T | null> {
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
