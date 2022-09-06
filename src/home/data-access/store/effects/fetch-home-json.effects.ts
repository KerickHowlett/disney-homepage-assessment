import type { HomeAPIResponse } from '../state';
import { HOME_API_DOMAIN, HOME_JSON_API } from './constants/home.effects.constants';
import { fetchJSON } from './utils/fetch-json.utils';

export async function fetchHomeJSON(): Promise<HomeAPIResponse | null> {
    const API_ENDPOINT = `${HOME_API_DOMAIN}/${HOME_JSON_API}`;
    return fetchJSON<HomeAPIResponse>(API_ENDPOINT);
}
