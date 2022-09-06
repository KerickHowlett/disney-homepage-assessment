import type { ActionType } from '@disney/shared';
import { createAction } from '@disney/shared';
import { fetchHomeJSON } from '../effects';
import type { HomeAPIResponse } from '../state';
import type { HomeState } from '../state/home.state';
import { saveCollections } from './utils';

async function fetchHomeAPI(): Promise<Readonly<HomeState>> {
    const response: HomeAPIResponse | null = await fetchHomeJSON();
    return saveCollections(response);
}

export const LOAD_STANDARD_COLLECTIONS: ActionType = 'LOAD_STANDARD_COLLECTIONS';
export const loadHomeAPIAction = createAction(LOAD_STANDARD_COLLECTIONS, fetchHomeAPI);
