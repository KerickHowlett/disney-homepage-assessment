import type { ContainerItem, Content } from '../../types';
import { getContentType } from '../get-content-type';
import { getImageUrl } from '../get-image-url';
import { getRating } from '../get-rating';
import { getTitle } from '../get-title';
import { getVideoURL } from '../get-video-url';

export function pluckContent(item: ContainerItem): Content {
    return {
        contentType: getContentType(item.text),
        id: item.contentId,
        image: getImageUrl(item.image),
        rating: getRating(item?.ratings),
        title: getTitle(item.text),
        video: getVideoURL(item),
    };
}
