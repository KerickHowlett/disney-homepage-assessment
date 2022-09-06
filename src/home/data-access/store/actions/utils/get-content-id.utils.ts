import type { ContainerItem } from '../../state';
import { hasContentIdType } from './has-content-id-type.utils';

export function getContentId(item: ContainerItem): string {
    if (hasContentIdType('contentId', item)) return item.contentId!;
    if (hasContentIdType('collectionId', item)) return item.collectionId!;
    console.error('No contentId or collectionId found in item', item);
    return '';
}
