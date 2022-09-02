import type { ContentImage, ContentImageKeys } from '../types';
import { getTitleTreatmentType } from './get-title-treatment-type.utils';

// @NOTE: This is a quick hack since the "collections" (i.e., "Disney Channel Collection")
//        uses "logo" instead of "title_treatment" for the title image property.
export function getTargetImageType(images: ContentImage, imageType: ContentImageKeys): ContentImageKeys | null {
    if (imageType !== 'title_treatment') return imageType;
    return getTitleTreatmentType(images);
}
