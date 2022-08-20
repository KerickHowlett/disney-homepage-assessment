import type { Action } from '@common/types';

export type CollectionSetType = 'CuratedSet' | 'SetRef';
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
export type ItemText = Readonly<Record<'title', Title>>;

export type Container = Readonly<Record<'set', ContainerSet>>;
export type StandardCollection = Readonly<Record<'containers', ReadonlyArray<Container>>>;

export type DefaultText = Readonly<Record<'content', string>>;
export type SetRefAPIResponse = Readonly<Record<'data', DataPayloadWithPersonalizedCuratedSet>> | null;
export type HomeAPIResponse = Readonly<Record<'data', DataPayloadWithStandardCollection>> | null;

export type RefId = Exclude<ContainerSet['refId'], undefined>;
export type CollectionId = Exclude<ContainerSet['setId' | 'refId'], undefined>;

export type ContentProperties = 'image' | 'title' | 'id';
export type Content = Readonly<Record<ContentProperties, string>>;

export interface ContainerItem {
    readonly contentId: string;
    readonly image: ContentImageTile;
    readonly text: ItemText;
}

export interface ContainerSet {
    readonly items: ReadonlyArray<ContainerItem>;
    readonly refId?: string;
    readonly setId?: string;
    readonly text: ItemText;
    readonly type: CollectionSetType;
}

export interface Collection {
    readonly id: CollectionId;
    readonly title: string;
    readonly content?: Content[];
    readonly type: CollectionSetType;
}

export type DataPayloadWithStandardCollection = Readonly<Record<'StandardCollection', StandardCollection>>;
export type DataPayloadWithPersonalizedCuratedSet = Readonly<Record<'CuratedSet', ContainerSet>>;

export interface SaveContentStateParams {
    aspectRatio: keyof ContentImageTileAspectRatio;
    existingContentState?: ContentState;
    items: ReadonlyArray<ContainerItem>;
}

export type CollectionStateKey = Collection['id'];
export type CollectionsState = ReadonlyMap<CollectionStateKey, Collection>;

export type ContentStateKey = Content['id'];
export type ContentState = ReadonlyMap<ContentStateKey, Content>;

export type RefIdResponses = ReadonlyMap<RefId, Readonly<SetRefAPIResponse>>;

export interface HomeState {
    readonly collections: CollectionsState;
}

export type LoadStandardCollections = Action<'LOAD_STANDARD_COLLECTIONS'>;
export type LoadPersonalizedCollection = Action<'LOAD_PERSONALIZED_COLLECTION', RefId>;
export interface SaveContentForPersonalizedSetPayload {
    readonly refId: RefId;
    readonly response: Readonly<SetRefAPIResponse>;
}

export type AllHomeActions = LoadStandardCollections | LoadPersonalizedCollection;

export type HomeActionTypes = AllHomeActions['type'];
export type HomeActionPayloads = AllHomeActions['payload'];
