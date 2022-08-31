import { isNull, isUndefined } from '@common/utils';
import type { ContentImage, ContentImageTileAspectRatio, ContentTileType } from '@disney/features/home/types';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';
import { getTitleTreatmentType } from '../get-title-treatment-type';
import { TitleImageType } from '../has-title-image-type';

const DEFAULT_ASPECT_RATIO = '1.78';

/**
 * @param aspectRatio
 * @NOTE: Ideally, the aspectRation would have a means to feed this argument,
 *        dynamically.
 */
export function getTitleTreatmentImageURL(
    image: ContentImage,
    aspectRatio: keyof ContentImageTileAspectRatio = DEFAULT_ASPECT_RATIO,
): string {
    const titleTreatmentType: TitleImageType | null = getTitleTreatmentType(image);
    if (isNull(titleTreatmentType)) return '';

    let targetSizedImage: ContentTileType = image[titleTreatmentType][aspectRatio];
    if (isUndefined(targetSizedImage)) {
        const fallbackAspectRation: keyof ContentImageTileAspectRatio = getOnlyKeyOfSet(image[titleTreatmentType]);
        targetSizedImage = image[titleTreatmentType][fallbackAspectRation];
    }

    const imageTypeKey: keyof ContentTileType = getOnlyKeyOfSet(targetSizedImage);
    const jpegURL: string = targetSizedImage[imageTypeKey].default.url;

    return jpegURL.replace('format=jpeg', 'format=png');
}
