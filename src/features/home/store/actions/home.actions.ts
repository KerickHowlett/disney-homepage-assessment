import { Singleton } from '@common/decorators';
import { updateState } from '@common/functions';
import { getCollection, getContainers } from '../../helpers';
import type { Collection, CollectionStateKey, HomeAPIResponse, HomeState } from '../../types';
import { HomeEffects } from '../effects';

@Singleton()
export class HomeActions {
    constructor(private readonly effects: HomeEffects = new HomeEffects()) {}

    async fetchHomeAPI(originalState: Readonly<HomeState>): Promise<Readonly<HomeState>> {
        const response: HomeAPIResponse | null = await this.effects.fetchHomeJSON();
        return updateState<HomeState>(response, 'response', originalState);
    }

    saveCollections(originalState: Readonly<HomeState>, response: HomeAPIResponse | null): Readonly<HomeState> {
        const collectionState: Map<CollectionStateKey, Readonly<Collection>> = new Map();
        for (const { set } of getContainers(response)) {
            const collection: Collection = getCollection(set);
            collectionState.set(collection.id, collection);
        }

        return updateState<HomeState>(collectionState, 'collections', originalState);
    }
}
