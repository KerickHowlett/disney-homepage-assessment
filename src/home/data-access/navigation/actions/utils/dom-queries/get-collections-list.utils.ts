import { getHomeElement } from './get-home-element.utils';
import type { DOMQuery } from './types';

export function getCollectionsList(): DOMQuery {
    const homeShell: DOMQuery = getHomeElement();
    return homeShell?.querySelector('disney-collections-list')?.shadowRoot;
}
