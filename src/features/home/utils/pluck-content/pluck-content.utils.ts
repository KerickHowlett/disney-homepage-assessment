import type { ContainerItem, Content } from '../../types';
import { getContentId } from '../get-content-id';
import { getContentType } from '../get-content-type';
import { getRating } from '../get-rating';
import { getTileImageURL } from '../get-tile-image-url';
import { getTitle } from '../get-title';
import { getTitleTreatmentImageURL } from '../get-title-treatment-image-url';
import { getVideoURL } from '../get-video-url';

export function pluckContent(item: ContainerItem): Content {
    return {
        contentType: getContentType(item.text),
        id: getContentId(item),
        tileImage: getTileImageURL(item.image),
        titleTreatmentImage: getTitleTreatmentImageURL(item.image),
        rating: getRating(item?.ratings),
        title: getTitle(item.text),
        video: getVideoURL(item),
    };
}
