import type { ItemText } from '../types';
import { getDefaultText } from './get-default-text.utils';

export function getTitle(text: ItemText): string {
    const { content } = getDefaultText(text);
    return content;
}
