import { isNil } from '@disney/shared';
import type { ContentImage } from '../types';

export type TitleImageType = 'title_treatment' | 'logo';

export function hasTitleImageType(idType: TitleImageType, image: ContentImage): boolean {
    return idType in image && !isNil(image[idType]);
}
