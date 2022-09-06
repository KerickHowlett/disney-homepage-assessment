import { isNil } from '@disney/shared';
import { getCarouselFromNthCollection } from './get-carousel-from-nth-collection.utils';
import type { DOMQuery } from './types';

export function getSlotOfNthCarousel(index?: number): DOMQuery<HTMLSlotElement> {
    const targetCarousel: DOMQuery = getCarouselFromNthCollection(index);
    if (isNil(targetCarousel)) return;
    return targetCarousel.querySelector('slot');
}
