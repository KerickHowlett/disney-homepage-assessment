import type { Content } from '../home.state';
import type { ContainerItem } from '../types';
import { getContentId } from './get-content-id.utils';
import { getContentImageURL } from './get-content-image-url.utils';
import { getContentType } from './get-content-type.utils';
import { getRating } from './get-rating.utils';
import { getTitle } from './get-title.utils';
import { getVideoURL } from './get-video-url.utils';

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
