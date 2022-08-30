import type { ContainerItem, Content } from '../../types';
import { getContentId } from '../get-content-id';
import { getContentType } from '../get-content-type';
import { getImageUrl } from '../get-image-url';
import { getRating } from '../get-rating';
import { getTitle } from '../get-title';
import { getVideoURL } from '../get-video-url';

export function pluckContent(item: ContainerItem): Content {
    return {
        contentType: getContentType(item.text),
        id: getContentId(item),
        image: getImageUrl(item.image),
        rating: getRating(item?.ratings),
        title: getTitle(item.text),
        video: getVideoURL(item),
    };
}
