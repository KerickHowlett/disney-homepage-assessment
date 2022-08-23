import type { ContentImageTile, ContentImageTileAspectRatio, ContentTileType } from '@disney/features/home/types';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';

const DEFAULT_ASPECT_RATIO = '1.78';

/**
 * @param aspectRatio
 * @NOTE: Ideally, the aspectRation would have a means to feed this argument,
 *        dynamically.
 */
export function getImageUrl(
    image: ContentImageTile,
    aspectRatio: keyof ContentImageTileAspectRatio = DEFAULT_ASPECT_RATIO,
): string {
    const targetSizedTile: ContentTileType = image.tile[aspectRatio];
    const tileTypeKey: keyof ContentTileType = getOnlyKeyOfSet<ContentTileType>(targetSizedTile);
    return targetSizedTile[tileTypeKey].default.url;
}
