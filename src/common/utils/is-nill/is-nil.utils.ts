import { isNull } from '../is-null';
import { isUndefined } from '../is-undefined';

export function isNil(value: unknown): value is null | undefined {
    return isUndefined(value) || isNull(value);
}
