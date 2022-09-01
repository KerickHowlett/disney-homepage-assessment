import { getEnv, isNull } from '@common/utils';
import type {
    ContentImage,
    ContentImageKeys,
    ContentImageTileAspectRatio,
    ContentImageTypes,
} from '@disney/features/home/types';
import { getFirstPropertyValueOfSet } from '../get-first-property-value-of-set';

type ImageFormat = 'jpeg' | 'png';

interface GetContentImageURLOptions {
    readonly aspectRatio: keyof ContentImageTileAspectRatio;
    readonly format: ImageFormat;
    readonly quality: number;
    readonly scalingAlgorithm: string;
    readonly width: number;
}

const DEFAULT_OPTIONS: GetContentImageURLOptions = {
    aspectRatio: '1.78',
    format: 'jpeg',
    quality: 90,
    scalingAlgorithm: 'lanczos3',
    width: 500,
};

export function aspectRatioIsAvailable(
    aspectRatios: ContentImageTileAspectRatio,
    target: keyof ContentImageTileAspectRatio,
): boolean {
    const aspectRatioKeys: Array<keyof ContentImageTileAspectRatio> = Object.keys(aspectRatios || {}) as Array<
        keyof ContentImageTileAspectRatio
    >;
    return aspectRatioKeys.includes(target);
}

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

export function getTargetAspectRatio(
    aspectRatios: ContentImageTileAspectRatio,
    target: keyof ContentImageTileAspectRatio,
): keyof ContentImageTileAspectRatio {
    if (aspectRatioIsAvailable(aspectRatios, target)) return target;
    return getFirstPropertyValueOfSet(aspectRatios);
}

// @NOTE: This is a quick hack since the "collections" (i.e., "Disney Channel Collection")
//        uses "logo" instead of "title_treatment" for the title image property.
export function getTargetImageType(images: ContentImage, imageType: ContentImageKeys): ContentImageKeys | null {
    if (imageType !== 'title_treatment') return imageType;
    return getFirstPropertyValueOfSet(images);
}

/**
 * @param aspectRatio
 * @NOTE: Ideally, the aspectRation would have a means to feed this argument,
 *        dynamically.
 */
export function getContentImageURL(
    images: ContentImage,
    imageType: ContentImageKeys,
    _options: Partial<GetContentImageURLOptions> = {},
): string {
    const options: GetContentImageURLOptions = {
        ...DEFAULT_OPTIONS,
        ..._options,
    };

    const targetImageType: ContentImageKeys | null = getTargetImageType(images, imageType);
    if (isNull(targetImageType)) return '';

    const availableAspectRatios: ContentImageTileAspectRatio = images[targetImageType];
    const { aspectRatio } = options;
    const targetAspectRatio: keyof ContentImageTileAspectRatio = getTargetAspectRatio(
        availableAspectRatios,
        aspectRatio,
    );

    const contentTypes: ContentImageTypes = availableAspectRatios[targetAspectRatio];
    const targetContentType: keyof ContentImageTypes = getFirstPropertyValueOfSet(contentTypes);

    const { masterId } = contentTypes[targetContentType].default;
    return buildImageURL(masterId, options);
}
