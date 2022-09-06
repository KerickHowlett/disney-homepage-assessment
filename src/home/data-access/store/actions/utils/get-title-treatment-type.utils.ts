import type { ContentImage } from '../../state';
import type { TitleImageType } from './has-title-image-type.utils';
import { hasTitleImageType } from './has-title-image-type.utils';

const TITLE_IMAGE_TYPE: Readonly<Record<TitleImageType, TitleImageType>> = {
    title_treatment: 'title_treatment',
    logo: 'logo',
} as const;

export function getTitleTreatmentType(image: ContentImage): TitleImageType | null {
    if (hasTitleImageType('title_treatment', image)) return TITLE_IMAGE_TYPE.title_treatment;
    if (hasTitleImageType('logo', image)) return TITLE_IMAGE_TYPE.logo;
    return null;
}
