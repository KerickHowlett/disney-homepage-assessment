import type { NavigationState } from '../../../state';
import { getIndexForFullyVisibleContentTileInNthCollection } from './get-index-for-fully-visible-content-tile-in-nth-collection.utils';
import { getVerticallyAlignedContentTileInTargetCollection } from './get-vertically-aligned-content-tile-in-target-collection.utils';

export function getContentIndexInTargetCollection(targetCollectionIndex: number, state: NavigationState): number {
    const { row: originalCollectionIndex, column: targetContentIndex } = state;
    const originalCollectionFullyVisibleIndex: number = getIndexForFullyVisibleContentTileInNthCollection(
        originalCollectionIndex,
        targetContentIndex,
    );

    const { contentIndex } = getVerticallyAlignedContentTileInTargetCollection(
        targetCollectionIndex,
        originalCollectionFullyVisibleIndex,
    );

    return contentIndex;
}
