import { isNil } from '@disney/shared';
import { getContentTilesFromNthCarousel } from '../dom-queries/get-content-tiles-from-nth-carousel.utils';
import type { DOMQuery } from '../dom-queries/types';

export function countContentTilesInCurrentCollection(collectionIndex: number): number {
    const totalTilesFromCurrentCollection: DOMQuery<HTMLElement[]> = getContentTilesFromNthCarousel(
        collectionIndex - 1,
    );
    if (isNil(totalTilesFromCurrentCollection)) return 0;
    return totalTilesFromCurrentCollection.length;
}
