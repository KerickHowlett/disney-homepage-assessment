import type { ContainerItem } from '../../state';

export function getVideoURL(item: ContainerItem): string {
    return item.videoArt[0]?.mediaMetadata.urls[0].url || '';
}
