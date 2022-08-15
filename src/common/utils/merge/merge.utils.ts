export function merge<TReturn extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...objects: Record<PropertyKey, unknown>[]
): TReturn {
    return Object.assign({}, ...objects);
}
