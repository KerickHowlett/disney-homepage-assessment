import { isNil } from '@disney/shared';
import type { ContainerItem } from '../types';

export type ContentIDType = 'contentId' | 'collectionId';

export function hasContentIdType(idType: ContentIDType, item: ContainerItem): boolean {
    return idType in item && !isNil(item[idType]);
}
