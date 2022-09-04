import type { ContentTileComponent } from '@disney/home/features';
import { isNil } from '@disney/shared';
import { getContentTilesFromNthCarousel } from './get-content-tiles-from-nth-carousel.utils';
import type { DOMQuery } from './types';

export function getFullyVisibleTilesFromNthCarousel(index?: number): DOMQuery<ContentTileComponent[]> {
    const contentTiles: DOMQuery<ContentTileComponent[]> = getContentTilesFromNthCarousel(index) as DOMQuery<
        ContentTileComponent[]
    >;
    if (isNil(contentTiles)) return;
    return contentTiles.filter((tile: ContentTileComponent): boolean => {
        return !isNil(tile.shadowRoot?.querySelector('[is-fully-visible="true"]'));
    });
}
