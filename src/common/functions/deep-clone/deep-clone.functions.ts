import { cloneMap } from '../clone-map';
import { isMap } from '../is-map';
import { isPrimitiveValue } from '../is-primitive-value';

// @NOTE: This may need to be later modified to recursively clone nested maps.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepClone<T = any>(originalEntity: T): T {
    if (isPrimitiveValue(originalEntity)) return originalEntity;
    // @NOTE: Not sure why there was such difficulty of getting this to return T
    //        without resorting to type casting.
    if (isMap(originalEntity)) return cloneMap(originalEntity) as unknown as T;
    return structuredClone(originalEntity);
}
