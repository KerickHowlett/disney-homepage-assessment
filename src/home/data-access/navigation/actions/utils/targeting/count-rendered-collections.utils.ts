import { getCollectionsList } from '../dom-queries';

export function countRenderedCollections(): number {
    const collectionsList: ShadowRoot = getCollectionsList()!;
    const collections: NodeListOf<HTMLElement> = collectionsList.querySelectorAll('disney-collection');
    return collections.length;
}
