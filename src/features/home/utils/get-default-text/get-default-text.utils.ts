import type { DefaultText, FullText, ItemText } from '../../types';
import { getFirstPropertyValueOfSet } from '../get-first-property-value-of-set';

export function getDefaultText(text: ItemText): DefaultText {
    const key: keyof FullText = getFirstPropertyValueOfSet<FullText>(text.title.full);
    return text.title.full[key].default;
}
