import type { ContentTileComponent } from '@disney/home/features';
import { clamp, isNil } from '@disney/shared';
import type { DOMQuery } from '../dom-queries';
import { getFullyVisibleTilesFromNthCarousel } from '../dom-queries';

export function getIndexForFullyVisibleContentTileInNthCollection(
    collectionIndex: number,
    targetContentIndex: number,
): number {
    const fullyVisibleTilesFromOriginalCollection: DOMQuery<ContentTileComponent[]> =
        getFullyVisibleTilesFromNthCarousel(collectionIndex - 1);
    if (isNil(fullyVisibleTilesFromOriginalCollection)) return 0;

    const index: number = fullyVisibleTilesFromOriginalCollection.findIndex(
        (contentTile: ContentTileComponent): boolean => targetContentIndex === contentTile.contentIndex,
    );

    return clamp(index, 0, fullyVisibleTilesFromOriginalCollection.length - 1);
    // return index === -1 ? 0 : index;
}
