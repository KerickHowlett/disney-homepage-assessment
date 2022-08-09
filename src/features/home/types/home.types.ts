export type ContainerSetType = 'CuratedSet' | 'SetRef';
export type DefaultData<T> = Readonly<Record<'default', T>>;

export type TileDefaultMetaData = Readonly<Record<'url', string>>;
export type TileDefault = DefaultData<TileDefaultMetaData>;
export type EntityTypes = 'series' | 'program' | 'set';
export type TileType = Readonly<Record<EntityTypes, TileDefault>>;
export type Tile = Readonly<Record<'tile', TileAspectRation>>;

export type TileAspectRation = Readonly<Record<'1.78', TileType>>;
export type TextSet = DefaultData<DefaultText>;
export type FullText = Readonly<Record<EntityTypes, TextSet>>;
export type Title = Readonly<Record<'full', FullText>>;
export type Text = Readonly<Record<'title', Title>>;

export type Container = Readonly<Record<'set', ContainerSet>>;
export type StandardCollection = Readonly<Record<'containers', ReadonlyArray<Container>>>;

export type PersonalizedCuratedSet = Readonly<Record<'items', ContainerSetType>>;

interface DataPayloads {
    readonly StandardCollection: StandardCollection;
    readonly PersonalizedCuratedSet: PersonalizedCuratedSet;
}

export type DisneyHomeResponse = Readonly<Record<'data', DataPayloads>>;

export type HomepageTile = Readonly<Record<'image' | 'title', string>>;

export type DefaultText = Readonly<Record<'content', string>>;

interface ContainerItem {
    readonly image: Tile;
    readonly text: Text;
}

interface ContainerSet {
    readonly items: ReadonlyArray<ContainerItem>;
    readonly refId?: string;
    readonly setId?: string;
    readonly text: Text;
    readonly type: ContainerSetType;
}

interface HomepageCollection {
    readonly title: string;
    readonly type: ContainerSetType;
    readonly tiles?: ReadonlyArray<HomepageTile>;
    readonly refId?: string;
}

export type { ContainerItem, ContainerSet, DataPayloads, HomepageCollection };
