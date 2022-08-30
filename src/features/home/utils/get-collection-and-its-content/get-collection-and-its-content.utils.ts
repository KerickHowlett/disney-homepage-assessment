import type { Collection, ContainerSet, Content } from '../../types';
import { getCollectionId } from '../get-collection-id';
import { getContentAndIds } from '../get-content-and-ids';
import { getTitle } from '../get-title';

export function getCollectionAndItsContent(set: ContainerSet): [Collection, Content[]] {
    const [content, contentIds] = getContentAndIds(set.items);
    const collection: Collection = {
        content: contentIds,
        id: getCollectionId(set),
        title: getTitle(set.text),
        type: set.type,
    };
    return [collection, content];
}
