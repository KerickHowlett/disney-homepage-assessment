import { getFrozenMap } from '@common/utils';
import type { Collection, CollectionStateKey, Content, ContentStateKey, HomeState } from '../../../types';

export function getInitialHomeStoreState(): HomeState {
    return {
        collections: getFrozenMap<CollectionStateKey, Collection>(),
        content: getFrozenMap<ContentStateKey, Content>(),
    };
}
