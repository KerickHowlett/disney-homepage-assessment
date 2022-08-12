import { isUndefined } from '@common/functions';
import type { CollectionId, ContainerSet } from '@disney/features/home/types';

export function getCollectionId(set: Readonly<ContainerSet>): CollectionId {
    if (!isUndefined(set.setId)) return set.setId;
    if (!isUndefined(set.refId)) return set.refId;
    throw new Error('No setId or refId was found!');
}
