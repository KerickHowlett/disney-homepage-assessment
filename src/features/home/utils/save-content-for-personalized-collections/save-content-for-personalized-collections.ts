import type {
    CollectionId,
    CollectionsState,
    ContainerItem,
    ContentState,
    HomeState,
    MutableContent,
    SetRefAPIResponse,
} from '../../types';
import { getContentAndIds } from '../get-content-and-ids';
import { getItemsFromSetRefAPIResponse } from '../get-items-from-set-ref-api-response';
import { mapOutContentState } from '../map-out-content-state';
import { updateCollectionStateById } from '../update-collection-state-by-id/update-collection-state-by-id.utils';

export function saveContentForPersonalizedCollection(
    originalState: HomeState,
    collectionId: CollectionId,
    response: SetRefAPIResponse,
): Readonly<HomeState> {
    const items: ContainerItem[] = getItemsFromSetRefAPIResponse(response);
    const [pluckedContent, contentIds] = getContentAndIds(items);

    const collectionsState: CollectionsState = updateCollectionStateById(
        collectionId,
        { content: contentIds },
        originalState.collections,
    );
    const contentState: ContentState = mapOutContentState(pluckedContent, originalState.content as MutableContent);

    return Object.freeze({
        content: contentState,
        collections: collectionsState,
    });
}
