import { isNil } from '@common/utils';
import type { ContentTileComponent } from '@disney/features/home/ui/content-tile';

export type DOMQuery<TBase = ShadowRoot> = TBase | null | undefined;

export function getAppRoot(): DOMQuery {
    return document.querySelector('disney-app')?.shadowRoot;
}

export function getHomeShellRoot(): DOMQuery {
    const app: DOMQuery = getAppRoot();
    return app?.querySelector('disney-home')?.shadowRoot;
}

export function getCollectionsList(): DOMQuery {
    const homeShell: DOMQuery = getHomeShellRoot();
    return homeShell?.querySelector('disney-collections-list')?.shadowRoot;
}

export function getVirtualScrollRootOfCollectionsList(): DOMQuery {
    const collectionsList = getCollectionsList();
    return collectionsList?.querySelector('disney-virtual-scroll')?.shadowRoot;
}

export function getCollections(): HTMLElement[] | undefined {
    const collectionsList: DOMQuery = getCollectionsList();
    if (isNil(collectionsList)) return undefined;
    return Array.from(collectionsList.querySelectorAll('disney-collection'));
}

export function getFirstCollection(): DOMQuery {
    const collections: HTMLElement[] | undefined = getCollections();
    if (isNil(collections)) return;
    return collections[0]?.shadowRoot;
}

export function getFirstCarousel(): DOMQuery {
    return getNthCollection();
}

export function getNthCollection(index?: number): DOMQuery {
    const collections: HTMLElement[] | undefined = getCollections();
    if (isNil(collections)) return undefined;
    const target: number = index || 0;
    return collections[target]?.shadowRoot;
}

export function getCarouselFromNthCollection(index?: number): DOMQuery {
    const collection: DOMQuery = getNthCollection(index);
    if (isNil(collection)) return undefined;
    return collection.querySelector('disney-carousel')?.shadowRoot;
}

export function getSlotOfNthCarousel(index?: number): DOMQuery<HTMLSlotElement> {
    const targetCarousel: DOMQuery = getCarouselFromNthCollection(index);
    if (isNil(targetCarousel)) return;
    return targetCarousel.querySelector('slot');
}

export function getAssignedSlotElementsFromNthCollection(index?: number): DOMQuery<HTMLElement> {
    const slot: DOMQuery<HTMLSlotElement> = getSlotOfNthCarousel(index);
    if (isNil(slot)) return;
    return Array.from(slot.assignedElements())[0] as HTMLElement;
}

export function getContentTilesFromNthCarousel(index?: number): DOMQuery<HTMLElement[]> {
    const assignedSlotElements: DOMQuery<HTMLElement> = getAssignedSlotElementsFromNthCollection(index);
    if (isNil(assignedSlotElements)) return;
    return Array.from(assignedSlotElements.children) as HTMLElement[];
}

export function getNthContentTileFromNthCollection(
    collectionIndex: number,
    contentIndex: number,
): ContentTileComponent | undefined {
    const contentTiles: DOMQuery<HTMLElement[]> = getContentTilesFromNthCarousel(collectionIndex);
    if (isNil(contentTiles)) return;
    return contentTiles[contentIndex] as ContentTileComponent;
}

export function getFullyVisibleTilesFromNthCarousel(index?: number): DOMQuery<ContentTileComponent[]> {
    const contentTiles: DOMQuery<ContentTileComponent[]> = getContentTilesFromNthCarousel(index) as DOMQuery<
        ContentTileComponent[]
    >;
    if (isNil(contentTiles)) return;
    return contentTiles.filter((tile: ContentTileComponent): boolean => {
        return !isNil(tile.shadowRoot?.querySelector('[is-fully-visible="true"]'));
    });
}
