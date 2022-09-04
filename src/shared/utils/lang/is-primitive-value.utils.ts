import { isNull } from './is-null.utils';
import { isString } from './is-string.utils';
import { isUndefined } from './is-undefined.utils';

export function isPrimitiveValue(value: unknown): value is null | undefined | string | number | boolean {
    return (
        isNull(value) ||
        isUndefined(value) ||
        isString(value) ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'symbol'
    );
}
