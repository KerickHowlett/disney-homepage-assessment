import { isNil } from '@common/utils';
import type { ContainerItem } from '../../types';

export function hasContentIdType(idType: 'contentId' | 'collectionId', item: ContainerItem): boolean {
    return idType in item && !isNil(item[idType]);
}
