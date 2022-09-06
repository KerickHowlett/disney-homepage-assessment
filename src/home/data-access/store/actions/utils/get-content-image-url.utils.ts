import { isNull } from '@disney/shared';
import type { ContentImage, ContentImageKeys, ContentImageTileAspectRatio, ContentImageTypes } from '../../state';
import type { GetContentImageURLOptions } from './build-image-url.utils';
import { buildImageURL, DEFAULT_OPTIONS } from './build-image-url.utils';
import { getFirstPropertyValueOfSet } from './get-first-property-value-of-set.utils';
import { getTargetAspectRatio } from './get-target-aspect-ratio.utils';
import { getTargetImageType } from './get-target-image-type.utils';

export function getContentImageURL(
    images: ContentImage,
    imageType: ContentImageKeys,
    imageOptions: Partial<GetContentImageURLOptions> = {},
): string {
    const options: GetContentImageURLOptions = {
        ...DEFAULT_OPTIONS,
        ...imageOptions,
    };

    const targetImageType: ContentImageKeys | null = getTargetImageType(images, imageType);
    if (isNull(targetImageType)) return '';

    const availableAspectRatios: ContentImageTileAspectRatio = images[targetImageType];
    const { aspectRatio } = options;
    const targetAspectRatio: keyof ContentImageTileAspectRatio = getTargetAspectRatio(
        availableAspectRatios,
        aspectRatio,
    );

    const contentTypes: ContentImageTypes = availableAspectRatios[targetAspectRatio];
    const targetContentType: keyof ContentImageTypes = getFirstPropertyValueOfSet(contentTypes);

    const { masterId } = contentTypes[targetContentType].default;
    return buildImageURL(masterId, options);
}
