// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMap<K = any, T = any>(value: any): value is Map<K, T> {
    return value instanceof Map;
}
