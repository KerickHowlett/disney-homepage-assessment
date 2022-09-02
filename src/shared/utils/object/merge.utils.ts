import type { ValueOf } from '@disney/shared/types';
import { isMap, isPrimitiveValue, isUndefined } from '../lang';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectifiedMap = { [k: string]: any };
type OrArray<T> = T | T[];
type UnknownMap = Map<string | number, unknown>;

export function merge<T extends AnyObject = AnyObject, R extends T = T>(
    firstObject: T = {} as T,
    secondObject: AnyObject = {},
): R {
    if (eitherAreUndefined(firstObject, secondObject)) {
        return Object.assign({}, firstObject, secondObject) as R;
    }

    const mergedObject: AnyObject = structuredClone(firstObject);
    for (const key of Object.keys(secondObject)) {
        const firstValue: ValueOf<T> = firstObject[key];
        const secondValue: ValueOf<T> = secondObject[key];

        if (bothArePrimitiveValues(firstValue, secondValue)) {
            mergedObject[key] = secondValue;
            continue;
        }
        if (eitherAreArrays(firstValue, secondValue)) {
            deepMergeArrays(firstValue, secondValue, mergedObject, key);
            continue;
        }
        if (bothAreMaps(firstValue, secondValue)) {
            deepMergeMaps(firstValue, secondValue, mergedObject, key);
            continue;
        }
        mergedObject[key] = merge<T, R>(firstValue, secondValue);
    }

    return mergedObject as R;
}

// Helpers
function bothAreMaps<T extends AnyObject>(firstValue: T, secondValue: T): boolean {
    return isMap(firstValue) && isMap(secondValue);
}

function bothAreUndefined<T extends AnyObject>(firstValue: T, secondValue: T): boolean {
    return isUndefined(firstValue) && isUndefined(secondValue);
}

function bothArePrimitiveValues<T extends AnyObject>(firstValue: T, secondValue: T): boolean {
    return isPrimitiveValue(firstValue) && isPrimitiveValue(secondValue);
}

function eitherAreArrays<T extends AnyObject>(firstValue: OrArray<T>, secondValue: OrArray<T>): boolean {
    return Array.isArray(firstValue) || Array.isArray(secondValue);
}

function eitherAreUndefined<T extends AnyObject>(firstValue: T, secondValue: T): boolean {
    return isUndefined(firstValue) || isUndefined(secondValue);
}

function deepMergeMaps(
    firstValue: UnknownMap,
    secondValue: UnknownMap,
    mergedObject: AnyObject,
    key: keyof typeof mergedObject,
): void {
    const firstObjectifiedMap: ObjectifiedMap = Object.fromEntries(firstValue);
    const secondObjectifiedMap: ObjectifiedMap = Object.fromEntries(secondValue);
    const mergedObjectifiedMap: ObjectifiedMap = merge(firstObjectifiedMap, secondObjectifiedMap);
    mergedObject[key] = new Map(Object.entries(mergedObjectifiedMap));
}

function deepMergeArrays(
    firstValue: unknown[],
    secondValue: unknown[],
    mergedObject: AnyObject,
    key: keyof typeof mergedObject,
): void {
    const arrayToMap: unknown[] = firstValue || secondValue;
    mergedObject[key] = arrayToMap.map((_: unknown, index: number) => {
        if (bothAreUndefined(firstValue, secondValue)) return;
        if (eitherAreUndefined(firstValue, secondValue)) {
            const value: unknown[] = firstValue || secondValue;
            return value[index];
        }
        return merge(firstValue[index] as AnyObject, secondValue[index] as AnyObject);
    });
}
