import { isNil } from '@disney/shared';
import { getCollections } from './get-collections.utils';
import type { DOMQuery } from './types';

export function getFirstCollection(): DOMQuery {
    const collections: HTMLElement[] | undefined = getCollections();
    if (isNil(collections)) return;
    return collections[0]?.shadowRoot;
}
