import type { ItemText } from '@disney/features/home/types';
import { getDefaultText } from '../get-default-text/get-default-text.utils';

export function getTitle(text: ItemText): string {
    const { content } = getDefaultText(text);
    return content;
}
