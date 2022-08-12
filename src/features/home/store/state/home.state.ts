import { getFrozenMap } from '@common/functions';
import type { Collection, CollectionStateKey, Content, ContentStateKey, HomeState } from '../../types';

export const initialState: Readonly<HomeState> = {
    collections: getFrozenMap<CollectionStateKey, Readonly<Collection>>(),
    content: getFrozenMap<ContentStateKey, Readonly<Content>>(),
    response: null,
};
