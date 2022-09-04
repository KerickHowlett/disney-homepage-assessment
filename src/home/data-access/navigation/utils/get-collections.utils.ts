import { isNil } from '@disney/shared';
import { getCollectionsList } from './get-collections-list.utils';
import type { DOMQuery } from './types';

export function getCollections(): HTMLElement[] | undefined {
    const collectionsList: DOMQuery = getCollectionsList();
    if (isNil(collectionsList)) return undefined;
    return Array.from(collectionsList.querySelectorAll('disney-collection'));
}
