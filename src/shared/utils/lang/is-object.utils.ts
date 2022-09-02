import { isNil } from './is-nil.utils';

export function isObject(value: unknown): value is object {
    return !isNil(value) && !Array.isArray(value) && typeof value === 'object';
}
