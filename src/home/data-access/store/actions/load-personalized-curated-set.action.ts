import type { ActionType } from '@disney/shared';
import { createAction } from '@disney/shared';
import { fetchPersonalizedCollection } from '../effects';
import type { RefId, SetRefAPIResponse } from '../state';
import type { HomeState } from '../state/home.state';
import { saveContentForPersonalizedCollection } from './utils';

async function fetchPersonalizedCuratedSet(
    originalState: Readonly<HomeState>,
    refId: RefId,
): Promise<Readonly<HomeState>> {
    const response: SetRefAPIResponse | null = await fetchPersonalizedCollection(refId);
    return saveContentForPersonalizedCollection(originalState, refId, response);
}

export const LOAD_PERSONALIZED_COLLECTION: ActionType = 'LOAD_PERSONALIZED_COLLECTION';
export const loadPersonalizedCuratedSetAction = createAction(LOAD_PERSONALIZED_COLLECTION, fetchPersonalizedCuratedSet);
