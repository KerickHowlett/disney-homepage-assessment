import type { FullText, Text } from '@disney/features/home/types';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';

export function getTitle(text: Text): string {
    const key: keyof FullText = getOnlyKeyOfSet<FullText>(text.title.full);
    return text.title.full[key].default.content;
}
