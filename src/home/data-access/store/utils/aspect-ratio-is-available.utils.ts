import type { ContentImageTileAspectRatio } from '../types';

export function aspectRatioIsAvailable(
    aspectRatios: ContentImageTileAspectRatio,
    target: keyof ContentImageTileAspectRatio,
): boolean {
    const aspectRatioKeys: Array<keyof ContentImageTileAspectRatio> = Object.keys(aspectRatios || {}) as Array<
        keyof ContentImageTileAspectRatio
    >;
    return aspectRatioKeys.includes(target);
}
