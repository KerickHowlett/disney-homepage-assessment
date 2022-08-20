import { Singleton } from '@common/decorators';
import { updateState } from '@common/utils';
import { getCollection, getContainers, getContent, getItemsFromSetRefAPIResponse } from '../../helpers';
import type {
    Collection,
    CollectionId,
    CollectionsState,
    CollectionStateKey,
    ContainerItem,
    Content,
    HomeAPIResponse,
    HomeState,
    RefId,
    SetRefAPIResponse,
} from '../../types';
import { HomeEffects } from '../effects';

type UpdatedCollections = Map<CollectionStateKey, Collection>;

@Singleton()
export class HomeActions {
    constructor(private readonly effects: HomeEffects = new HomeEffects()) {}

    async fetchHomeAPI(originalState: Readonly<HomeState>): Promise<Readonly<HomeState>> {
        const response: HomeAPIResponse | null = await this.effects.fetchHomeJSON();
        const collections: CollectionsState = this.saveCollections(response);
        return updateState<HomeState>(originalState, { collections });
    }

    async fetchPersonalizedCuratedSet(originalState: Readonly<HomeState>, refId: RefId): Promise<Readonly<HomeState>> {
        const response: SetRefAPIResponse | null = await this.effects.fetchHomeJSONByRefId(refId);
        const collections: CollectionsState = this.saveContentForPersonalizedCollection(
            originalState.collections,
            refId,
            response,
        );
        return updateState<HomeState>(originalState, { collections });
    }

    saveCollections(response: HomeAPIResponse): CollectionsState {
        const collections: Map<CollectionStateKey, Readonly<Collection>> = new Map<
            CollectionStateKey,
            Readonly<Collection>
        >();
        for (const { set } of getContainers(response)) {
            const collection: Collection = getCollection(set);
            collections.set(collection.id, collection);
        }
        return Object.freeze(collections);
    }

    saveContentForPersonalizedCollection(
        originalCollectionState: CollectionsState,
        collectionId: CollectionId,
        response: SetRefAPIResponse,
    ): CollectionsState {
        const items: ContainerItem[] = getItemsFromSetRefAPIResponse(response);
        const content: Content[] = getContent(items);

        const originalCollection: Collection = originalCollectionState.get(collectionId) as Collection;
        const updatedCollection: Collection = Object.assign({}, originalCollection, { content });

        const updatedCollections: UpdatedCollections = structuredClone(originalCollectionState) as UpdatedCollections;
        updatedCollections.set(collectionId, updatedCollection);
        return updatedCollections;
    }
}
