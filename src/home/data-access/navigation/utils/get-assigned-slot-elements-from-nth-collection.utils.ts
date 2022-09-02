import { isNil } from '@disney/shared';
import { getSlotOfNthCarousel } from './get-slot-of-nth-carousel.utils';
import type { DOMQuery } from './types';

export function getAssignedSlotElementsFromNthCollection(index?: number): DOMQuery<HTMLElement> {
    const slot: DOMQuery<HTMLSlotElement> = getSlotOfNthCarousel(index);
    if (isNil(slot)) return;
    return Array.from(slot.assignedElements())[0] as HTMLElement;
}
