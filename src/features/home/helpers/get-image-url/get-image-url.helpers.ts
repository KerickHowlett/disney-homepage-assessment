import type { ContentImageTile, ContentImageTileAspectRatio, ContentTileType } from '@disney/features/home/types';
import { TARGET_ASPECT_RATIO } from '../../constants';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';

/**
 * @param aspectRatio
 * @NOTE: Ideally, the aspectRation would have a means to feed this argument,
 *        dynamically.
 */
export function getImageUrl(
    image: ContentImageTile,
    aspectRatio: keyof ContentImageTileAspectRatio = TARGET_ASPECT_RATIO,
): string {
    const targetSizedTile: ContentTileType = image.tile[aspectRatio];
    const tileTypeKey: keyof ContentTileType = getOnlyKeyOfSet<ContentTileType>(targetSizedTile);
    return targetSizedTile[tileTypeKey].default.url;
}
