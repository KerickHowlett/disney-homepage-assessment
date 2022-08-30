import { isEmpty, isUndefined } from '@common/utils';
import type { Rating } from '../../types';

export function getRating(ratings?: ReadonlyArray<Rating>): string {
    if (isUndefined(ratings) || isEmpty(ratings)) return '';
    return ratings?.[0]?.value || '';
}
