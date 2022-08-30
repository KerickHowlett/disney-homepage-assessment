import { Singleton } from '@common/decorators';
import type { Callback } from '@common/types';
import { isUndefined } from '@common/utils';
import type { Collection, CollectionStateKey, Content, ContentStateKey, HomeState } from '../../types';
import { byHavingContent, byPersonalizedCollections, byStandardCollections } from '../../utils';
import { OnHomeAction } from './actions';
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
        this.reducer.subscribe(callback);
    }

    unsubscribe(callback: Callback): void {
        this.reducer.unsubscribe(callback);
    }
}
