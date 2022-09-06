import type { ContentTileComponent } from '@disney/home/features';
import { isNil } from '@disney/shared';
import { getContentTilesFromNthCarousel } from './get-content-tiles-from-nth-carousel.utils';
import type { DOMQuery } from './types';

export function getNthContentTileFromNthCollection(
    collectionIndex: number,
    contentIndex: number,
): ContentTileComponent | undefined {
    const contentTiles: DOMQuery<HTMLElement[]> = getContentTilesFromNthCarousel(collectionIndex);
    if (isNil(contentTiles)) return;
    return contentTiles[contentIndex] as ContentTileComponent;
}
