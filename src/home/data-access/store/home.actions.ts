import type { Action, OnAction } from '@disney/shared';
import { Singleton, updateState } from '@disney/shared';
import { HomeEffects } from './home.effects';
import { HomeState } from './home.state';
import type { HomeAPIResponse, RefId, SetRefAPIResponse } from './types';
import { saveCollections, saveContentForPersonalizedCollection } from './utils';

export type LoadStandardCollections = Action<'LOAD_STANDARD_COLLECTIONS'>;
export type LoadPersonalizedCollection = Action<'LOAD_PERSONALIZED_COLLECTION', RefId>;

export type AllHomeActions = LoadStandardCollections | LoadPersonalizedCollection;

export type HomeActionTypes = AllHomeActions['type'];
export type HomeActionPayloads = AllHomeActions['payload'];

export const OnHomeAction: OnAction<HomeActionTypes> = {
    LOAD_STANDARD_COLLECTIONS: 'LOAD_STANDARD_COLLECTIONS',
    LOAD_PERSONALIZED_COLLECTION: 'LOAD_PERSONALIZED_COLLECTION',
} as const;

@Singleton()
export class HomeActions {
    constructor(private readonly effects: HomeEffects = new HomeEffects()) {}

    async fetchHomeAPI(originalState: Readonly<HomeState>): Promise<Readonly<HomeState>> {
        const response: HomeAPIResponse | null = await this.effects.fetchHomeJSON();
        const payload: Readonly<HomeState> = saveCollections(response);
        return updateState<HomeState>(originalState, payload);
    }

    async fetchPersonalizedCuratedSet(originalState: Readonly<HomeState>, refId: RefId): Promise<Readonly<HomeState>> {
        const response: SetRefAPIResponse | null = await this.effects.fetchHomeJSONByRefId(refId);
        const payload: HomeState = saveContentForPersonalizedCollection(originalState, refId, response);
        return updateState<HomeState>(originalState, payload);
    }
}
