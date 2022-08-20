import { getFrozenMap } from '@common/utils';
import type { Collection, CollectionStateKey, HomeState } from '../../types';

export function getInitialState(): HomeState {
    return {
        collections: getFrozenMap<CollectionStateKey, Collection>(),
    };
}
