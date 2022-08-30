import type { DefaultText, FullText, ItemText } from '../../types';
import { getOnlyKeyOfSet } from '../get-only-key-of-set';

export function getDefaultText(text: ItemText): DefaultText {
    const key: keyof FullText = getOnlyKeyOfSet<FullText>(text.title.full);
    return text.title.full[key].default;
}
