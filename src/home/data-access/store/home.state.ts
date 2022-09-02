import { getFrozenMap } from '@disney/shared';
import { CollectionId, CollectionSetType } from './types';

export interface Content {
    readonly contentType: string;
    readonly id: string;
    readonly rating?: string;
    readonly marqueePosterImage: string;
    readonly tileImage: string;
    readonly titleTreatmentImage: string;
    readonly title: string;
    readonly video?: string;
}

export interface Collection {
    readonly id: CollectionId;
    readonly title: string;
    readonly content?: ContentStateKey[];
    readonly type: CollectionSetType;
}

export type CollectionStateKey = Collection['id'];
export type CollectionsState = ReadonlyMap<CollectionStateKey, Collection>;
export type MutableCollections = Map<CollectionStateKey, Collection>;

export type ContentStateKey = Content['id'];
export type ContentState = ReadonlyMap<ContentStateKey, Content>;
export type MutableContent = Map<ContentStateKey, Content>;

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
