import type { ContentTileComponent } from '@disney/home/features';
import { isNil, isUndefined } from '@disney/shared';
import type { DOMQuery } from '../dom-queries';
import { getFullyVisibleTilesFromNthCarousel } from '../dom-queries';

const DEFAULT_CONTENT_ID: ContentTileComponent = { contentIndex: 1 } as ContentTileComponent;

export function getVerticallyAlignedContentTileInTargetCollection(
    targetCollectionIndex: number,
    originalCollectionFullyVisibleIndex: number,
): ContentTileComponent {
    const fullyVisibleTilesFromTargetCollection: DOMQuery<ContentTileComponent[]> = getFullyVisibleTilesFromNthCarousel(
        targetCollectionIndex - 1,
    );
    if (isNil(fullyVisibleTilesFromTargetCollection)) return DEFAULT_CONTENT_ID;

    const selectedContentElement: ContentTileComponent =
        fullyVisibleTilesFromTargetCollection[originalCollectionFullyVisibleIndex];
    if (isUndefined(selectedContentElement)) return DEFAULT_CONTENT_ID;

    return fullyVisibleTilesFromTargetCollection[originalCollectionFullyVisibleIndex];
}
