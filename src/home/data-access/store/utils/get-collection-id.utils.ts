import { isUndefined } from '@disney/shared';
import type { CollectionId, ContainerSet } from '../types';

export function getCollectionId(set: Readonly<ContainerSet>): CollectionId {
    if (!isUndefined(set.setId)) return set.setId;
    if (!isUndefined(set.refId)) return set.refId;
    throw new Error('No setId or refId was found!');
}
