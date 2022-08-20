import type { FullText, ItemText } from '@disney/features/home/types';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';

export function getTitle(text: ItemText): string {
    const key: keyof FullText = getOnlyKeyOfSet<FullText>(text.title.full);
    return text.title.full[key].default.content;
}
