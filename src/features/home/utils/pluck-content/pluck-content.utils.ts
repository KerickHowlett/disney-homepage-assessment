import type { ContainerItem, Content } from '../../types';
import { getContentId } from '../get-content-id';
import { getContentType } from '../get-content-type';
import { getRating } from '../get-rating';
import { getContentImageURL } from '../get-tile-image-url';
import { getTitle } from '../get-title';
import { getVideoURL } from '../get-video-url';

export function pluckContent(item: ContainerItem): Content {
    return {
        contentType: getContentType(item.text),
        id: getContentId(item),
        rating: getRating(item?.ratings),
        marqueePosterImage: getContentImageURL(item.image, 'hero_collection', { width: 1920 }),
        tileImage: getContentImageURL(item.image, 'tile'),
        title: getTitle(item.text),
        titleTreatmentImage: getContentImageURL(item.image, 'title_treatment', { format: 'png' }),
        video: getVideoURL(item),
    };
}
