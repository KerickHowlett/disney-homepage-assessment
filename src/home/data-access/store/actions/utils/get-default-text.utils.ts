import type { DefaultText, FullText, ItemText } from '../../state';
import { getFirstPropertyValueOfSet } from './get-first-property-value-of-set.utils';

export function getDefaultText(text: ItemText): DefaultText {
    const key: keyof FullText = getFirstPropertyValueOfSet<FullText>(text.title.full);
    return text.title.full[key].default;
}
