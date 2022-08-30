export type CollectionSetType = 'CuratedSet' | 'SetRef';
export type DefaultData<T> = Readonly<Record<'default', T>>;

export type ContentDefaultMetaData = Readonly<Record<'url', string>>;
export type ContentDefault = DefaultData<ContentDefaultMetaData>;
export type EntityTypes = 'series' | 'program' | 'set' | 'default';
export type ContentTileType = Readonly<Record<EntityTypes, ContentDefault>>;
export type ContentImageTile = Readonly<Record<'tile', ContentImageTileAspectRatio>>;

export type ContentImageTileAspectRatio = Readonly<Record<'1.78', ContentTileType>>;
export type TextSet = DefaultData<DefaultText>;
export type FullText = Readonly<Record<EntityTypes, TextSet>>;
export type Title = Readonly<Record<'full', FullText>>;
export type ItemText = Readonly<Record<'title', Title>>;

export type Container = Readonly<Record<'set', ContainerSet>>;
export type StandardCollection = Readonly<Record<'containers', ReadonlyArray<Container>>>;

export type DefaultText = Readonly<Record<'content' | 'sourceEntity', string>>;
export type SetRefAPIResponse = Readonly<Record<'data', DataPayloadWithPersonalizedCuratedSet>> | null;
export type HomeAPIResponse = Readonly<Record<'data', DataPayloadWithStandardCollection>> | null;

export type RefId = Exclude<ContainerSet['refId'], undefined>;
export type CollectionId = Exclude<ContainerSet['setId' | 'refId'], undefined>;

export type Rating = Readonly<Record<'system' | 'value', string>>;
export type MediaURLRecord = Readonly<Record<'url', string>>;
export type MediaURLs = Readonly<Record<'urls', ReadonlyArray<MediaURLRecord>>>;
export type MediaMetadata = Readonly<Record<'mediaMetadata', MediaURLs>>;

export interface Content {
    readonly contentType: string;
    readonly id: string;
    readonly image: string;
    readonly title: string;
    readonly rating?: string;
    readonly video?: string;
}

export interface ContainerItem {
    readonly contentId: string;
    readonly image: ContentImageTile;
    readonly ratings: ReadonlyArray<Rating>;
    readonly text: ItemText;
    readonly videoArt: ReadonlyArray<MediaMetadata>;
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
    readonly content?: ContentStateKey[];
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

export type MutableCollections = Map<CollectionStateKey, Collection>;
export type MutableContent = Map<ContentStateKey, Content>;

export type ContentStateKey = Content['id'];
export type ContentState = ReadonlyMap<ContentStateKey, Content>;

export type RefIdResponses = ReadonlyMap<RefId, Readonly<SetRefAPIResponse>>;

export interface HomeState {
    readonly collections: CollectionsState;
    readonly content: ContentState;
}
