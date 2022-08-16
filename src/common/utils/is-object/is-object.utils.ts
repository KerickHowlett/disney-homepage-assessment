import { isNull } from '../is-null';

export function isObject(value: unknown): value is object {
    return typeof value === 'object' && !isNull(value);
}
