import { isNull, isUndefined } from '@common/utils';
import type { ContentImage, ContentImageTileAspectRatio, ContentImageTypes } from '@disney/features/home/types';
import { getFirstPropertyValueOfSet } from '../get-first-property-value-of-set';
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

    let targetSizedImage: ContentImageTypes = image[titleTreatmentType][aspectRatio];
    if (isUndefined(targetSizedImage)) {
        const fallbackAspectRatio: keyof ContentImageTileAspectRatio = getFirstPropertyValueOfSet(
            image[titleTreatmentType],
        );
        targetSizedImage = image[titleTreatmentType][fallbackAspectRatio];
    }

    const imageTypeKey: keyof ContentImageTypes = getFirstPropertyValueOfSet(targetSizedImage);
    const jpegURL: string = targetSizedImage[imageTypeKey].default.url;

    return jpegURL.replace('format=jpeg', 'format=png');
}
