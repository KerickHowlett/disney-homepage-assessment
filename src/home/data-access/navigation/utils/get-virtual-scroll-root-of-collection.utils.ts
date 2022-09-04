import { getCollectionsList } from './get-collections-list.utils';
import type { DOMQuery } from './types';

export function getVirtualScrollRootOfCollectionsList(): DOMQuery {
    const collectionsList = getCollectionsList();
    return collectionsList?.querySelector('disney-virtual-scroll')?.shadowRoot;
}
