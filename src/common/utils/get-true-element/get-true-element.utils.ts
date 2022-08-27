import { isNil } from '../is-nill';

// @NOTE: Webcomponents can sometimes not register as an element or even as
//        one with actual "mass" (i.e., height & width), so this was written
//        to serve as a tool to find a usable element much easier. This may be
//        due to the nature of ShadowDOMs -- additional research is needed.
export function getTrueElement(item: Element): HTMLElement | null {
    const itemRoot: HTMLElement | ShadowRoot = isNil(item?.shadowRoot) ? (item as HTMLElement) : item.shadowRoot;
    if (isNil(itemRoot)) return null;
    return itemRoot.querySelector('div');
}
