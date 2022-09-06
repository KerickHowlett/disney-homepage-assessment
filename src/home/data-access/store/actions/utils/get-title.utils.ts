import type { ItemText } from '../../state';
import { getDefaultText } from './get-default-text.utils';

export function getTitle(text: ItemText): string {
    const { content } = getDefaultText(text);
    return content;
}
