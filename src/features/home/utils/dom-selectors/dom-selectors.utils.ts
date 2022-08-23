import { isNil, isUndefined } from '@common/utils';

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

export function getAllContentTilesInCollection(index: number): HTMLElement[] | undefined {
    const collections: HTMLElement[] | undefined = getCollections();
    if (isNil(collections)) return undefined;
    const contentTileNodeList: NodeListOf<Element> | undefined =
        collections[index].shadowRoot?.querySelectorAll('disney-content-tile');
    if (isUndefined(contentTileNodeList)) return undefined;
    return Array.from(contentTileNodeList) as HTMLElement[];
}
