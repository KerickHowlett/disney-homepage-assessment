import type { Collection, ContainerSet, Content } from '../../state';
import { getCollectionId } from './get-collection-id.utils';
import { getContentAndIds } from './get-content-and-ids.utils';
import { getTitle } from './get-title.utils';

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
