import { isMap } from './is-map.utils';
import { isNil } from './is-nil.utils';
import { isObject } from './is-object.utils';
import { isString } from './is-string.utils';

export function isEmpty(value: unknown): boolean {
    if (isNil(value)) return true;
    if (isMap(value)) return value.size === 0;
    if (isObject(value)) return Object.keys(value).length === 0;
    if (isString(value) || Array.isArray(value)) return value.length === 0;
    return false;
}
