import { getEnv } from '@disney/shared';
import type { ContentImageTileAspectRatio } from '../types';

export type ImageFormat = 'jpeg' | 'png';

export interface GetContentImageURLOptions {
    readonly aspectRatio: keyof ContentImageTileAspectRatio;
    readonly format: ImageFormat;
    readonly quality: number;
    readonly scalingAlgorithm: string;
    readonly width: number;
}

export const DEFAULT_OPTIONS: GetContentImageURLOptions = {
    aspectRatio: '1.78',
    format: 'jpeg',
    quality: 90,
    scalingAlgorithm: 'lanczos3',
    width: 500,
};

export function buildImageURL(masterId: string, options: GetContentImageURLOptions): string {
    const apiDomain: string = getEnv('DISNEY_ASSET_API_DOMAIN');
    const scaleURLParams: ReadonlyArray<string> = [
        `format=${options.format}`,
        `quality=${options.quality}`,
        `scalingAlgorithm=${options.scalingAlgorithm}`,
        `width=${options.width}`,
    ];
    return `${apiDomain}/${masterId}/scale?${scaleURLParams.join('&')}`;
}
