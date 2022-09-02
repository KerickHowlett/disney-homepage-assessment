import { isEmpty, isUndefined } from '@disney/shared';

export function appendChildren<T extends HTMLElement = HTMLDivElement>(element: T, ...children: HTMLElement[]): void {
    if (isUndefined(children) || isEmpty(children)) return;
    children.forEach((childElement: HTMLElement) => element.appendChild(childElement));
}
