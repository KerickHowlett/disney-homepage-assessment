import { getFrozenMap } from '@common/utils';
import type { Collection, CollectionStateKey, HomeState } from '../../types';

export function getInitialState(): HomeState {
    return {
        response: null,
        collections: getFrozenMap<CollectionStateKey, Collection>(),
    };
}
