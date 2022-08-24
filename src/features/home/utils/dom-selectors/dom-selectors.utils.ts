import { isNil, isNull } from '@common/utils';

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
    const firstCollection: DOMQuery = getFirstCollection();
    if (isNil(firstCollection)) return;
    return firstCollection?.querySelector('disney-carousel')?.shadowRoot;
}

export function getSlotOfFirstCarousel(): DOMQuery<HTMLSlotElement> {
    const firstCarousel: DOMQuery = getFirstCarousel();
    if (isNil(firstCarousel)) return;
    return firstCarousel?.querySelector('slot');
}

export function getItemsPlaceholderOfFirstCarousel(): DOMQuery<Element> {
    const slot: DOMQuery<HTMLSlotElement> = getSlotOfFirstCarousel();
    if (isNil(slot)) return;
    return Array.from(slot.assignedElements())[0];
}

export function getSlottedItemsFromFirstCarousel(): DOMQuery<HTMLElement[]> {
    const itemsPlaceholder: DOMQuery<Element> = getItemsPlaceholderOfFirstCarousel();
    if (isNil(itemsPlaceholder)) return;
    return Array.from(itemsPlaceholder.querySelectorAll<HTMLElement>('disney-content-tile'));
}

export function getInteractiveTilesFromFirstCollection(): HTMLElement[] | undefined {
    const items: DOMQuery<HTMLElement[]> = getSlottedItemsFromFirstCarousel();
    if (isNil(items)) return;
    return items.reduce((interactiveTiles: HTMLElement[], item: HTMLElement): HTMLElement[] => {
        const tileRoot: ShadowRoot = item.shadowRoot!;
        const isInteractive: HTMLElement | null = tileRoot.querySelector('[interactive-tile]');
        return isNull(isInteractive) ? interactiveTiles : [...interactiveTiles, item];
    }, [] as HTMLElement[]);
}
