import type { Callback, StateReducer } from '@disney/shared';
import { isUndefined, Singleton } from '@disney/shared';
import { createReducer } from '@disney/shared/state/create-reducer.state';
import {
    loadHomeAPIAction,
    loadPersonalizedCuratedSetAction,
    LOAD_PERSONALIZED_COLLECTION,
    LOAD_STANDARD_COLLECTIONS,
} from './actions';
import type { Collection, CollectionStateKey, Content, HomeState } from './state';
import { ContentStateKey, getInitialHomeStoreState } from './state';
import { byHavingContent, byHavingNoContent, byPersonalizedCollections, byStandardCollections } from './utils';

const HOME_STORE_NAME = 'Home Store';

@Singleton()
export class HomeStore {
    private readonly reducer: StateReducer<HomeState>;

    constructor() {
        this.reducer = createReducer<HomeState>(
            HOME_STORE_NAME,
            getInitialHomeStoreState(),
            loadHomeAPIAction,
            loadPersonalizedCuratedSetAction,
        );
    }

    get collections(): Collection[] {
        return Array.from(this.state.collections.values());
    }

    get collectionsWithContent(): Collection[] {
        return this.collections.filter(byHavingContent);
    }

    get collectionsWithNoContent(): Collection[] {
        return this.collections.filter(byHavingNoContent);
    }

    get personalizedCollections(): Collection[] {
        return this.collections.filter(byPersonalizedCollections);
    }

    get standardCollections(): Collection[] {
        return this.collections.filter(byStandardCollections);
    }

    get state(): HomeState {
        return this.reducer.state;
    }

    getCollection(id: CollectionStateKey): Readonly<Collection> | undefined {
        const collection: Collection | undefined = this.state.collections.get(id);
        if (isUndefined(collection)) {
            console.error(`[Collection Not Found]: ${id}`);
        }
        return collection;
    }

    getContent(id: ContentStateKey): Readonly<Content> | undefined {
        const content: Readonly<Content> | undefined = this.state.content.get(id);
        if (isUndefined(content)) {
            console.error(`[Content Not Found]: ${id}`);
        }
        return content;
    }

    loadPersonalizedContent(refId: string): void {
        this.reducer.dispatch(LOAD_PERSONALIZED_COLLECTION, this.reducer.state, refId);
    }

    loadStandardCollections(): void {
        this.reducer.dispatch(LOAD_STANDARD_COLLECTIONS);
    }

    subscribe(callback: Callback): void {
        this.reducer.subscribe(callback);
    }

    unsubscribe(callback: Callback): void {
        this.reducer.unsubscribe(callback);
    }
}
