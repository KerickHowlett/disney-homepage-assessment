import { isEmpty, isUndefined } from '@common/utils';

export function addClasses<T extends HTMLElement>(element: T, classes?: string[]): void {
    if (isUndefined(classes) || isEmpty(classes)) return;
    for (const className of classes) {
        if (element.classList.contains(className)) continue;
        element.classList.add(className);
    }
}
