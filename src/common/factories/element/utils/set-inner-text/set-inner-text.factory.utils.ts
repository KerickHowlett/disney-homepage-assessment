import { isUndefined } from '@common/utils';

export function setInnerText(element: HTMLElement, innerText?: string): void {
    if (isUndefined(innerText)) return;
    element.innerText = innerText.trim();
}
