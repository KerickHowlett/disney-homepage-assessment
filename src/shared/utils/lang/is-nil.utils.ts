import { isNull } from './is-null.utils';
import { isUndefined } from './is-undefined.utils';

export function isNil(value: unknown): value is null | undefined {
    return isUndefined(value) || isNull(value);
}
