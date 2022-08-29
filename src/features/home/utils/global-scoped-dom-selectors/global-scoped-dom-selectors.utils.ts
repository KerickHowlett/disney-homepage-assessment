import { isNil } from '@common/utils';

export type DOMQuery<TBase = ShadowRoot> = TBase | null | undefined;

export function getAppRoot(): DOMQuery {
    return document.querySelector('disney-app')?.shadowRoot;
}

export function getHomeShellRoot(): DOMQuery {
    return getAppRoot()?.querySelector('disney-home')?.shadowRoot;
}

export function getCollectionsList(): DOMQuery {
    return getHomeShellRoot()?.querySelector('disney-collections-list')?.shadowRoot;
}

export function getVirtualScrollRoot(): DOMQuery {
    return getCollectionsList()?.querySelector('disney-virtual-scroll')?.shadowRoot;
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

export function getFullyVisibleTilesFromNthCarousel(index?: number): DOMQuery<HTMLElement[]> {
    const contentTiles: DOMQuery<HTMLElement[]> = getContentTilesFromNthCarousel(index);
    if (isNil(contentTiles)) return;
    return contentTiles.filter(
        // @NOTE: The 'fully-visible' class is set in the carousel component.
        (tile: HTMLElement): boolean => !isNil(tile.shadowRoot?.querySelector('.fully-visible')),
    );
}
