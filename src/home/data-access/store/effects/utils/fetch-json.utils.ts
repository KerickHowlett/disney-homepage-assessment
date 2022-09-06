import { isValidResponse } from './is-valid-response.utils';

export async function fetchJSON<T = unknown>(endpoint: string): Promise<T | null> {
    try {
        const response: Response = await fetch(endpoint);
        return isValidResponse(response) ? response.json() : null;
    } catch (error: unknown) {
        console.error(error);
    }
    return null;
}
