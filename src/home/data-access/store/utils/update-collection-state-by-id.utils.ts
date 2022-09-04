import type { Collection, CollectionsState, CollectionStateKey, MutableCollections } from '../home.state';

export function updateCollectionStateById(
    collectionId: CollectionStateKey,
    collectionBody: Partial<Collection>,
    originalCollectionsState: CollectionsState,
): CollectionsState {
    const collectionsState: MutableCollections = structuredClone(originalCollectionsState) as MutableCollections;
    const originalCollection: Collection = collectionsState.get(collectionId)!;

    const updatedCollection: Collection = Object.assign({}, originalCollection, collectionBody);
    collectionsState.set(collectionId, updatedCollection);

    return collectionsState;
}
