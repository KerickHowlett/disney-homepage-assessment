import { isUndefined } from '@disney/shared';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function addEventHandlers<T extends HTMLElement>(
    element: T,
    eventHandlers?: Partial<GlobalEventHandlers>,
): void {
    if (isUndefined(eventHandlers)) return;
    for (const [event, handler] of Object.entries(eventHandlers)) {
        (element as any)[event] = handler;
    }
}
