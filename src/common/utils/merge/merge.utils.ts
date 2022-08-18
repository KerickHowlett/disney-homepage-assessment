export function merge<TReturn extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>>(
    ...objects: Record<PropertyKey, unknown>[]
): TReturn {
    return Object.assign({}, ...objects);
}
