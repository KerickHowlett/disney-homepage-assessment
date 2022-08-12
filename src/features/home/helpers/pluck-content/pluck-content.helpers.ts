import type { ContainerItem, Content } from '../../types';
import { getImageUrl } from '../get-image-url';
import { getTitle } from '../get-title';

export function pluckContent({ contentId: id, image, text }: ContainerItem): Content {
    return {
        id,
        image: getImageUrl(image),
        title: getTitle(text),
    };
}
