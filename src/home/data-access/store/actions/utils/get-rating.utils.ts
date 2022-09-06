import { isEmpty, isUndefined } from '@disney/shared';
import type { Rating } from '../../state';

export function getRating(ratings?: ReadonlyArray<Rating>): string {
    if (isUndefined(ratings) || isEmpty(ratings)) return '';
    return ratings?.[0]?.value || '';
}
