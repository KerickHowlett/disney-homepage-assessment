import type { ContentImageTileAspectRatio } from '../../state';
import { aspectRatioIsAvailable } from './aspect-ratio-is-available.utils';
import { getFirstPropertyValueOfSet } from './get-first-property-value-of-set.utils';

export function getTargetAspectRatio(
    aspectRatios: ContentImageTileAspectRatio,
    target: keyof ContentImageTileAspectRatio,
): keyof ContentImageTileAspectRatio {
    if (aspectRatioIsAvailable(aspectRatios, target)) return target;
    return getFirstPropertyValueOfSet(aspectRatios);
}
