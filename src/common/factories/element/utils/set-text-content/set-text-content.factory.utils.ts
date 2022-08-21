import { isUndefined } from '@common/utils';

export function setTextContent(element: HTMLElement, textContent?: string): void {
    if (isUndefined(textContent)) return;
    element.textContent = textContent;
}
