import { isNil } from '@disney/shared';
import { getCollections } from './get-collections.utils';
import type { DOMQuery } from './types';

export function getNthCollection(index?: number): DOMQuery {
    const collections: HTMLElement[] | undefined = getCollections();
    if (isNil(collections)) return undefined;
    const target: number = index || 0;
    return collections[target]?.shadowRoot;
}
