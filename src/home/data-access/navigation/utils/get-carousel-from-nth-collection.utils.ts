import { isNil } from '@disney/shared';
import { getNthCollection } from './get-nth-collection.utils';
import type { DOMQuery } from './types';

export function getCarouselFromNthCollection(index?: number): DOMQuery {
    const collection: DOMQuery = getNthCollection(index);
    if (isNil(collection)) return undefined;
    return collection.querySelector('disney-carousel')?.shadowRoot;
}
