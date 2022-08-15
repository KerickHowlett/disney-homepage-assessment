import { Singleton } from '@common/decorators';
import { updateState } from '@common/utils';
import { getCollection, getContainers } from '../../helpers';
import type { Collection, CollectionStateKey, HomeAPIResponse, HomeState } from '../../types';
import { HomeEffects } from '../effects';

@Singleton()
export class HomeActions {
    constructor(private readonly effects: HomeEffects = new HomeEffects()) {}

    async fetchHomeAPI(originalState: Readonly<HomeState>): Promise<Readonly<HomeState>> {
        const response: HomeAPIResponse | null = await this.effects.fetchHomeJSON();
        return updateState<HomeState>(originalState, { response });
    }

    saveCollections(originalState: Readonly<HomeState>, response: HomeAPIResponse | null): Readonly<HomeState> {
        const collections: Map<CollectionStateKey, Readonly<Collection>> = new Map();
        for (const { set } of getContainers(response)) {
            const collection: Collection = getCollection(set);
            collections.set(collection.id, collection);
        }
        return updateState<HomeState>(originalState, { collections });
    }
}
