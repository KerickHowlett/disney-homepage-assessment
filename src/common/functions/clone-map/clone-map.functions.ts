export function cloneMap<K = unknown, T = unknown>(originalMap: ReadonlyMap<K, T>): Map<K, T> {
    const clonedMap: Map<K, T> = new Map<K, T>();
    originalMap.forEach((value: T, key: K): void => {
        clonedMap.set(key, structuredClone<T>(value));
    });
    return clonedMap;
}
