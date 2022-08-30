import type { ItemText } from '@disney/features/home/types';
import { getDefaultText } from '../get-default-text/get-default-text.utils';

export function getContentType(text: ItemText): string {
    const { sourceEntity: contentType } = getDefaultText(text);
    return contentType;
}
