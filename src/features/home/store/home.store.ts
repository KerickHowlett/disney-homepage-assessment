import { Singleton } from '@common/decorators';
import { Callback } from '@common/types';
import { isUndefined } from '@common/utils';
import { HOME_STATE_EVENTS, OnHomeAction } from '../constants';
import { byHavingContent, byPersonalizedCollections, byStandardCollections } from '../helpers';
import type { Collection, CollectionStateKey } from '../types';
import { HomeReducer } from './reducer';

const { LOAD_STANDARD_COLLECTIONS, LOAD_PERSONALIZED_COLLECTION } = OnHomeAction;

@Singleton()
export class HomeStore {
    constructor(private readonly reducer: HomeReducer = new HomeReducer()) {}

    get collections(): Collection[] {
        return Array.from(this.state.collections.values());
    }

    get collectionsWithContent(): Collection[] {
        return this.collections.filter(byHavingContent);
    }

    get personalizedCollections(): Collection[] {
        return this.collections.filter(byPersonalizedCollections);
    }

    get standardCollections(): Collection[] {
        return this.collections.filter(byStandardCollections);
    }

    get state() {
        return this.reducer.state;
    }

    getCollection(id: CollectionStateKey): Readonly<Collection> | undefined {
        const collection: Collection | undefined = this.reducer.state.collections.get(id);
        if (isUndefined(collection)) {
            console.error(`[Collection Not Found]: ${id}`);
        }
        return collection;
    }

    *lazyLoadPersonalCollection(): Generator<void, void, void> {
        for (const { id: refId } of this.personalizedCollections) {
            this.reducer.on(LOAD_PERSONALIZED_COLLECTION, refId);
            yield;
        }
    }

    loadStandardCollections(): void {
        this.reducer.on(LOAD_STANDARD_COLLECTIONS);
    }

    subscribe(callback: Callback): void {
        this.reducer.subscribe(HOME_STATE_EVENTS, callback);
    }

    unsubscribe(callback: Callback): void {
        this.reducer.unsubscribe(HOME_STATE_EVENTS, callback);
    }
}
