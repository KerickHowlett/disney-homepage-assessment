export function getFrozenMap<K = string, D = unknown>(initialData?: ReadonlyArray<[K, D]>): ReadonlyMap<K, D> {
    return Object.freeze<Map<K, D>>(new Map<K, D>(initialData));
}
