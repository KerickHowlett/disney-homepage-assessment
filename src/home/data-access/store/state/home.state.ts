import { getFrozenMap } from '@disney/shared';
import type { Collection, CollectionsState, CollectionStateKey, Content, ContentState, ContentStateKey } from './types';

export interface HomeState {
    readonly collections: CollectionsState;
    readonly content: ContentState;
}

export function getInitialHomeStoreState(): HomeState {
    return {
        collections: getFrozenMap<CollectionStateKey, Collection>(),
        content: getFrozenMap<ContentStateKey, Content>(),
    };
}
