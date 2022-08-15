import type { RootHTML } from '@common/types';

export function getRootHTML(this: HTMLElement, enableShadowDOM = true): RootHTML {
    if (enableShadowDOM) {
        return this.attachShadow({ mode: 'open' });
    }
    return this;
}
