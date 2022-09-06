import type { RefId, SetRefAPIResponse } from '../state';
import { HOME_API_DOMAIN } from './constants/home.effects.constants';
import { fetchJSON } from './utils/fetch-json.utils';

export async function fetchPersonalizedCollection(refId: RefId): Promise<SetRefAPIResponse | null> {
    const endpoint = `${HOME_API_DOMAIN}/sets/${refId}.json`;
    return fetchJSON<SetRefAPIResponse>(endpoint);
}
