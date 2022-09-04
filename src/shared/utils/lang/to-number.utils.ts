import { isEmpty } from './is-empty.utils';
import { isNil } from './is-nil.utils';
import { isString } from './is-string.utils';

export function toNumber(value?: number | string | null): number {
    if (isNil(value)) return -1;
    if (Number.isInteger(value)) return value as number;
    if (!isString(value)) return -1;
    if (isEmpty(value)) return -1;
    const index: number = parseInt(value);
    if (isNaN(index)) return -1;
    return index;
}
