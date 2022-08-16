import { Singleton } from '@common/decorators';
import { Callback } from '@common/types';
import { isNull } from '@common/utils';
import { HOME_STATE_EVENTS, OnHomeAction } from '../constants';
import type { Collection, CollectionId, CollectionStateKey } from '../types';
import { HomeReducer } from './reducer';

const { FETCH_HOME_API, SAVE_COLLECTIONS } = OnHomeAction;

@Singleton()
export class HomeStore {
    constructor(private readonly reducer: HomeReducer = new HomeReducer()) {}
    getCollectionIds(): ReadonlyArray<CollectionStateKey> {
        if (isNull(this.reducer.state.collections)) return [];
        return Array.from<CollectionId>(this.reducer.state.collections.keys());
    }

    getCollection(id: CollectionStateKey | string): Readonly<Collection> | undefined {
        return this.reducer.state.collections.get(id);
    }

    get state() {
        return this.reducer.state;
    }

    effect$(callback: Callback): void {
        this.reducer.subscribe(HOME_STATE_EVENTS, callback);
    }

    init(): void {
        this.reducer.on(FETCH_HOME_API).then(() => this.reducer.on(SAVE_COLLECTIONS, this.state.response));
    }
}
