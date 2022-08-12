import type { Collection, ContainerSet } from '../../types';
import { getCollectionId } from '../get-collection-id';
import { getContentState } from '../get-content-state';
import { getTitle } from '../get-title';

export function getCollection(set: ContainerSet): Collection {
    return {
        id: getCollectionId(set),
        title: getTitle(set.text),
        type: set.type,
        content: getContentState(set.items),
    };
}
