import { getAppRoot } from './get-app-root.utils';
import type { DOMQuery } from './types';

export function getHomeElement(): DOMQuery {
    const app: DOMQuery = getAppRoot();
    return app?.querySelector('disney-home')?.shadowRoot;
}
