import type { ItemText } from '../types';
import { getDefaultText } from './get-default-text.utils';

export function getContentType(text: ItemText): string {
    const { sourceEntity: contentType } = getDefaultText(text);
    return contentType;
}
