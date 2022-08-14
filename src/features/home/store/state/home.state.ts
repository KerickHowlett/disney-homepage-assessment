import { getFrozenMap } from '@common/functions';
import type { Collection, CollectionStateKey, HomeState } from '../../types';

export const initialState: Readonly<HomeState> = {
    collections: getFrozenMap<CollectionStateKey, Readonly<Collection>>(),
    response: null,
};
