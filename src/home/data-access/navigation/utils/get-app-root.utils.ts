import type { DOMQuery } from './types';

export function getAppRoot(): DOMQuery {
    return document.querySelector('disney-app')?.shadowRoot;
}
