import { isNil } from '@disney/shared';
import { getAssignedSlotElementsFromNthCollection } from './get-assigned-slot-elements-from-nth-collection.utils';
import type { DOMQuery } from './types';

export function getContentTilesFromNthCarousel(index?: number): DOMQuery<HTMLElement[]> {
    const assignedSlotElements: DOMQuery<HTMLElement> = getAssignedSlotElementsFromNthCollection(index);
    if (isNil(assignedSlotElements)) return;
    return Array.from(assignedSlotElements.children) as HTMLElement[];
}
