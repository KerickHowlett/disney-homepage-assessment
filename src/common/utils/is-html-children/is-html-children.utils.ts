import { isEmpty } from '../is-empty';
import { isHTMLElement } from '../is-html-element';
import { isNode } from '../is-node';

export function isHTMLChildren(value: unknown): value is HTMLElement[] {
    const isHTMLElementOrNode = (item: unknown): item is HTMLElement | Node => isHTMLElement(item) || isNode(item);
    return Array.isArray(value) && !isEmpty(value) && value.every(isHTMLElementOrNode);
}
