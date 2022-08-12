import type { Action } from '@common/types';

export type ContainerSetType = 'CuratedSet' | 'SetRef';
export type DefaultData<T> = Readonly<Record<'default', T>>;

export type ContentDefaultMetaData = Readonly<Record<'url', string>>;
export type ContentDefault = DefaultData<ContentDefaultMetaData>;
export type EntityTypes = 'series' | 'program' | 'set';
export type ContentTileType = Readonly<Record<EntityTypes, ContentDefault>>;
export type ContentImageTile = Readonly<Record<'tile', ContentImageTileAspectRatio>>;

export type ContentImageTileAspectRatio = Readonly<Record<'1.78', ContentTileType>>;
export type TextSet = DefaultData<DefaultText>;
export type FullText = Readonly<Record<EntityTypes, TextSet>>;
export type Title = Readonly<Record<'full', FullText>>;
export type Text = Readonly<Record<'title', Title>>;

export type Container = Readonly<Record<'set', ContainerSet>>;
export type StandardCollection = Readonly<Record<'containers', ReadonlyArray<Container>>>;

export type PersonalizedCuratedSet = Readonly<Record<'items', ContainerSetType>>;

export type DefaultText = Readonly<Record<'content', string>>;
export type HomeAPIResponse = Readonly<Record<'data', DataPayloads>>;
export type CollectionId = ContainerSet['setId' | 'refId'];

export type ContentProperties = 'image' | 'title' | 'id';
export type Content = Readonly<Record<ContentProperties, string>>;

export interface ContainerItem {
    readonly contentId: string;
    readonly image: ContentImageTile;
    readonly text: Text;
}

export interface ContainerSet {
    readonly items: ReadonlyArray<ContainerItem>;
    readonly refId?: string;
    readonly setId?: string;
    readonly text: Text;
    readonly type: ContainerSetType;
}

export interface Collection {
    readonly id: CollectionId;
    readonly title: string;
    readonly content?: ContentState;
    readonly type: ContainerSetType;
}

export interface DataPayloads {
    readonly StandardCollection: StandardCollection;
    readonly PersonalizedCuratedSet: PersonalizedCuratedSet;
}

export interface SaveContentStateParams {
    aspectRatio: keyof ContentImageTileAspectRatio;
    existingContentState?: ContentState;
    items: ReadonlyArray<ContainerItem>;
}

export type CollectionStateKey = Collection['id'];
export type CollectionsState = ReadonlyMap<CollectionStateKey, Collection>;

export type ContentStateKey = Content['id'];
export type ContentState = ReadonlyMap<ContentStateKey, Content>;

export type HomeState = {
    readonly collections: CollectionsState;
    readonly response: HomeAPIResponse | null;
};

export type FetchCollections = Action<'FETCH_HOME_API'>;
export type SaveCollections = Action<'SAVE_COLLECTIONS', HomeAPIResponse>;

export type AllHomeActions = FetchCollections | SaveCollections;
export type HomeActionTypes = AllHomeActions['type'];
export type HomeActionPayloads = AllHomeActions['payload'];
