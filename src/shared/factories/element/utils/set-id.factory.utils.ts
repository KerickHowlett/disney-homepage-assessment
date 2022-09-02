import { isUndefined } from '@disney/shared';

export function setID<T extends HTMLElement>(element: T, id?: string): void {
    if (isUndefined(id)) return;
    const trimmedID: string = id.trim().replace(/\s/g, '');
    element.setAttribute('id', trimmedID);
}
