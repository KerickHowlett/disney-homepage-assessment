import { getEnv, isNull } from '@common/functions';
import { ContainerType, TARGET_ASPECT_RATIO } from '../constants';
import {
    Container,
    ContainerItem,
    ContainerSet,
    ContainerSetType,
    DisneyHomeResponse,
    FullText,
    HomepageCollection,
    HomepageTile,
    Text,
    Tile,
    TileAspectRation as TileAspectRatio,
    TileType,
} from '../types';

export class HomeApi {
    private static readonly options: Readonly<RequestInit> = {
        method: 'GET',
    };

    constructor(private readonly apiDomain: string = getEnv('DISNEY_API_DOMAIN')) {}

    async get<TResponse = Readonly<unknown>>(uri: string): Promise<TResponse | null> {
        const endpoint = `${this.apiDomain}/${uri}`;

        try {
            const response: Response = await fetch(endpoint, HomeApi.options);
            if (this.isValid(response)) {
                return response.json();
            }
        } catch (error: unknown) {
            console.error(error);
        }

        return null;
    }

    pluckCollections(response: DisneyHomeResponse | null): ReadonlyArray<HomepageCollection> {
        if (isNull(response)) return Object.freeze<HomepageCollection>([]);

        const { containers } = response.data.StandardCollection;
        return Object.freeze<HomepageCollection>(
            containers.map<HomepageCollection>(({ set }: Readonly<Container>) => ({
                title: this.getTitle(set.text),
                type: set.type,
                ...this.setCuratedCollection(set),
                ...this.setRefCollection(set),
            })),
        );
    }

    private getImageUrl(image: Tile, aspectRatio: keyof TileAspectRatio): string {
        const tile: TileType = image.tile[aspectRatio];
        const tileType: keyof TileType = this.getOnlyKey<TileType>(tile);
        return tile[tileType].default.url;
    }

    // @NOTE: Since some datasets only ever one key with these sets, currently,
    //        this will do for now, but a more dynamic approach would be ideal.
    private getOnlyKey<T extends Record<string, unknown>>(data: T): keyof T {
        return Object.keys(data)[0];
    }

    private getTitle(text: Text): string {
        const key: keyof FullText = this.getOnlyKey<FullText>(text.title.full);
        return text.title.full[key].default.content;
    }

    private getHomepageTiles(
        items: ReadonlyArray<ContainerItem>,
        aspectRatio: keyof TileAspectRatio,
    ): ReadonlyArray<HomepageTile> {
        return items.map<HomepageTile>(
            (item: ContainerItem): HomepageTile => ({
                image: this.getImageUrl(item.image, aspectRatio),
                title: this.getTitle(item.text),
            }),
        );
    }

    private isContainerType(type: ContainerSetType, set: Readonly<ContainerSet>): boolean {
        return set.type === type;
    }

    private isValid(response: Response): boolean {
        return response.ok && response.status !== 404;
    }

    private setCuratedCollection(set: Readonly<ContainerSet>): Record<string, string> | Record<never, never> {
        if (!this.isContainerType(ContainerType.CuratedSet, set)) return {};
        return {
            tiles: this.getHomepageTiles(set.items, TARGET_ASPECT_RATIO),
        };
    }

    private setRefCollection(set: Readonly<ContainerSet>): Record<'refId', string> | Record<never, never> {
        if (!this.isContainerType(ContainerType.SetRef, set)) return {};
        return {
            refId: set.refId,
        };
    }
}
