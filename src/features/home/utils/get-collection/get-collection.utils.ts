import type { Collection, ContainerSet } from '../../types';
import { getCollectionId } from '../get-collection-id';
import { getContent } from '../get-content';
import { getTitle } from '../get-title';

export function getCollection(set: ContainerSet): Collection {
    return {
        id: getCollectionId(set),
        title: getTitle(set.text),
        type: set.type,
        content: getContent(set.items),
    };
}
