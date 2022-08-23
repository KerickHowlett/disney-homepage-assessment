import { Singleton } from '@common/decorators';
import type { Action, OnAction } from '@common/types';
import { updateState } from '@common/utils';
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
} from '../../../types';
import { getCollection, getContainers, getContent, getItemsFromSetRefAPIResponse } from '../../../utils';
import { HomeEffects } from '../effects';

export type LoadStandardCollections = Action<'LOAD_STANDARD_COLLECTIONS'>;
export type LoadPersonalizedCollection = Action<'LOAD_PERSONALIZED_COLLECTION', RefId>;

export type AllHomeActions = LoadStandardCollections | LoadPersonalizedCollection;

export type HomeActionTypes = AllHomeActions['type'];
export type HomeActionPayloads = AllHomeActions['payload'];

export const OnHomeAction: OnAction<HomeActionTypes> = {
    LOAD_STANDARD_COLLECTIONS: 'LOAD_STANDARD_COLLECTIONS',
    LOAD_PERSONALIZED_COLLECTION: 'LOAD_PERSONALIZED_COLLECTION',
} as const;

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
